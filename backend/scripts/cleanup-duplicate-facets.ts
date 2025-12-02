/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Limpiar Facet Values Duplicados
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Elimina los valores de facets duplicados, manteniendo solo uno de cada.
 * 
 * Ejecutar con: npx tsx scripts/cleanup-duplicate-facets.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

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

const GET_FACETS_WITH_VALUES_QUERY = `
    query GetFacets {
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

const DELETE_FACET_VALUE_MUTATION = `
    mutation DeleteFacetValues($ids: [ID!]!) {
        deleteFacetValues(ids: $ids, force: true) {
            result
            message
        }
    }
`;

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

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🧹 LIMPIAR FACETS DUPLICADOS - Uniclima                 ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        await login();

        // Obtener todos los facets con sus valores
        console.log('\n📋 Obteniendo facets...');
        const data = await graphqlRequest(GET_FACETS_WITH_VALUES_QUERY);
        
        const duplicateIds: string[] = [];

        for (const facet of data.facets.items) {
            console.log(`\n📁 Facet: ${facet.name}`);
            
            // Agrupar valores por código
            const valuesByCode = new Map<string, any[]>();
            
            for (const value of facet.values) {
                const existing = valuesByCode.get(value.code) || [];
                existing.push(value);
                valuesByCode.set(value.code, existing);
            }

            // Encontrar duplicados
            for (const [code, values] of valuesByCode) {
                if (values.length > 1) {
                    console.log(`   🔄 "${values[0].name}" tiene ${values.length} duplicados`);
                    // Mantener el primero, eliminar el resto
                    for (let i = 1; i < values.length; i++) {
                        duplicateIds.push(values[i].id);
                        console.log(`      ❌ Eliminando ID: ${values[i].id}`);
                    }
                }
            }
        }

        if (duplicateIds.length === 0) {
            console.log('\n✅ No se encontraron duplicados');
            return;
        }

        console.log(`\n🗑️  Eliminando ${duplicateIds.length} valores duplicados...`);
        
        // Eliminar en lotes de 10
        for (let i = 0; i < duplicateIds.length; i += 10) {
            const batch = duplicateIds.slice(i, i + 10);
            await graphqlRequest(DELETE_FACET_VALUE_MUTATION, { ids: batch });
            console.log(`   ✅ Eliminados ${Math.min(i + 10, duplicateIds.length)}/${duplicateIds.length}`);
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ LIMPIEZA COMPLETADA                                ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        console.log(`📊 Resumen: ${duplicateIds.length} valores duplicados eliminados`);
        console.log('🔗 Verifica en: http://localhost:3001/dashboard → Catalog → Facets\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main();