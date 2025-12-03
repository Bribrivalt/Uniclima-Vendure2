/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Update Product Images
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Descarga imágenes de URLs y las asigna a los productos existentes.
 * 
 * Ejecutar con: npx tsx scripts/update-product-images.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

import * as https from 'https';
import * as http from 'http';

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

const GET_PRODUCTS_QUERY = `
    query GetProducts {
        products {
            items {
                id
                slug
                name
                featuredAsset {
                    id
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
        }
    }
`;

// ─────────────────────────────────────────────────────────────────────────
// MAPEO DE PRODUCTOS E IMÁGENES
// ─────────────────────────────────────────────────────────────────────────

const PRODUCT_IMAGES: Record<string, string> = {
    'daikin-sensira-txf25c': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
    'mitsubishi-msz-ap35vgk': 'https://images.unsplash.com/photo-1631545806609-12377024ac0c?w=800&h=600&fit=crop',
    'lg-dual-cool-s12eq': 'https://images.unsplash.com/photo-1562176566-e9afd27531d4?w=800&h=600&fit=crop',
    'fujitsu-asy50ui-kl': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
    'daikin-multisplit-2mxm40n': 'https://images.unsplash.com/photo-1527089969914-0a1ceba89ee4?w=800&h=600&fit=crop',
    'samsung-windfree-ar12': 'https://images.unsplash.com/photo-1567925086983-a3b5a9677bce?w=800&h=600&fit=crop',
    'panasonic-etherea-z25vke': 'https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=800&h=600&fit=crop',
    'toshiba-shorai-edge-b10': 'https://images.unsplash.com/photo-1551522355-dbf80597eba8?w=800&h=600&fit=crop',
    'daikin-sensira-txf35c': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
};

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

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        📷 UPDATE PRODUCT IMAGES - Uniclima Vendure            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener productos existentes
        console.log('\n📋 Obteniendo productos...');
        const productsData = await graphqlRequest(GET_PRODUCTS_QUERY);
        const products = productsData.products.items;
        console.log(`   ✅ Encontrados: ${products.length} productos`);

        // 3. Actualizar imágenes
        console.log('\n📷 Actualizando imágenes...');
        console.log('─'.repeat(60));

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            const imageUrl = PRODUCT_IMAGES[product.slug];
            
            if (!imageUrl) {
                console.log(`\n   ⏭️  "${product.name}" - Sin URL de imagen definida`);
                skippedCount++;
                continue;
            }

            if (product.featuredAsset) {
                console.log(`\n   ⏭️  "${product.name}" - Ya tiene imagen asignada`);
                skippedCount++;
                continue;
            }

            console.log(`\n   📦 ${product.name}`);
            console.log(`      Descargando imagen...`);

            try {
                const imageBuffer = await downloadImage(imageUrl);
                console.log(`      ✅ Imagen descargada (${(imageBuffer.length / 1024).toFixed(1)} KB)`);

                const filename = `${product.slug}.jpg`;
                const assetId = await uploadAsset(imageBuffer, filename);

                if (assetId) {
                    await graphqlRequest(UPDATE_PRODUCT_MUTATION, {
                        input: {
                            id: product.id,
                            featuredAssetId: assetId,
                            assetIds: [assetId],
                        }
                    });
                    console.log(`      ✅ Imagen asignada (Asset ID: ${assetId})`);
                    updatedCount++;
                } else {
                    console.log(`      ❌ No se pudo subir la imagen`);
                    errorCount++;
                }
            } catch (error: any) {
                console.log(`      ❌ Error: ${error.message}`);
                errorCount++;
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ ACTUALIZACIÓN COMPLETADA                           ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        console.log('📊 Resumen:');
        console.log(`   • Productos actualizados: ${updatedCount}`);
        console.log(`   • Productos omitidos: ${skippedCount}`);
        console.log(`   • Errores: ${errorCount}`);
        console.log('\n🔗 Verifica en: http://localhost:3001/dashboard → Catalog → Products\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();