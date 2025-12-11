/**
 * Script: Setup Collection Filters
 * Configura filtros automáticos basados en Facets para las Collections.
 * Ejecutar con: npx ts-node scripts/setup-collection-filters.ts
 */

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

const LOGIN_MUTATION = `
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ... on CurrentUser { id identifier }
            ... on InvalidCredentialsError { errorCode message }
        }
    }
`;

const GET_COLLECTIONS_QUERY = `
    query {
        collections(options: { take: 100 }) {
            items { id name slug filters { code args { name value } } productVariants { totalItems } }
        }
    }
`;

const GET_FACET_VALUES_QUERY = `
    query {
        facets { items { id name code values { id name code } } }
    }
`;

const UPDATE_COLLECTION_MUTATION = `
    mutation UpdateCollection($input: UpdateCollectionInput!) {
        updateCollection(input: $input) { id name filters { code args { name value } } productVariants { totalItems } }
    }
`;

async function graphqlRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });
    
    const newToken = response.headers.get('vendure-auth-token');
    if (newToken) authToken = newToken;
    
    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data;
}

async function login(): Promise<void> {
    console.log('🔐 Iniciando sesión...');
    const data = await graphqlRequest(LOGIN_MUTATION, { username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
    if (data.login.errorCode) throw new Error(`Login fallido: ${data.login.message}`);
    console.log(`✅ Login exitoso como: ${data.login.identifier}`);
}

// Mapeo: collectionSlug -> [{ facetCode, valueCode }]
// Basado en los slugs de seed-collections.ts y los codes de facets
const COLLECTION_FACET_MAPPING: Record<string, { facetCode: string; valueCode: string }[]> = {
    // === CLIMATIZACIÓN (facet tipo-producto) ===
    'split-pared': [{ facetCode: 'tipo-producto', valueCode: 'split-pared' }],
    'multisplit-2x1': [{ facetCode: 'tipo-producto', valueCode: 'multisplit' }],
    'multisplit-3x1': [{ facetCode: 'tipo-producto', valueCode: 'multisplit' }],
    'multisplit-4x1': [{ facetCode: 'tipo-producto', valueCode: 'multisplit' }],
    'conductos': [{ facetCode: 'tipo-producto', valueCode: 'conductos' }],
    'cassette': [{ facetCode: 'tipo-producto', valueCode: 'cassette' }],
    'suelo-techo': [{ facetCode: 'tipo-producto', valueCode: 'suelo-techo' }],
    'portatil': [{ facetCode: 'tipo-producto', valueCode: 'portatil' }],
    
    // === REPUESTOS (facet tipo-repuesto) ===
    'placas-electronicas': [{ facetCode: 'tipo-repuesto', valueCode: 'placa-electronica' }],
    'compresores': [{ facetCode: 'tipo-repuesto', valueCode: 'otros' }], // No hay facet específico
    'motores-ventilador': [{ facetCode: 'tipo-repuesto', valueCode: 'ventilador' }],
    'sensores-termostatos': [{ facetCode: 'tipo-repuesto', valueCode: 'sensor' }],
};

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🔧 SETUP COLLECTION FILTERS - Uniclima Vendure         ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    await login();

    console.log('\n📋 Obteniendo collections y facets...');
    const collectionsData = await graphqlRequest(GET_COLLECTIONS_QUERY);
    const facetsData = await graphqlRequest(GET_FACET_VALUES_QUERY);

    const facetValueMap = new Map<string, string>();
    for (const facet of facetsData.facets.items) {
        for (const value of facet.values) {
            facetValueMap.set(`${facet.code}:${value.code}`, value.id);
        }
    }
    console.log(`   ✅ ${collectionsData.collections.items.length} collections, ${facetValueMap.size} facet values`);

    console.log('\n🔧 CONFIGURANDO FILTROS...');
    let configured = 0, skipped = 0;

    for (const collection of collectionsData.collections.items) {
        const mapping = COLLECTION_FACET_MAPPING[collection.slug];
        if (!mapping) continue;
        
        if (collection.filters && collection.filters.length > 0) {
            console.log(`   ⏭️  "${collection.name}" ya tiene filtros`);
            skipped++;
            continue;
        }

        const facetValueIds: string[] = [];
        for (const { facetCode, valueCode } of mapping) {
            const valueId = facetValueMap.get(`${facetCode}:${valueCode}`);
            if (valueId) facetValueIds.push(valueId);
        }

        if (facetValueIds.length === 0) continue;

        console.log(`   🔧 "${collection.name}" - Aplicando filtro...`);
        try {
            const result = await graphqlRequest(UPDATE_COLLECTION_MUTATION, {
                input: {
                    id: collection.id,
                    filters: [{
                        code: 'facet-value-filter',
                        arguments: [
                            { name: 'facetValueIds', value: JSON.stringify(facetValueIds) },
                            { name: 'containsAny', value: 'false' },
                        ],
                    }],
                },
            });
            console.log(`      ✅ ${result.updateCollection.productVariants.totalItems} productos asignados`);
            configured++;
        } catch (e: any) {
            console.log(`      ❌ Error: ${e.message}`);
        }
    }

    console.log('\n📊 RESUMEN:');
    console.log(`   Filtros configurados: ${configured}`);
    console.log(`   Omitidos (ya tenían): ${skipped}`);
    console.log('\n🔗 Dashboard: http://localhost:3001/dashboard → Collections\n');
}

main().catch(console.error);