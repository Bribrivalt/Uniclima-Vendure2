/**
 * Script: Assign Facets to Existing Products
 * Asigna automáticamente facets a los productos existentes basándose en sus nombres.
 * 
 * Ejecutar con: npx ts-node scripts/assign-facets-to-products.ts
 */

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

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
    const data = await graphqlRequest(`
        mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                ... on CurrentUser { id identifier }
                ... on InvalidCredentialsError { errorCode message }
            }
        }
    `, { username: SUPERADMIN_USERNAME, password: SUPERADMIN_PASSWORD });
    if (data.login.errorCode) throw new Error(`Login fallido: ${data.login.message}`);
    console.log(`✅ Login exitoso como: ${data.login.identifier}`);
}

// Patrones para detectar tipo de repuesto
const TIPO_PATTERNS: { pattern: RegExp; facetCode: string }[] = [
    { pattern: /placa|electronica|tarjeta/i, facetCode: 'placa-electronica' },
    { pattern: /acuastato|acua\s*stato/i, facetCode: 'acuastato' },
    { pattern: /motor.*valvula|valvula.*motor|actuador/i, facetCode: 'motor-valvula' },
    { pattern: /sensor|sonda/i, facetCode: 'sensor' },
    { pattern: /adaptador/i, facetCode: 'adaptador' },
    { pattern: /termostato|limitador/i, facetCode: 'termostato' },
    { pattern: /portafusible|fusible/i, facetCode: 'portafusibles' },
    { pattern: /quemador/i, facetCode: 'quemador' },
    { pattern: /intercambiador/i, facetCode: 'intercambiador' },
    { pattern: /bomba/i, facetCode: 'bomba' },
    { pattern: /electrodo/i, facetCode: 'electrodo' },
    { pattern: /ventilador/i, facetCode: 'ventilador' },
    { pattern: /membrana/i, facetCode: 'membrana' },
    { pattern: /junta/i, facetCode: 'junta' },
];

// Patrones para detectar marca
const MARCA_PATTERNS: { pattern: RegExp; facetCode: string }[] = [
    { pattern: /saunier\s*duval/i, facetCode: 'saunier-duval' },
    { pattern: /junkers/i, facetCode: 'junkers' },
    { pattern: /bosch/i, facetCode: 'bosch' },
    { pattern: /vaillant/i, facetCode: 'vaillant' },
    { pattern: /chaffoteaux/i, facetCode: 'chaffoteaux' },
    { pattern: /roca/i, facetCode: 'roca' },
    { pattern: /baxi|victoria/i, facetCode: 'baxi' },
    { pattern: /ariston/i, facetCode: 'ariston' },
    { pattern: /ferroli/i, facetCode: 'ferroli' },
    { pattern: /cointra/i, facetCode: 'cointra' },
    { pattern: /fagor/i, facetCode: 'fagor' },
    { pattern: /heatline|airsol/i, facetCode: 'heatline' },
    { pattern: /neckar/i, facetCode: 'neckar' },
    { pattern: /thermor/i, facetCode: 'thermor' },
    { pattern: /hermann/i, facetCode: 'hermann' },
    { pattern: /beretta/i, facetCode: 'beretta' },
    { pattern: /immergas/i, facetCode: 'immergas' },
];

function detectFacets(productName: string): string[] {
    const detectedCodes: string[] = [];
    
    // Detectar tipo
    for (const { pattern, facetCode } of TIPO_PATTERNS) {
        if (pattern.test(productName)) {
            detectedCodes.push(`tipo-repuesto:${facetCode}`);
            break; // Solo un tipo
        }
    }
    
    // Detectar marca
    for (const { pattern, facetCode } of MARCA_PATTERNS) {
        if (pattern.test(productName)) {
            detectedCodes.push(`marca-repuesto:${facetCode}`);
            break; // Solo una marca
        }
    }
    
    // Por defecto: nuevo
    detectedCodes.push('estado-producto:nuevo');
    
    return detectedCodes;
}

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🏷️  ASSIGN FACETS TO PRODUCTS - Uniclima               ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    await login();

    // Obtener facets
    console.log('\n📋 Obteniendo facets...');
    const facetsData = await graphqlRequest(`
        query { facets { items { id code values { id code } } } }
    `);
    
    // Crear mapa facetCode:valueCode -> valueId
    const facetValueMap = new Map<string, string>();
    for (const facet of facetsData.facets.items) {
        for (const value of facet.values) {
            facetValueMap.set(`${facet.code}:${value.code}`, value.id);
        }
    }
    console.log(`   ✅ ${facetValueMap.size} facet values disponibles`);

    // Obtener productos
    console.log('\n📋 Obteniendo productos...');
    const productsData = await graphqlRequest(`
        query {
            products(options: { take: 500 }) {
                items {
                    id
                    name
                    facetValues { id code }
                }
            }
        }
    `);
    const products = productsData.products.items;
    console.log(`   ✅ ${products.length} productos encontrados`);

    // Asignar facets
    console.log('\n🏷️  ASIGNANDO FACETS...\n');

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
        const detectedFacetKeys = detectFacets(product.name);
        const currentFacetIds = new Set(product.facetValues.map((f: any) => f.id));
        
        // Buscar IDs de facets detectados
        const newFacetIds: string[] = [];
        for (const key of detectedFacetKeys) {
            const id = facetValueMap.get(key);
            if (id && !currentFacetIds.has(id)) {
                newFacetIds.push(id);
            }
        }

        if (newFacetIds.length === 0) {
            skipped++;
            continue;
        }

        // Combinar facets existentes con nuevos
        const allFacetIds = [...Array.from(currentFacetIds), ...newFacetIds];

        console.log(`📦 ${product.name}`);
        console.log(`   Detectado: ${detectedFacetKeys.join(', ')}`);

        try {
            await graphqlRequest(`
                mutation UpdateProduct($input: UpdateProductInput!) {
                    updateProduct(input: $input) { id }
                }
            `, {
                input: {
                    id: product.id,
                    facetValueIds: allFacetIds,
                },
            });
            console.log(`   ✅ Facets asignados`);
            updated++;
        } catch (e: any) {
            console.log(`   ❌ Error: ${e.message}`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('          ✅ ASIGNACIÓN COMPLETADA                              ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📊 Resumen:');
    console.log(`   • Productos actualizados: ${updated}`);
    console.log(`   • Productos sin cambios: ${skipped}`);
    console.log('\n🔗 Dashboard: http://localhost:3001/dashboard → Catalog → Products\n');
}

main().catch(console.error);