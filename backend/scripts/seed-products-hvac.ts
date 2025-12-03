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
                potenciaKw
                frigorias
                claseEnergetica
                refrigerante
                wifi
                garantiaAnos
                seer
                scop
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
        potenciaKw?: number;
        frigorias?: number;
        claseEnergetica?: string;
        refrigerante?: string;
        wifi?: boolean;
        garantiaAnos?: number;
        seer?: number;
        scop?: number;
        nivelSonoroInterior?: number;
        nivelSonoroExterior?: number;
        superficieRecomendada?: string;
        dimensionesInterior?: string;
        dimensionesExterior?: string;
        pesoUnidadInterior?: number;
        pesoUnidadExterior?: number;
        alimentacion?: string;
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
        description: `
            <p><strong>Daikin Sensira TXF25C</strong> - Aire acondicionado split compacto ideal para habitaciones pequeñas.</p>
            <p>Equipo con tecnología Inverter y refrigerante R32 ecológico. Perfecto para dormitorios de 15-25 m².</p>
            <h3>Características principales:</h3>
            <ul>
                <li>Tecnología Inverter de última generación</li>
                <li>Refrigerante R32 con bajo impacto ambiental</li>
                <li>Funcionamiento silencioso (20 dB)</li>
                <li>Modo Eco para ahorro energético</li>
                <li>Función bomba de calor (frío + calor)</li>
            </ul>
        `,
        sku: 'DAIKIN-TXF25C',
        price: 54900,  // 549€
        stock: 20,
        customFields: {
            potenciaKw: 2.5,
            frigorias: 2150,
            claseEnergetica: 'A++',
            refrigerante: 'R32',
            wifi: false,
            garantiaAnos: 3,
            seer: 6.2,
            scop: 4.0,
            nivelSonoroInterior: 20,
            nivelSonoroExterior: 46,
            superficieRecomendada: '15-25 m²',
            dimensionesInterior: '283 x 770 x 198 mm',
            dimensionesExterior: '550 x 658 x 275 mm',
            pesoUnidadInterior: 8.5,
            pesoUnidadExterior: 22.5,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
    },
    // 2. Mitsubishi MSZ-AP35VGK (Split pared WiFi)
    {
        name: 'Mitsubishi Electric MSZ-AP35VGK',
        slug: 'mitsubishi-msz-ap35vgk',
        description: `
            <p><strong>Mitsubishi Electric MSZ-AP35VGK</strong> - Split de pared premium con WiFi integrado.</p>
            <p>La gama AP de Mitsubishi combina diseño elegante con la última tecnología en climatización.</p>
            <h3>Características destacadas:</h3>
            <ul>
                <li>Control WiFi integrado MELCloud</li>
                <li>Sensor 3D I-See para distribución óptima del aire</li>
                <li>Purificador de aire plasma quad</li>
                <li>Modo silencioso nocturno</li>
                <li>Clasificación A+++ en refrigeración</li>
            </ul>
        `,
        sku: 'MITS-MSZAP35VGK',
        price: 89900,  // 899€
        stock: 12,
        customFields: {
            potenciaKw: 3.5,
            frigorias: 3010,
            claseEnergetica: 'A+++',
            refrigerante: 'R32',
            wifi: true,
            garantiaAnos: 5,
            seer: 8.6,
            scop: 5.1,
            nivelSonoroInterior: 19,
            nivelSonoroExterior: 44,
            superficieRecomendada: '25-35 m²',
            dimensionesInterior: '299 x 798 x 232 mm',
            dimensionesExterior: '550 x 800 x 285 mm',
            pesoUnidadInterior: 11,
            pesoUnidadExterior: 34,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:mitsubishi-electric', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter', 'caracteristicas:purificador-de-aire'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1631545806609-12377024ac0c?w=800&h=600&fit=crop',
    },
    // 3. LG Dual Cool S12EQ (Split pared económico)
    {
        name: 'LG Dual Cool S12EQ',
        slug: 'lg-dual-cool-s12eq',
        description: `
            <p><strong>LG Dual Cool S12EQ</strong> - Aire acondicionado split con compresor dual inverter.</p>
            <p>Tecnología Dual Inverter de LG para máxima eficiencia y durabilidad.</p>
            <h3>Ventajas principales:</h3>
            <ul>
                <li>Compresor Dual Inverter con 10 años de garantía</li>
                <li>Refrigeración rápida en solo 3 minutos</li>
                <li>Filtro antibacteriano</li>
                <li>Bajo consumo energético</li>
                <li>Funcionamiento silencioso</li>
            </ul>
        `,
        sku: 'LG-S12EQ',
        price: 64900,  // 649€
        stock: 18,
        customFields: {
            potenciaKw: 3.5,
            frigorias: 3010,
            claseEnergetica: 'A++',
            refrigerante: 'R32',
            wifi: false,
            garantiaAnos: 3,
            seer: 6.6,
            scop: 4.0,
            nivelSonoroInterior: 21,
            nivelSonoroExterior: 48,
            superficieRecomendada: '25-35 m²',
            dimensionesInterior: '282 x 837 x 189 mm',
            dimensionesExterior: '530 x 717 x 230 mm',
            pesoUnidadInterior: 8.4,
            pesoUnidadExterior: 25,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:lg', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1562176566-e9afd27531d4?w=800&h=600&fit=crop',
    },
    // 4. Fujitsu ASY50UI-KL (Split pared alta potencia)
    {
        name: 'Fujitsu ASY50UI-KL',
        slug: 'fujitsu-asy50ui-kl',
        description: `
            <p><strong>Fujitsu ASY50UI-KL</strong> - Split de alta potencia para salones y espacios grandes.</p>
            <p>Equipo de 5kW ideal para estancias de hasta 50m² con tecnología japonesa de primera calidad.</p>
            <h3>Características técnicas:</h3>
            <ul>
                <li>Alta potencia frigorífica: 5kW</li>
                <li>Tecnología Inverter DC</li>
                <li>Filtro Apple-Catequina antibacteriano</li>
                <li>Modo potente para climatización rápida</li>
                <li>Programador semanal integrado</li>
            </ul>
        `,
        sku: 'FUJI-ASY50UIKL',
        price: 109900,  // 1099€
        stock: 8,
        customFields: {
            potenciaKw: 5.0,
            frigorias: 4300,
            claseEnergetica: 'A++',
            refrigerante: 'R32',
            wifi: false,
            garantiaAnos: 3,
            seer: 6.5,
            scop: 4.3,
            nivelSonoroInterior: 25,
            nivelSonoroExterior: 52,
            superficieRecomendada: '40-50 m²',
            dimensionesInterior: '293 x 1116 x 249 mm',
            dimensionesExterior: '620 x 790 x 290 mm',
            pesoUnidadInterior: 14,
            pesoUnidadExterior: 38,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:fujitsu', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
    },
    // 5. Daikin 2MXM40N (Multisplit 2x1)
    {
        name: 'Daikin Multisplit 2MXM40N',
        slug: 'daikin-multisplit-2mxm40n',
        description: `
            <p><strong>Daikin 2MXM40N</strong> - Unidad exterior para sistema multisplit 2x1.</p>
            <p>Una única unidad exterior para conectar 2 splits interiores. Solución perfecta para viviendas con espacio exterior limitado.</p>
            <h3>Beneficios del sistema:</h3>
            <ul>
                <li>Control independiente de cada estancia</li>
                <li>Una sola unidad exterior para 2 interiores</li>
                <li>Tecnología Inverter para máximo ahorro</li>
                <li>Refrigerante R32 ecológico</li>
                <li>Compatible con unidades de pared Sensira</li>
            </ul>
            <p><em>Nota: Unidades interiores vendidas por separado.</em></p>
        `,
        sku: 'DAIKIN-2MXM40N',
        price: 149900,  // 1499€
        stock: 6,
        customFields: {
            potenciaKw: 4.0,
            frigorias: 3440,
            claseEnergetica: 'A++',
            refrigerante: 'R32',
            wifi: false,
            garantiaAnos: 3,
            seer: 7.2,
            scop: 4.3,
            nivelSonoroExterior: 48,
            dimensionesExterior: '620 x 765 x 300 mm',
            pesoUnidadExterior: 43,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:daikin', 'tipo-producto:multisplit', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'multisplit-2x1',
        imageUrl: 'https://images.unsplash.com/photo-1527089969914-0a1ceba89ee4?w=800&h=600&fit=crop',
    },
    // 6. Samsung WindFree (Split pared premium)
    {
        name: 'Samsung WindFree AR12TXCAAWKNEU',
        slug: 'samsung-windfree-ar12',
        description: `
            <p><strong>Samsung WindFree AR12</strong> - Aire acondicionado sin corrientes de aire directo.</p>
            <p>Tecnología exclusiva WindFree™ que dispersa el aire a través de 23.000 micro-orificios, eliminando las corrientes de aire frío.</p>
            <h3>Características innovadoras:</h3>
            <ul>
                <li>Tecnología WindFree™ sin corrientes de aire</li>
                <li>WiFi integrado con SmartThings</li>
                <li>Sensor de movimiento AI Auto Comfort</li>
                <li>Purificador con filtro PM 1.0</li>
                <li>Diseño premium minimalista</li>
            </ul>
        `,
        sku: 'SAMS-AR12TXCAAW',
        price: 94900,  // 949€
        stock: 10,
        customFields: {
            potenciaKw: 3.5,
            frigorias: 3010,
            claseEnergetica: 'A+++',
            refrigerante: 'R32',
            wifi: true,
            garantiaAnos: 3,
            seer: 8.5,
            scop: 4.6,
            nivelSonoroInterior: 16,
            nivelSonoroExterior: 43,
            superficieRecomendada: '25-35 m²',
            dimensionesInterior: '299 x 1055 x 215 mm',
            dimensionesExterior: '545 x 790 x 285 mm',
            pesoUnidadInterior: 12.2,
            pesoUnidadExterior: 32,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:samsung', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter', 'caracteristicas:silencioso-25db', 'caracteristicas:purificador-de-aire'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1567925086983-a3b5a9677bce?w=800&h=600&fit=crop',
    },
    // 7. Panasonic KIT-Z25-VKE (Split ultra silencioso)
    {
        name: 'Panasonic Etherea KIT-Z25-VKE',
        slug: 'panasonic-etherea-z25vke',
        description: `
            <p><strong>Panasonic Etherea Z25-VKE</strong> - El split más silencioso del mercado con tecnología nanoe™X.</p>
            <p>Diseño ultra-elegante con panel frontal completamente plano y tecnología de purificación del aire nanoe™X.</p>
            <h3>Tecnologías exclusivas:</h3>
            <ul>
                <li>nanoe™X: Genera radicales hidroxilo para purificar el aire</li>
                <li>Funcionamiento ultra silencioso (19 dB)</li>
                <li>WiFi integrado con app Comfort Cloud</li>
                <li>Sensor Intelligent ECONAVI</li>
                <li>Diseño premium en blanco mate</li>
            </ul>
        `,
        sku: 'PANA-Z25VKE',
        price: 99900,  // 999€
        stock: 7,
        customFields: {
            potenciaKw: 2.5,
            frigorias: 2150,
            claseEnergetica: 'A+++',
            refrigerante: 'R32',
            wifi: true,
            garantiaAnos: 5,
            seer: 9.4,
            scop: 5.5,
            nivelSonoroInterior: 19,
            nivelSonoroExterior: 44,
            superficieRecomendada: '15-25 m²',
            dimensionesInterior: '295 x 870 x 195 mm',
            dimensionesExterior: '539 x 780 x 289 mm',
            pesoUnidadInterior: 10,
            pesoUnidadExterior: 32,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:panasonic', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter', 'caracteristicas:silencioso-25db', 'caracteristicas:purificador-de-aire', 'caracteristicas:ionizador'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=800&h=600&fit=crop',
    },
    // 8. Toshiba RAS-B10J2KVSG-E (Split económico)
    {
        name: 'Toshiba Shorai Edge RAS-B10J2KVSG-E',
        slug: 'toshiba-shorai-edge-b10',
        description: `
            <p><strong>Toshiba Shorai Edge B10</strong> - Excelente relación calidad-precio con tecnología japonesa.</p>
            <p>El modelo más compacto de la serie Shorai Edge, perfecto para habitaciones pequeñas y dormitorios.</p>
            <h3>Puntos fuertes:</h3>
            <ul>
                <li>Diseño compacto y elegante</li>
                <li>Tecnología Magic Coil anti-suciedad</li>
                <li>Filtro IAQ con plasma ionizador</li>
                <li>Modo silencioso para noches tranquilas</li>
                <li>Control por app Toshiba Home AC</li>
            </ul>
        `,
        sku: 'TOSH-B10J2KVSG',
        price: 59900,  // 599€
        stock: 15,
        customFields: {
            potenciaKw: 2.5,
            frigorias: 2150,
            claseEnergetica: 'A++',
            refrigerante: 'R32',
            wifi: true,
            garantiaAnos: 3,
            seer: 6.8,
            scop: 4.0,
            nivelSonoroInterior: 22,
            nivelSonoroExterior: 46,
            superficieRecomendada: '15-25 m²',
            dimensionesInterior: '293 x 798 x 225 mm',
            dimensionesExterior: '535 x 660 x 275 mm',
            pesoUnidadInterior: 9,
            pesoUnidadExterior: 24,
            alimentacion: 'Monofásico 230V',
        },
        facetCodes: ['marca:toshiba', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:wifi-integrado', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter', 'caracteristicas:ionizador'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1551522355-dbf80597eba8?w=800&h=600&fit=crop',
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
        
        console.log('\n📦 Productos creados:');
        console.log('   ┌────────────────────────────────────────┬────────────┬─────────────┐');
        console.log('   │ Producto                               │ Precio     │ Potencia    │');
        console.log('   ├────────────────────────────────────────┼────────────┼─────────────┤');
        for (const p of HVAC_PRODUCTS) {
            const name = p.name.substring(0, 38).padEnd(38);
            const price = `${(p.price / 100).toFixed(2)}€`.padStart(10);
            const power = `${p.customFields.potenciaKw} kW`.padStart(11);
            console.log(`   │ ${name} │${price} │${power} │`);
        }
        console.log('   └────────────────────────────────────────┴────────────┴─────────────┘');
        
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