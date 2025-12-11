/**
 * Script para eliminar todos los productos de Vendure
 * 
 * Esto permite empezar de cero con la importación de productos.
 * 
 * Uso:
 *   npx ts-node scripts/reset-products.ts
 */

const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

/**
 * Ejecuta una query GraphQL contra la Admin API
 */
async function adminApiQuery(query: string, variables: Record<string, unknown> = {}): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const vendureAuthToken = response.headers.get('vendure-auth-token');
    if (vendureAuthToken) {
        authToken = vendureAuthToken;
    }

    const result = await response.json();
    
    if (result.errors) {
        console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
        throw new Error(result.errors[0]?.message || 'GraphQL Error');
    }

    return result.data;
}

/**
 * Autenticación con la Admin API
 */
async function login(): Promise<void> {
    console.log('🔐 Autenticando con la Admin API...');
    
    const query = `
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

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables: {
                username: SUPERADMIN_USERNAME,
                password: SUPERADMIN_PASSWORD,
            }
        }),
    });

    const vendureAuthToken = response.headers.get('vendure-auth-token');
    if (vendureAuthToken) {
        authToken = vendureAuthToken;
        console.log(`🔑 Token obtenido: ${authToken.substring(0, 20)}...`);
    }

    const result = await response.json();
    
    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Login error');
    }

    const data = result.data;

    if (data.login.errorCode) {
        throw new Error(`Login failed: ${data.login.message}`);
    }

    console.log(`✅ Autenticado como: ${data.login.identifier}`);
}

/**
 * Obtiene todos los productos
 */
async function getAllProducts(): Promise<{ id: string; name: string }[]> {
    const query = `
        query GetAllProducts {
            products(options: { take: 1000 }) {
                items {
                    id
                    name
                }
                totalItems
            }
        }
    `;

    const result = await adminApiQuery(query);
    console.log(`📦 Encontrados ${result.products.totalItems} productos`);
    return result.products.items;
}

/**
 * Elimina un producto por ID
 */
async function deleteProduct(productId: string): Promise<boolean> {
    const query = `
        mutation DeleteProduct($id: ID!) {
            deleteProduct(id: $id) {
                result
                message
            }
        }
    `;

    try {
        const result = await adminApiQuery(query, { id: productId });
        return result.deleteProduct.result === 'DELETED';
    } catch (error) {
        console.error(`  ❌ Error eliminando producto ${productId}:`, error);
        return false;
    }
}

/**
 * Elimina todos los assets huérfanos
 */
async function deleteOrphanAssets(): Promise<void> {
    console.log('\n🗑️ Buscando assets huérfanos...');
    
    const query = `
        query GetAllAssets {
            assets(options: { take: 1000 }) {
                items {
                    id
                    name
                }
                totalItems
            }
        }
    `;

    const result = await adminApiQuery(query);
    console.log(`🖼️ Encontrados ${result.assets.totalItems} assets`);

    // No eliminaremos los assets automáticamente por seguridad
    // Los assets pueden ser usados en otros lugares
    console.log(`ℹ️ Los assets no se eliminan automáticamente.`);
    console.log(`   Puedes eliminarlos manualmente desde el Dashboard si lo deseas.`);
}

/**
 * Función principal
 */
async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🗑️ RESET DE PRODUCTOS - UNICLIMA VENDURE');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        // Autenticarse
        await login();

        // Obtener todos los productos
        const products = await getAllProducts();

        if (products.length === 0) {
            console.log('\n✅ No hay productos que eliminar.');
            return;
        }

        console.log(`\n🗑️ Eliminando ${products.length} productos...`);

        let successCount = 0;
        let errorCount = 0;

        for (const product of products) {
            process.stdout.write(`  Eliminando: ${product.name.substring(0, 50)}... `);
            const success = await deleteProduct(product.id);
            if (success) {
                console.log('✅');
                successCount++;
            } else {
                console.log('❌');
                errorCount++;
            }
        }

        // Limpiar assets huérfanos
        await deleteOrphanAssets();

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log(`  RESET COMPLETADO`);
        console.log(`  ✅ Eliminados: ${successCount}`);
        console.log(`  ❌ Errores: ${errorCount}`);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('\n📋 Ahora puedes volver a importar los productos con:');
        console.log('   npx ts-node scripts/import-products-excel.ts\n');

    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

// Ejecutar
main();