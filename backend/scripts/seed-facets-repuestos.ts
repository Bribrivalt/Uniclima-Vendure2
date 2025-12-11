/**
 * Script: Seed Facets para Repuestos
 * Crea facets específicos para filtrar repuestos:
 * - Tipo de Repuesto (placas, acuastatos, motores, sensores, etc.)
 * - Estado (nuevo, reacondicionado)
 * - Marca (independiente)
 * 
 * Ejecutar con: npx ts-node scripts/seed-facets-repuestos.ts
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

const GET_FACETS_QUERY = `
    query { facets { items { id name code values { id name code } } } }
`;

const CREATE_FACET_MUTATION = `
    mutation CreateFacet($input: CreateFacetInput!) {
        createFacet(input: $input) { id name code }
    }
`;

const CREATE_FACET_VALUES_MUTATION = `
    mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
        createFacetValues(input: $input) { id name code }
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

// Definición de facets para repuestos
interface FacetDefinition {
    name: string;
    code: string;
    values: { name: string; code: string }[];
}

const REPUESTOS_FACETS: FacetDefinition[] = [
    {
        name: 'Tipo de Repuesto',
        code: 'tipo-repuesto',
        values: [
            { name: 'Placa Electrónica', code: 'placa-electronica' },
            { name: 'Acuastato', code: 'acuastato' },
            { name: 'Motor Válvula', code: 'motor-valvula' },
            { name: 'Sensor', code: 'sensor' },
            { name: 'Adaptador', code: 'adaptador' },
            { name: 'Termostato', code: 'termostato' },
            { name: 'Portafusibles', code: 'portafusibles' },
            { name: 'Quemador', code: 'quemador' },
            { name: 'Intercambiador', code: 'intercambiador' },
            { name: 'Bomba', code: 'bomba' },
            { name: 'Electrodo', code: 'electrodo' },
            { name: 'Ventilador', code: 'ventilador' },
            { name: 'Membrana', code: 'membrana' },
            { name: 'Junta', code: 'junta' },
            { name: 'Otros', code: 'otros' },
        ],
    },
    {
        name: 'Estado',
        code: 'estado-producto',
        values: [
            { name: 'Nuevo', code: 'nuevo' },
            { name: 'Reacondicionado', code: 'reacondicionado' },
        ],
    },
    {
        name: 'Marca Repuesto',
        code: 'marca-repuesto',
        values: [
            { name: 'Saunier Duval', code: 'saunier-duval' },
            { name: 'Junkers', code: 'junkers' },
            { name: 'Bosch', code: 'bosch' },
            { name: 'Vaillant', code: 'vaillant' },
            { name: 'Chaffoteaux', code: 'chaffoteaux' },
            { name: 'Roca', code: 'roca' },
            { name: 'Baxi', code: 'baxi' },
            { name: 'Ariston', code: 'ariston' },
            { name: 'Ferroli', code: 'ferroli' },
            { name: 'Cointra', code: 'cointra' },
            { name: 'Fagor', code: 'fagor' },
            { name: 'Heatline', code: 'heatline' },
            { name: 'Neckar', code: 'neckar' },
            { name: 'Thermor', code: 'thermor' },
            { name: 'Hermann', code: 'hermann' },
            { name: 'Beretta', code: 'beretta' },
            { name: 'Immergas', code: 'immergas' },
            { name: 'Genérico / Compatible', code: 'generico' },
        ],
    },
];

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🔧 SEED FACETS REPUESTOS - Uniclima Vendure            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    await login();

    // Obtener facets existentes
    console.log('\n📋 Obteniendo facets existentes...');
    const facetsData = await graphqlRequest(GET_FACETS_QUERY);
    const existingFacets = new Map<string, string>();
    for (const f of facetsData.facets.items) {
        existingFacets.set(f.code, f.id);
    }
    console.log(`   ✅ ${existingFacets.size} facets existentes`);

    // Crear nuevos facets
    console.log('\n🔧 CREANDO FACETS PARA REPUESTOS...\n');

    for (const facetDef of REPUESTOS_FACETS) {
        console.log(`📁 ${facetDef.name} (${facetDef.code})`);
        
        let facetId: string;
        
        if (existingFacets.has(facetDef.code)) {
            facetId = existingFacets.get(facetDef.code)!;
            console.log(`   ⏭️  Ya existe (ID: ${facetId})`);
        } else {
            const result = await graphqlRequest(CREATE_FACET_MUTATION, {
                input: {
                    code: facetDef.code,
                    isPrivate: false,
                    translations: [{ languageCode: 'en', name: facetDef.name }],
                },
            });
            facetId = result.createFacet.id;
            console.log(`   ✅ Creado (ID: ${facetId})`);
        }

        // Crear valores
        console.log(`   📝 Añadiendo ${facetDef.values.length} valores...`);
        
        // Obtener valores existentes del facet
        const facetData = await graphqlRequest(`
            query { facet(id: "${facetId}") { values { code } } }
        `);
        const existingValues = new Set(facetData.facet?.values?.map((v: any) => v.code) || []);

        for (const value of facetDef.values) {
            if (existingValues.has(value.code)) {
                console.log(`      ⏭️  ${value.name} (ya existe)`);
                continue;
            }
            
            try {
                await graphqlRequest(CREATE_FACET_VALUES_MUTATION, {
                    input: [{
                        facetId,
                        code: value.code,
                        translations: [{ languageCode: 'en', name: value.name }],
                    }],
                });
                console.log(`      ✅ ${value.name}`);
            } catch (e: any) {
                console.log(`      ⚠️  ${value.name}: ${e.message}`);
            }
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('          ✅ FACETS PARA REPUESTOS CREADOS                      ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📊 Facets creados:');
    console.log('   • tipo-repuesto: Para filtrar por tipo (placas, acuastatos, etc.)');
    console.log('   • estado-producto: Para filtrar por nuevo/reacondicionado');
    console.log('   • marca-repuesto: Para filtrar por marca del fabricante');
    console.log('\n🔗 Dashboard: http://localhost:3001/dashboard → Catalog → Facets');
    console.log('\n💡 Ahora puedes asignar estos facets a los productos de repuestos\n');
}

main().catch(console.error);