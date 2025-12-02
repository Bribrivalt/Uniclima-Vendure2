/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Seed Facets HVAC
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Este script crea los Facets (filtros) y sus valores para productos de
 * climatización usando la Admin API de Vendure.
 * 
 * Ejecutar con: npx ts-node scripts/seed-facets.ts
 * 
 * Requisitos:
 * - El servidor Vendure debe estar corriendo en http://localhost:3001
 * - Credenciales de superadmin configuradas
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

// ─────────────────────────────────────────────────────────────────────────
// DEFINICIÓN DE FACETS Y VALORES
// ─────────────────────────────────────────────────────────────────────────

interface FacetDefinition {
    name: string;           // Nombre visible del facet
    code: string;           // Código único (slug)
    values: string[];       // Lista de valores
}

/**
 * Facets para productos HVAC (Climatización)
 * Cada facet representa un filtro de búsqueda en el frontend
 */
const HVAC_FACETS: FacetDefinition[] = [
    {
        name: 'Marca',
        code: 'marca',
        values: [
            'Daikin',
            'Mitsubishi Electric',
            'LG',
            'Fujitsu',
            'Samsung',
            'Panasonic',
            'Toshiba',
            'Hitachi',
            'Haier',
            'Midea',
        ],
    },
    {
        name: 'Tipo de Producto',
        code: 'tipo-producto',
        values: [
            'Split Pared',
            'Multisplit',
            'Conductos',
            'Cassette',
            'Suelo/Techo',
            'Portátil',
            'Ventana',
        ],
    },
    {
        name: 'Clase Energética',
        code: 'clase-energetica',
        values: [
            'A+++',
            'A++',
            'A+',
            'A',
            'B',
            'C',
        ],
    },
    {
        name: 'Refrigerante',
        code: 'refrigerante',
        values: [
            'R32',
            'R410A',
            'R290',
            'R134a',
        ],
    },
    {
        name: 'Potencia',
        code: 'potencia',
        values: [
            'Menos de 2.5kW (hasta 20m²)',
            '2.5 - 3.5kW (20-30m²)',
            '3.5 - 5kW (30-40m²)',
            '5 - 7kW (40-60m²)',
            'Más de 7kW (más de 60m²)',
        ],
    },
    {
        name: 'Características',
        code: 'caracteristicas',
        values: [
            'WiFi Integrado',
            'Bomba de Calor',
            'Inverter',
            'Silencioso (<25dB)',
            'Purificador de Aire',
            'Deshumidificador',
            'Ionizador',
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────
// QUERIES Y MUTATIONS GRAPHQL
// ─────────────────────────────────────────────────────────────────────────

/**
 * Mutation para hacer login en la Admin API
 */
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

/**
 * Mutation para crear un nuevo Facet
 */
const CREATE_FACET_MUTATION = `
    mutation CreateFacet($input: CreateFacetInput!) {
        createFacet(input: $input) {
            id
            name
            code
        }
    }
`;

/**
 * Mutation para crear un nuevo FacetValue
 */
const CREATE_FACET_VALUE_MUTATION = `
    mutation CreateFacetValues($input: CreateFacetValueInput!) {
        createFacetValues(input: [$input]) {
            id
            name
            code
        }
    }
`;

/**
 * Query para verificar si un Facet ya existe
 */
const GET_FACETS_QUERY = `
    query GetFacets {
        facets {
            items {
                id
                name
                code
            }
        }
    }
`;

// ─────────────────────────────────────────────────────────────────────────
// FUNCIONES DE API
// ─────────────────────────────────────────────────────────────────────────

// Variable global para almacenar el token de autenticación
let authToken: string | null = null;

/**
 * Realiza una petición GraphQL a la Admin API
 * @param query - Query o Mutation GraphQL
 * @param variables - Variables para la query
 * @returns Respuesta de la API
 */
async function graphqlRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    // Añadir token de autenticación si existe
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    // Extraer token del header de respuesta si existe
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
 * Inicia sesión en la Admin API
 */
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
 * Obtiene los Facets existentes
 */
async function getExistingFacets(): Promise<Map<string, string>> {
    const data = await graphqlRequest(GET_FACETS_QUERY);
    const facetMap = new Map<string, string>();
    
    for (const facet of data.facets.items) {
        facetMap.set(facet.code, facet.id);
    }
    
    return facetMap;
}

/**
 * Crea un nuevo Facet
 * @param name - Nombre del facet
 * @param code - Código único
 * @returns ID del facet creado
 */
async function createFacet(name: string, code: string): Promise<string> {
    const data = await graphqlRequest(CREATE_FACET_MUTATION, {
        input: {
            code,
            isPrivate: false,
            translations: [
                {
                    languageCode: 'en',
                    name,
                },
            ],
        },
    });

    return data.createFacet.id;
}

/**
 * Crea un nuevo FacetValue
 * @param facetId - ID del facet padre
 * @param name - Nombre del valor
 */
async function createFacetValue(facetId: string, name: string): Promise<void> {
    // Generar código a partir del nombre (slug)
    const code = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-')     // Reemplazar espacios y caracteres especiales por guiones
        .replace(/^-|-$/g, '');           // Eliminar guiones al inicio y final

    await graphqlRequest(CREATE_FACET_VALUE_MUTATION, {
        input: {
            facetId,
            code,
            translations: [
                {
                    languageCode: 'en',
                    name,
                },
            ],
        },
    });
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('          🌡️  SEED FACETS HVAC - Uniclima Vendure              ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener facets existentes
        console.log('\n📋 Obteniendo facets existentes...');
        const existingFacets = await getExistingFacets();
        console.log(`   Encontrados: ${existingFacets.size} facets\n`);

        // 3. Crear facets y valores
        for (const facetDef of HVAC_FACETS) {
            console.log(`\n📁 Procesando Facet: ${facetDef.name}`);
            console.log('─'.repeat(50));

            let facetId: string;

            // Verificar si el facet ya existe
            if (existingFacets.has(facetDef.code)) {
                facetId = existingFacets.get(facetDef.code)!;
                console.log(`   ⏭️  Facet "${facetDef.name}" ya existe (ID: ${facetId})`);
            } else {
                // Crear nuevo facet
                facetId = await createFacet(facetDef.name, facetDef.code);
                console.log(`   ✅ Facet "${facetDef.name}" creado (ID: ${facetId})`);
            }

            // Crear valores del facet
            console.log(`   📝 Añadiendo ${facetDef.values.length} valores...`);
            for (const value of facetDef.values) {
                try {
                    await createFacetValue(facetId, value);
                    console.log(`      ✅ ${value}`);
                } catch (error: any) {
                    // Si el valor ya existe, mostrar mensaje pero continuar
                    if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                        console.log(`      ⏭️  ${value} (ya existe)`);
                    } else {
                        console.log(`      ❌ ${value}: ${error.message}`);
                    }
                }
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ SEED COMPLETADO EXITOSAMENTE                       ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        // Resumen
        console.log('📊 Resumen:');
        console.log(`   • Facets procesados: ${HVAC_FACETS.length}`);
        console.log(`   • Total valores: ${HVAC_FACETS.reduce((acc, f) => acc + f.values.length, 0)}`);
        console.log('\n🔗 Verifica en: http://localhost:3001/dashboard → Catalog → Facets\n');

    } catch (error: any) {
        console.error('\n❌ Error durante el seed:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();