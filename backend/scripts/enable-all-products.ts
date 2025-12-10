/**
 * Script para habilitar todos los productos en Vendure
 */

const ADMIN_API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = 'superadmin';
const SUPERADMIN_PASSWORD = 'superadmin';

let authToken: string | null = null;

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

async function login(): Promise<void> {
    console.log('🔐 Autenticando...');
    
    const query = `
        mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                ... on CurrentUser { id identifier }
                ... on InvalidCredentialsError { message }
            }
        }
    `;

    const response = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query, 
            variables: { username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD }
        }),
    });

    const vendureAuthToken = response.headers.get('vendure-auth-token');
    if (vendureAuthToken) {
        authToken = vendureAuthToken;
    }

    console.log('✅ Autenticado');
}

async function main(): Promise<void> {
    await login();

    // Obtener todos los productos
    const getQuery = `
        query {
            products(options: { take: 100 }) {
                items { id name enabled }
            }
        }
    `;

    const data = await adminApiQuery(getQuery);
    const products = data.products.items;

    console.log(`📦 Encontrados ${products.length} productos`);

    // Habilitar cada producto
    for (const product of products) {
        if (!product.enabled) {
            const updateQuery = `
                mutation UpdateProduct($input: UpdateProductInput!) {
                    updateProduct(input: $input) { id name enabled }
                }
            `;

            await adminApiQuery(updateQuery, {
                input: { id: product.id, enabled: true }
            });

            console.log(`  ✅ Habilitado: ${product.name}`);
        } else {
            console.log(`  ⏭️ Ya habilitado: ${product.name}`);
        }
    }

    console.log('\n✅ Todos los productos habilitados');
}

main().catch(console.error);