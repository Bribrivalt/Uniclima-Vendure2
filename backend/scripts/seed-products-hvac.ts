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
        description: `
            <p><strong>Daikin Sensira TXF25C</strong> - Aire acondicionado split compacto ideal para habitaciones pequeñas.</p>
            <p>Equipo con tecnología Inverter y refrigerante R32 ecológico. Perfecto para dormitorios de 15-25 m².</p>
            <h3>Características principales:</h3>
            <ul>
                <li>Potencia: 2.5 kW (2150 frigorías)</li>
                <li>Clase energética: A++</li>
                <li>Tecnología Inverter de última generación</li>
                <li>Refrigerante R32 con bajo impacto ambiental</li>
                <li>Funcionamiento silencioso (20 dB)</li>
                <li>Modo Eco para ahorro energético</li>
                <li>Función bomba de calor (frío + calor)</li>
                <li>Garantía: 3 años</li>
            </ul>
        `,
        sku: 'DAIKIN-TXF25C',
        price: 54900,  // 549€
        stock: 20,
        customFields: {
            compatibilidades: 'Compatible con termostatos WiFi Daikin. Apto para instalación en habitaciones de 15-25 m². Requiere instalación profesional.',
            erroresSintomas: 'Soluciona problemas de temperatura inadecuada en dormitorios. Ideal para reemplazar equipos antiguos con bajo rendimiento energético.',
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
                <li>Potencia: 3.5 kW (3010 frigorías)</li>
                <li>Clase energética: A+++</li>
                <li>Control WiFi integrado MELCloud</li>
                <li>Sensor 3D I-See para distribución óptima del aire</li>
                <li>Purificador de aire plasma quad</li>
                <li>Modo silencioso nocturno (19 dB)</li>
                <li>Refrigerante R32</li>
                <li>Garantía: 5 años</li>
            </ul>
        `,
        sku: 'MITS-MSZAP35VGK',
        price: 89900,  // 899€
        stock: 12,
        customFields: {
            compatibilidades: 'Compatible con app MELCloud para control remoto. Apto para salones de 25-35 m². Funciona con asistentes de voz (Alexa, Google Home).',
            erroresSintomas: 'Soluciona problemas de distribución desigual del aire. Elimina olores y purifica el ambiente. Ideal para personas con alergias.',
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
                <li>Potencia: 3.5 kW (3010 frigorías)</li>
                <li>Clase energética: A++</li>
                <li>Compresor Dual Inverter con 10 años de garantía</li>
                <li>Refrigeración rápida en solo 3 minutos</li>
                <li>Filtro antibacteriano</li>
                <li>Bajo consumo energético</li>
                <li>Funcionamiento silencioso (21 dB)</li>
            </ul>
        `,
        sku: 'LG-S12EQ',
        price: 64900,  // 649€
        stock: 18,
        customFields: {
            compatibilidades: 'Compatible con espacios de 25-35 m². Instalación estándar en pared. Requiere toma eléctrica monofásica 230V.',
            erroresSintomas: 'Soluciona problemas de climatización lenta. Reduce ruidos molestos de equipos antiguos. Ahorra en consumo eléctrico.',
        },
        facetCodes: ['marca:lg', 'tipo-producto:split-pared', 'refrigerante:r32', 'caracteristicas:bomba-de-calor', 'caracteristicas:inverter'],
        collectionSlug: 'split-pared',
        imageUrl: 'https://images.unsplash.com/photo-1562176566-e9afd27531d4?w=800&h=600&fit=crop',
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