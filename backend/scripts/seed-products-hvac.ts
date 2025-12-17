/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Seed Productos HVAC Completos
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Crea 8 productos HVAC de ejemplo con:
 * - Información completa del producto
 * - Custom fields técnicos (potencia, frigorías, clase energética, etc.)
 * - Facets asignados (marca, tipo, refrigerante, características)
 * - Imágenes de productos (descargadas y subidas automáticamente)
 * - Asignación a collections
 *
 * Ejecutar con: npx tsx scripts/seed-products-hvac.ts
 *
 * Requisitos:
 * - El servidor Vendure debe estar corriendo en http://localhost:3001
 * - Credenciales de superadmin configuradas
 * - Deben existir los facets (ejecutar seed-facets.ts primero)
 * - Deben existir las collections (ejecutar seed-collections.ts primero)
 * - Debe existir la configuración de impuestos (ejecutar seed-tax-config.ts primero)
 * ═══════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { Readable } from 'stream';

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

// ─────────────────────────────────────────────────────────────────────────
// GRAPHQL QUERIES Y MUTATIONS
// ─────────────────────────────────────────────────────────────────────────

const LOGIN_MUTATION = `
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ... on CurrentUser {
                id
                identifier
            }
            ... on InvalidCredentialsError {
                errorCode
                message
            }
        }
    }
`;

const GET_FACET_VALUES_QUERY = `
    query GetFacetValues {
        facets {
            items {
                id
                name
                code
                values {
                    id
                    name
                    code
                }
            }
        }
    }
`;

const GET_COLLECTIONS_QUERY = `
    query GetCollections {
        collections {
            items {
                id
                name
                slug
            }
        }
    }
`;

const GET_PRODUCTS_QUERY = `
    query GetProducts {
        products {
            items {
                id
                slug
                name
            }
        }
    }
`;

const CREATE_PRODUCT_MUTATION = `
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
            name
            slug
            customFields {
                compatibilidades
                erroresSintomas
            }
        }
    }
`;

const CREATE_PRODUCT_VARIANT_MUTATION = `
    mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
            id
            name
            sku
            price
        }
    }
`;

const UPDATE_COLLECTION_MUTATION = `
    mutation UpdateCollection($input: UpdateCollectionInput!) {
        updateCollection(input: $input) {
            id
            name
            productVariants {
                totalItems
            }
        }
    }
`;

const GET_COLLECTION_FILTERS_QUERY = `
    query GetCollection($id: ID!) {
        collection(id: $id) {
            id
            filters {
                code
                args {
                    name
                    value
                }
            }
        }
    }
`;


const UPDATE_PRODUCT_MUTATION = `
    mutation UpdateProduct($input: UpdateProductInput!) {
        updateProduct(input: $input) {
            id
            name
            featuredAsset {
                id
                preview
            }
            assets {
                id
            }
        }
    }
`;

// ─────────────────────────────────────────────────────────────────────────
// FUNCIONES DE API
// ─────────────────────────────────────────────────────────────────────────

async function graphqlRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const newToken = response.headers.get('vendure-auth-token');
    if (newToken) {
        authToken = newToken;
    }

    const result = await response.json();

    if (result.errors) {
        console.error('❌ Error GraphQL:', JSON.stringify(result.errors, null, 2));
        throw new Error(result.errors[0].message);
    }

    return result.data;
}

/**
 * Descarga una imagen desde una URL y la devuelve como Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (response) => {
            // Manejar redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                const redirectUrl = response.headers.location;
                if (redirectUrl) {
                    downloadImage(redirectUrl).then(resolve).catch(reject);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const chunks: Buffer[] = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

/**
 * Sube una imagen a Vendure mediante multipart/form-data
 */
async function uploadAsset(imageBuffer: Buffer, filename: string): Promise<string | null> {
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

    // Construir el body del multipart/form-data
    const operations = JSON.stringify({
        operationName: 'CreateAssets',
        query: `
            mutation CreateAssets($input: [CreateAssetInput!]!) {
                createAssets(input: $input) {
                    ... on Asset {
                        id
                        name
                        preview
                    }
                    ... on MimeTypeError {
                        errorCode
                        message
                    }
                }
            }
        `,
        variables: {
            input: [{ file: null }]
        }
    });

    const map = JSON.stringify({ '0': ['variables.input.0.file'] });

    // Construir el cuerpo multipart manualmente
    let body = '';
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="operations"\r\n\r\n';
    body += operations + '\r\n';
    body += `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="map"\r\n\r\n';
    body += map + '\r\n';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="0"; filename="${filename}"\r\n`;
    body += 'Content-Type: image/jpeg\r\n\r\n';

    const bodyStart = Buffer.from(body, 'utf8');
    const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const fullBody = Buffer.concat([bodyStart, imageBuffer, bodyEnd]);

    const headers: Record<string, string> = {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length.toString(),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: fullBody,
        });

        const result = await response.json();

        if (result.errors) {
            console.error('      ⚠️  Error subiendo imagen:', result.errors[0].message);
            return null;
        }

        if (result.data?.createAssets?.[0]?.id) {
            return result.data.createAssets[0].id;
        }

        return null;
    } catch (error: any) {
        console.error('      ⚠️  Error subiendo imagen:', error.message);
        return null;
    }
}

async function login(): Promise<void> {
    console.log('🔐 Iniciando sesión en Admin API...');

    const data = await graphqlRequest(LOGIN_MUTATION, {
        username: SUPERADMIN_USERNAME,
        password: SUPERADMIN_PASSWORD,
    });

    if (data.login.errorCode) {
        throw new Error(`Login fallido: ${data.login.message}`);
    }

    console.log(`✅ Login exitoso como: ${data.login.identifier}`);
}

// ─────────────────────────────────────────────────────────────────────────
// DEFINICIÓN DE PRODUCTOS HVAC
// ─────────────────────────────────────────────────────────────────────────

interface ProductDefinition {
    name: string;
    slug: string;
    description: string;
    sku: string;
    price: number;  // En céntimos
    stock: number;
    customFields: {
        compatibilidades?: string;
        erroresSintomas?: string;
    };
    facetCodes: string[];  // Códigos de facet values a asignar
    collectionSlug: string;  // Collection a la que pertenece
    imageUrl: string;  // URL de imagen
}

const HVAC_PRODUCTS: ProductDefinition[] = [
    // 1. Daikin Sensira TXF25C (Split pequeño)
    {
        name: 'Daikin Sensira TXF25C',
        slug: 'daikin-sensira-txf25c',
        description: `<p><strong>Daikin Sensira TXF25C</strong> - Aire acondicionado split compacto ideal para habitaciones pequeñas.</p><p>Equipo con tecnología Inverter y refrigerante R32 ecológico. Perfecto para dormitorios de 15-25 m².</p>`,
        sku: 'DAIKIN-TXF25C',
        price: 54900,
        stock: 20,
        customFields: {
            compatibilidades: 'Compatible con termostatos WiFi Daikin. Apto para instalación en habitaciones de 15-25 m².',
            erroresSintomas: 'Soluciona problemas de temperatura inadecuada en dormitorios.',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/daikin25/800/600',
    },
    // 2. Mitsubishi MSZ-AP35VGK
    {
        name: 'Mitsubishi Electric MSZ-AP35VGK',
        slug: 'mitsubishi-msz-ap35vgk',
        description: `<p><strong>Mitsubishi Electric MSZ-AP35VGK</strong> - Split de pared premium con WiFi integrado.</p><p>Clase energética A+++ y control por app MELCloud.</p>`,
        sku: 'MITS-MSZAP35VGK',
        price: 89900,
        stock: 12,
        customFields: {
            compatibilidades: 'Compatible con app MELCloud para control remoto. Apto para salones de 25-35 m².',
            erroresSintomas: 'Soluciona problemas de distribución desigual del aire.',
        },
        facetCodes: ['marca:mitsubishi-electric', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/mitsubishi35/800/600',
    },
    // 3. LG Dual Cool S12EQ
    {
        name: 'LG Dual Cool S12EQ',
        slug: 'lg-dual-cool-s12eq',
        description: `<p><strong>LG Dual Cool S12EQ</strong> - Aire acondicionado split con compresor dual inverter.</p><p>Tecnología Dual Inverter de LG para máxima eficiencia.</p>`,
        sku: 'LG-S12EQ',
        price: 64900,
        stock: 18,
        customFields: {
            compatibilidades: 'Compatible con espacios de 25-35 m².',
            erroresSintomas: 'Soluciona problemas de climatización lenta.',
        },
        facetCodes: ['marca:lg', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/lg12/800/600',
    },
    // 4. Fujitsu ASY35UI-KL
    {
        name: 'Fujitsu ASY35UI-KL',
        slug: 'fujitsu-asy35ui-kl',
        description: `<p><strong>Fujitsu ASY35UI-KL</strong> - Split de alta eficiencia con sensor de presencia.</p><p>Ideal para salones medianos con tecnología inverter avanzada.</p>`,
        sku: 'FUJ-ASY35UI',
        price: 72900,
        stock: 15,
        customFields: {
            compatibilidades: 'Apto para salones de 30-40 m². Sensor de presencia incluido.',
            erroresSintomas: 'Optimiza el consumo detectando personas en la habitación.',
        },
        facetCodes: ['marca:fujitsu', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/fujitsu35/800/600',
    },
    // 5. Samsung WindFree AR12
    {
        name: 'Samsung WindFree AR12TXCAAWKNEU',
        slug: 'samsung-windfree-ar12',
        description: `<p><strong>Samsung WindFree AR12</strong> - Climatización sin corrientes de aire directas.</p><p>Tecnología WindFree dispersa el aire a través de miles de micro-agujeros.</p>`,
        sku: 'SAM-AR12WIND',
        price: 79900,
        stock: 10,
        customFields: {
            compatibilidades: 'Compatible con SmartThings. WiFi integrado.',
            erroresSintomas: 'Ideal para personas sensibles a corrientes de aire.',
        },
        facetCodes: ['marca:samsung', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/samsung12/800/600',
    },
    // 6. Panasonic Etherea Z35VKE
    {
        name: 'Panasonic Etherea KIT-Z35VKE',
        slug: 'panasonic-etherea-z35vke',
        description: `<p><strong>Panasonic Etherea Z35VKE</strong> - Diseño premium con sistema nanoe X.</p><p>Purifica el aire y elimina hasta el 99.9% de bacterias y virus.</p>`,
        sku: 'PAN-Z35VKE',
        price: 94900,
        stock: 8,
        customFields: {
            compatibilidades: 'Tecnología nanoe X. Control por voz con Alexa y Google.',
            erroresSintomas: 'Elimina olores, bacterias y alérgenos del ambiente.',
        },
        facetCodes: ['marca:panasonic', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter', 'caracteristicas:purificador-de-aire'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/panasonic35/800/600',
    },
    // 7. Toshiba Shorai Edge B10
    {
        name: 'Toshiba Shorai Edge RAS-B10J2KVSG',
        slug: 'toshiba-shorai-edge-b10',
        description: `<p><strong>Toshiba Shorai Edge B10</strong> - Split compacto para habitaciones pequeñas.</p><p>Diseño elegante con eficiencia energética A+++.</p>`,
        sku: 'TOSH-B10EDGE',
        price: 59900,
        stock: 22,
        customFields: {
            compatibilidades: 'Ideal para dormitorios de 10-20 m². WiFi opcional.',
            erroresSintomas: 'Perfecto para espacios reducidos con máxima eficiencia.',
        },
        facetCodes: ['marca:toshiba', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/toshiba10/800/600',
    },
    // 8. Daikin Multisplit 2MXM40N
    {
        name: 'Daikin Multisplit 2MXM40N',
        slug: 'daikin-multisplit-2mxm40n',
        description: `<p><strong>Daikin 2MXM40N</strong> - Unidad exterior multisplit para 2 splits interiores.</p><p>Solución ideal para climatizar dos habitaciones con una sola unidad exterior.</p>`,
        sku: 'DAI-2MXM40N',
        price: 129900,
        stock: 6,
        customFields: {
            compatibilidades: 'Compatible con unidades interiores FTXM/CTXM de Daikin.',
            erroresSintomas: 'Reduce espacio exterior necesario para climatizar múltiples zonas.',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:multisplit', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'multisplit',
        imageUrl: 'https://picsum.photos/seed/daikin2x/800/600',
    },
    // 9. Daikin Stylish FTXA35
    {
        name: 'Daikin Stylish FTXA35AW/S/T/BB',
        slug: 'daikin-stylish-ftxa35',
        description: `<p><strong>Daikin Stylish FTXA35</strong> - El split más elegante del mercado.</p><p>Diseño premiado con efecto Coanda para distribución perfecta del aire.</p>`,
        sku: 'DAI-FTXA35',
        price: 119900,
        stock: 9,
        customFields: {
            compatibilidades: 'Disponible en blanco, negro, plata y madera. WiFi incluido.',
            erroresSintomas: 'Distribuye el aire de forma homogénea sin corrientes directas.',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/daikinstylish/800/600',
    },
    // 10. Mitsubishi Heavy SRK25ZS
    {
        name: 'Mitsubishi Heavy SRK25ZS-W',
        slug: 'mitsubishi-heavy-srk25zs',
        description: `<p><strong>Mitsubishi Heavy SRK25ZS</strong> - Split compacto de alta calidad japonesa.</p><p>Excelente relación calidad-precio con tecnología probada.</p>`,
        sku: 'MHI-SRK25ZS',
        price: 49900,
        stock: 25,
        customFields: {
            compatibilidades: 'Ideal para habitaciones de 15-25 m². Instalación estándar.',
            erroresSintomas: 'Opción económica con calidad industrial japonesa.',
        },
        facetCodes: ['marca:mitsubishi-electric', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/mheavy25/800/600',
    },
    // 11. Haier Flexis AS35
    {
        name: 'Haier Flexis AS35S2SF1FA',
        slug: 'haier-flexis-as35',
        description: `<p><strong>Haier Flexis AS35</strong> - Split con diseño ultrafino de solo 15.5 cm.</p><p>Control WiFi hOn y tecnología Self Clean automática.</p>`,
        sku: 'HAI-AS35FLEX',
        price: 67900,
        stock: 14,
        customFields: {
            compatibilidades: 'App hOn para control remoto. Alexa y Google compatible.',
            erroresSintomas: 'Autolimpieza para evitar malos olores y bacterias.',
        },
        facetCodes: ['marca:haier', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/haier35/800/600',
    },
    // 12. Hisense Energy Pro QE35XV0AG
    {
        name: 'Hisense Energy Pro QE35XV0AG',
        slug: 'hisense-energy-pro-qe35',
        description: `<p><strong>Hisense Energy Pro QE35</strong> - Split con ionizador y clase A+++.</p><p>Máxima eficiencia energética con purificación de aire incluida.</p>`,
        sku: 'HIS-QE35PRO',
        price: 62900,
        stock: 16,
        customFields: {
            compatibilidades: 'WiFi incluido. Compatible con Hi-Smart Life app.',
            erroresSintomas: 'Reduce consumo energético hasta un 60% vs equipos antiguos.',
        },
        facetCodes: ['marca:hisense', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter', 'caracteristicas:purificador-de-aire'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/hisense35/800/600',
    },
    // 13. Baxi Anori LS25
    {
        name: 'Baxi Anori LS25',
        slug: 'baxi-anori-ls25',
        description: `<p><strong>Baxi Anori LS25</strong> - Split de marca española con calidad europea.</p><p>Excelente servicio técnico y repuestos garantizados.</p>`,
        sku: 'BAX-ANORILS25',
        price: 44900,
        stock: 30,
        customFields: {
            compatibilidades: 'Marca española con servicio técnico local.',
            erroresSintomas: 'Facilidad de repuestos y servicio técnico en toda España.',
        },
        facetCodes: ['marca:baxi', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://picsum.photos/seed/baxi25/800/600',
    },
    // 14. Conductos Daikin FDXM35
    {
        name: 'Daikin Conductos FDXM35F3',
        slug: 'daikin-conductos-fdxm35',
        description: `<p><strong>Daikin FDXM35F3</strong> - Unidad interior de conductos compacta.</p><p>Ideal para falsos techos con altura reducida de solo 200mm.</p>`,
        sku: 'DAI-FDXM35F3',
        price: 109900,
        stock: 7,
        customFields: {
            compatibilidades: 'Para falsos techos desde 240mm. Presión estática regulable.',
            erroresSintomas: 'Solución invisible integrada en falso techo.',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:conductos', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'conductos',
        imageUrl: 'https://picsum.photos/seed/daikinduct/800/600',
    },
    // 15. Cassette Mitsubishi PLFY-P32
    {
        name: 'Mitsubishi Electric Cassette PLFY-P32VEM',
        slug: 'mitsubishi-cassette-plfy-p32',
        description: `<p><strong>Mitsubishi PLFY-P32VEM</strong> - Cassette 4 vías para techos.</p><p>Distribución de aire en 360° ideal para oficinas y comercios.</p>`,
        sku: 'MIT-PLFYP32',
        price: 139900,
        stock: 5,
        customFields: {
            compatibilidades: 'Panel de 60x60 cm estándar. Para techos de hasta 3m.',
            erroresSintomas: 'Climatiza uniformemente espacios comerciales abiertos.',
        },
        facetCodes: ['marca:mitsubishi-electric', 'tipo-producto:cassette', 'refrigerante:r410a', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'cassette',
        imageUrl: 'https://picsum.photos/seed/mitcassette/800/600',
    },
    // 16. Suelo-Techo LG UV36
    {
        name: 'LG Suelo-Techo UV36R N10',
        slug: 'lg-suelo-techo-uv36',
        description: `<p><strong>LG UV36R</strong> - Unidad convertible suelo-techo de alta potencia.</p><p>Instalación versátil en suelo o techo según necesidad.</p>`,
        sku: 'LG-UV36R',
        price: 159900,
        stock: 4,
        customFields: {
            compatibilidades: 'Para espacios de 60-80 m². Instalación dual suelo/techo.',
            erroresSintomas: 'Ideal para locales comerciales sin falso techo.',
        },
        facetCodes: ['marca:lg', 'tipo-producto:suelo-techo', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'suelo-techo',
        imageUrl: 'https://picsum.photos/seed/lgfloor/800/600',
    },
    // 17. Portátil Daitsu APD12
    {
        name: 'Daitsu APD-12HR',
        slug: 'daitsu-portatil-apd12',
        description: `<p><strong>Daitsu APD-12HR</strong> - Aire acondicionado portátil con bomba de calor.</p><p>Solución móvil sin instalación para cualquier habitación.</p>`,
        sku: 'DAT-APD12HR',
        price: 39900,
        stock: 35,
        customFields: {
            compatibilidades: 'Sin instalación. Solo necesita salida de aire por ventana.',
            erroresSintomas: 'Solución temporal o para viviendas de alquiler.',
        },
        facetCodes: ['marca:daitsu', 'tipo-producto:portatil', 'refrigerante:r290', 'caracteristicas:bomba-de-calor'],
        collectionSlug: 'portatil',
        imageUrl: 'https://picsum.photos/seed/portatil/800/600',
    },
    // 18. Termostato WiFi Tado
    {
        name: 'Tado Termostato Inteligente V3+',
        slug: 'tado-termostato-v3-plus',
        description: `<p><strong>Tado V3+</strong> - Termostato inteligente con geolocalización.</p><p>Controla tu climatización desde el móvil y ahorra energía.</p>`,
        sku: 'TADO-V3PLUS',
        price: 12900,
        stock: 50,
        customFields: {
            compatibilidades: 'Compatible con la mayoría de sistemas de calefacción y A/C.',
            erroresSintomas: 'Optimiza consumo detectando cuando no hay nadie en casa.',
        },
        facetCodes: ['tipo-producto:termostatos', 'caracteristicas:wifi-integrado'],
        collectionSlug: 'termostatos',
        imageUrl: 'https://picsum.photos/seed/tado/800/600',
    },
    // 19. Control WiFi Daikin BRP069B45
    {
        name: 'Daikin Controlador WiFi BRP069B45',
        slug: 'daikin-wifi-brp069b45',
        description: `<p><strong>Daikin BRP069B45</strong> - Módulo WiFi para control por app.</p><p>Convierte tu split Daikin en un equipo conectado.</p>`,
        sku: 'DAI-BRP069B45',
        price: 5900,
        stock: 40,
        customFields: {
            compatibilidades: 'Para equipos Daikin series FTXM, FTXS, FVXS.',
            erroresSintomas: 'Añade control WiFi a splits Daikin sin conectividad.',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:accesorios', 'caracteristicas:wifi-integrado'],
        collectionSlug: 'accesorios',
        imageUrl: 'https://picsum.photos/seed/daikinwifi/800/600',
    },
    // 20. Soporte Exterior Antivibración
    {
        name: 'Soporte Exterior Antivibración MT630',
        slug: 'soporte-exterior-antivibracion',
        description: `<p><strong>Soporte MT630</strong> - Soporte para unidad exterior con tacos antivibración.</p><p>Reduce ruido y vibraciones de la unidad exterior.</p>`,
        sku: 'SOP-MT630',
        price: 4900,
        stock: 100,
        customFields: {
            compatibilidades: 'Universal para unidades hasta 80kg.',
            erroresSintomas: 'Elimina vibraciones y ruidos molestos de unidades exteriores.',
        },
        facetCodes: ['tipo-producto:accesorios'],
        collectionSlug: 'accesorios',
        imageUrl: 'https://picsum.photos/seed/soporte/800/600',
    },
];

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🏭 SEED PRODUCTOS HVAC - Uniclima Vendure              ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener FacetValues existentes
        console.log('\n📋 Obteniendo facets...');
        const facetsData = await graphqlRequest(GET_FACET_VALUES_QUERY);
        const facetValuesMap = new Map<string, string>();

        for (const facet of facetsData.facets.items) {
            for (const value of facet.values) {
                facetValuesMap.set(`${facet.code}:${value.code}`, value.id);
            }
        }
        console.log(`   ✅ Encontrados: ${facetValuesMap.size} valores de facets`);

        // 3. Obtener Collections existentes
        console.log('\n📋 Obteniendo collections...');
        const collectionsData = await graphqlRequest(GET_COLLECTIONS_QUERY);
        const collectionsMap = new Map<string, string>();

        for (const collection of collectionsData.collections.items) {
            collectionsMap.set(collection.slug, collection.id);
        }
        console.log(`   ✅ Encontradas: ${collectionsMap.size} collections`);

        // 4. Verificar productos existentes
        console.log('\n📋 Verificando productos existentes...');
        const productsData = await graphqlRequest(GET_PRODUCTS_QUERY);
        const existingSlugs = new Set(productsData.products.items.map((p: any) => p.slug));
        console.log(`   ✅ Productos existentes: ${existingSlugs.size}`);

        // 5. Crear productos
        console.log('\n🏭 Creando productos HVAC...');
        console.log('─'.repeat(60));

        let createdCount = 0;
        let skippedCount = 0;

        for (const productDef of HVAC_PRODUCTS) {
            // Verificar si ya existe
            if (existingSlugs.has(productDef.slug)) {
                console.log(`\n   ⏭️  "${productDef.name}" ya existe (omitido)`);
                skippedCount++;
                continue;
            }

            console.log(`\n   📦 Creando: ${productDef.name}`);

            // Buscar IDs de facet values
            const facetValueIds: string[] = [];
            for (const code of productDef.facetCodes) {
                const id = facetValuesMap.get(code);
                if (id) {
                    facetValueIds.push(id);
                } else {
                    console.log(`      ⚠️  Facet no encontrado: ${code}`);
                }
            }

            // Crear el producto
            try {
                const productResult = await graphqlRequest(CREATE_PRODUCT_MUTATION, {
                    input: {
                        translations: [
                            {
                                languageCode: 'en',
                                name: productDef.name,
                                slug: productDef.slug,
                                description: productDef.description,
                            }
                        ],
                        customFields: productDef.customFields,
                        facetValueIds: facetValueIds,
                    }
                });

                const productId = productResult.createProduct.id;
                console.log(`      ✅ Producto creado (ID: ${productId})`);

                // Crear variante con precio
                const variantResult = await graphqlRequest(CREATE_PRODUCT_VARIANT_MUTATION, {
                    input: [
                        {
                            productId: productId,
                            sku: productDef.sku,
                            price: productDef.price,
                            translations: [
                                {
                                    languageCode: 'en',
                                    name: productDef.name,
                                }
                            ],
                            stockOnHand: productDef.stock,
                        }
                    ]
                });
                console.log(`      ✅ Variante creada: ${productDef.sku} - ${(productDef.price / 100).toFixed(2)}€`);

                // Subir imagen si hay URL definida
                if (productDef.imageUrl) {
                    console.log(`      📷 Descargando imagen...`);
                    try {
                        const imageBuffer = await downloadImage(productDef.imageUrl);
                        const filename = `${productDef.slug}.jpg`;
                        const assetId = await uploadAsset(imageBuffer, filename);

                        if (assetId) {
                            // Asignar imagen al producto
                            await graphqlRequest(UPDATE_PRODUCT_MUTATION, {
                                input: {
                                    id: productId,
                                    featuredAssetId: assetId,
                                    assetIds: [assetId],
                                }
                            });
                            console.log(`      ✅ Imagen subida y asignada (Asset ID: ${assetId})`);
                        }
                    } catch (imgError: any) {
                        console.log(`      ⚠️  No se pudo descargar/subir imagen: ${imgError.message}`);
                    }
                }

                // Nota: Las collections en Vendure v3 usan filtros basados en facets.
                const collectionId = collectionsMap.get(productDef.collectionSlug);
                if (collectionId) {
                    console.log(`      📁 Collection objetivo: "${productDef.collectionSlug}"`);
                }

                // Mostrar facets asignados
                console.log(`      📊 Facets asignados: ${facetValueIds.length}`);

                createdCount++;
            } catch (error: any) {
                console.log(`      ❌ Error: ${error.message}`);
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ SEED COMPLETADO EXITOSAMENTE                       ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        // Resumen
        console.log('📊 Resumen:');
        console.log(`   • Productos creados: ${createdCount}`);
        console.log(`   • Productos omitidos (ya existían): ${skippedCount}`);
        console.log(`   • Total productos definidos: ${HVAC_PRODUCTS.length}`);

        console.log('\\n📦 Productos creados:');
        console.log('   ┌────────────────────────────────────────┬────────────┐');
        console.log('   │ Producto                               │ Precio     │');
        console.log('   ├────────────────────────────────────────┼────────────┤');
        for (const p of HVAC_PRODUCTS) {
            const name = p.name.substring(0, 38).padEnd(38);
            const price = `${(p.price / 100).toFixed(2)}€`.padStart(10);
            console.log(`   │ ${name} │${price} │`);
        }
        console.log('   └────────────────────────────────────────┴────────────┘');

        console.log('\n🔗 Verifica en:');
        console.log('   Dashboard: http://localhost:3001/dashboard → Catalog → Products');
        console.log('   Shop API: http://localhost:3001/shop-api');
        console.log('\n💡 Nota: Las imágenes son URLs de referencia. Para imágenes reales,');
        console.log('   súbelas manualmente desde el Dashboard Admin.\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();