/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Seed Collections HVAC
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Este script crea las Collections (categorías) para productos de
 * climatización usando la Admin API de Vendure.
 * 
 * Ejecutar con: npx ts-node scripts/seed-collections.ts
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
// DEFINICIÓN DE COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────

interface CollectionDefinition {
    name: string;           // Nombre visible de la colección
    slug: string;           // Slug para URL
    description?: string;   // Descripción de la categoría
    children?: CollectionDefinition[];  // Subcategorías
}

/**
 * Estructura jerárquica de categorías para productos HVAC
 */
const HVAC_COLLECTIONS: CollectionDefinition[] = [
    {
        name: 'Climatización',
        slug: 'climatizacion',
        description: 'Equipos de climatización y aire acondicionado para el hogar y comercios',
        children: [
            {
                name: 'Aire Acondicionado',
                slug: 'aire-acondicionado',
                description: 'Sistemas de aire acondicionado para refrigeración y calefacción',
                children: [
                    {
                        name: 'Split Pared',
                        slug: 'split-pared',
                        description: 'Equipos split de pared, ideales para habitaciones y salones',
                    },
                    {
                        name: 'Multisplit 2x1',
                        slug: 'multisplit-2x1',
                        description: 'Una unidad exterior para dos unidades interiores',
                    },
                    {
                        name: 'Multisplit 3x1',
                        slug: 'multisplit-3x1',
                        description: 'Una unidad exterior para tres unidades interiores',
                    },
                    {
                        name: 'Multisplit 4x1',
                        slug: 'multisplit-4x1',
                        description: 'Una unidad exterior para cuatro unidades interiores',
                    },
                    {
                        name: 'Conductos',
                        slug: 'conductos',
                        description: 'Sistemas de aire acondicionado por conductos, para climatización centralizada',
                    },
                    {
                        name: 'Cassette',
                        slug: 'cassette',
                        description: 'Equipos tipo cassette para techos, ideales para oficinas y comercios',
                    },
                    {
                        name: 'Suelo/Techo',
                        slug: 'suelo-techo',
                        description: 'Unidades de suelo o techo, versátiles para cualquier espacio',
                    },
                    {
                        name: 'Portátil',
                        slug: 'portatil',
                        description: 'Aires acondicionados portátiles, sin instalación',
                    },
                ],
            },
            {
                name: 'Calefacción',
                slug: 'calefaccion',
                description: 'Sistemas de calefacción para el hogar',
                children: [
                    {
                        name: 'Calderas de Condensación',
                        slug: 'calderas-condensacion',
                        description: 'Calderas de alta eficiencia con tecnología de condensación',
                    },
                    {
                        name: 'Calderas de Biomasa',
                        slug: 'calderas-biomasa',
                        description: 'Calderas ecológicas que utilizan pellets o biomasa',
                    },
                    {
                        name: 'Aerotermia',
                        slug: 'aerotermia',
                        description: 'Bombas de calor aire-agua de alta eficiencia',
                    },
                    {
                        name: 'Radiadores',
                        slug: 'radiadores',
                        description: 'Radiadores y emisores térmicos',
                    },
                    {
                        name: 'Suelo Radiante',
                        slug: 'suelo-radiante',
                        description: 'Sistemas de calefacción por suelo radiante',
                    },
                ],
            },
            {
                name: 'Ventilación',
                slug: 'ventilacion',
                description: 'Sistemas de ventilación y renovación de aire',
                children: [
                    {
                        name: 'Recuperadores de Calor',
                        slug: 'recuperadores-calor',
                        description: 'Sistemas de ventilación con recuperación de calor',
                    },
                    {
                        name: 'Extractores',
                        slug: 'extractores',
                        description: 'Extractores de aire para baños y cocinas',
                    },
                    {
                        name: 'Ventiladores de Techo',
                        slug: 'ventiladores-techo',
                        description: 'Ventiladores de techo para circulación de aire',
                    },
                ],
            },
            {
                name: 'Tratamiento de Aire',
                slug: 'tratamiento-aire',
                description: 'Equipos para mejorar la calidad del aire',
                children: [
                    {
                        name: 'Deshumidificadores',
                        slug: 'deshumidificadores',
                        description: 'Equipos para eliminar la humedad del ambiente',
                    },
                    {
                        name: 'Purificadores',
                        slug: 'purificadores',
                        description: 'Purificadores de aire con filtros HEPA',
                    },
                    {
                        name: 'Humidificadores',
                        slug: 'humidificadores',
                        description: 'Equipos para añadir humedad al ambiente',
                    },
                ],
            },
        ],
    },
    {
        name: 'Accesorios',
        slug: 'accesorios',
        description: 'Accesorios y complementos para equipos de climatización',
        children: [
            {
                name: 'Soportes y Fijaciones',
                slug: 'soportes-fijaciones',
                description: 'Soportes de suelo, pared y antivibradores',
            },
            {
                name: 'Kits de Instalación',
                slug: 'kits-instalacion',
                description: 'Kits completos para instalación de equipos',
            },
            {
                name: 'Mandos a Distancia',
                slug: 'mandos-distancia',
                description: 'Mandos y controles remotos compatibles',
            },
            {
                name: 'Filtros',
                slug: 'filtros',
                description: 'Filtros de repuesto para equipos de climatización',
            },
            {
                name: 'Tuberías y Conexiones',
                slug: 'tuberias-conexiones',
                description: 'Tuberías de cobre, racores y conexiones',
            },
        ],
    },
    {
        name: 'Repuestos',
        slug: 'repuestos',
        description: 'Repuestos y piezas de recambio para equipos de climatización',
        children: [
            {
                name: 'Compresores',
                slug: 'compresores',
                description: 'Compresores de repuesto para unidades exteriores',
            },
            {
                name: 'Placas Electrónicas',
                slug: 'placas-electronicas',
                description: 'Placas y tarjetas electrónicas de control',
            },
            {
                name: 'Motores de Ventilador',
                slug: 'motores-ventilador',
                description: 'Motores para ventiladores de unidades interiores y exteriores',
            },
            {
                name: 'Sensores y Termostatos',
                slug: 'sensores-termostatos',
                description: 'Sensores de temperatura y termostatos de repuesto',
            },
        ],
    },
    {
        name: 'Servicios',
        slug: 'servicios',
        description: 'Servicios profesionales de instalación y mantenimiento',
        children: [
            {
                name: 'Instalación Split',
                slug: 'instalacion-split',
                description: 'Servicio de instalación profesional de equipos split',
            },
            {
                name: 'Instalación Multisplit',
                slug: 'instalacion-multisplit',
                description: 'Servicio de instalación de sistemas multisplit',
            },
            {
                name: 'Instalación Conductos',
                slug: 'instalacion-conductos',
                description: 'Instalación de sistemas de aire por conductos',
            },
            {
                name: 'Mantenimiento Preventivo',
                slug: 'mantenimiento-preventivo',
                description: 'Servicio de mantenimiento anual preventivo',
            },
            {
                name: 'Reparación',
                slug: 'reparacion',
                description: 'Servicio de diagnóstico y reparación de averías',
            },
            {
                name: 'Carga de Gas',
                slug: 'carga-gas',
                description: 'Servicio de recarga de gas refrigerante',
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────
// QUERIES Y MUTATIONS GRAPHQL
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

const CREATE_COLLECTION_MUTATION = `
    mutation CreateCollection($input: CreateCollectionInput!) {
        createCollection(input: $input) {
            id
            name
            slug
            parent {
                id
                name
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
                parent {
                    id
                }
            }
        }
    }
`;

// ─────────────────────────────────────────────────────────────────────────
// FUNCIONES DE API
// ─────────────────────────────────────────────────────────────────────────

let authToken: string | null = null;

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

async function getExistingCollections(): Promise<Map<string, string>> {
    const data = await graphqlRequest(GET_COLLECTIONS_QUERY);
    const collectionMap = new Map<string, string>();
    
    for (const collection of data.collections.items) {
        collectionMap.set(collection.slug, collection.id);
    }
    
    return collectionMap;
}

/**
 * Crea una colección
 * @param collection - Definición de la colección
 * @param parentId - ID de la colección padre (null para raíz)
 * @param existingCollections - Mapa de colecciones existentes
 * @returns ID de la colección creada
 */
async function createCollection(
    collection: CollectionDefinition,
    parentId: string | null,
    existingCollections: Map<string, string>
): Promise<string> {
    // Verificar si ya existe
    if (existingCollections.has(collection.slug)) {
        const id = existingCollections.get(collection.slug)!;
        console.log(`   ⏭️  "${collection.name}" ya existe (ID: ${id})`);
        return id;
    }

    const input: any = {
        isPrivate: false,
        translations: [
            {
                languageCode: 'en',
                name: collection.name,
                slug: collection.slug,
                description: collection.description || '',
            },
        ],
        filters: [], // Sin filtros automáticos por ahora
    };

    // Añadir parent si existe
    if (parentId) {
        input.parentId = parentId;
    }

    const data = await graphqlRequest(CREATE_COLLECTION_MUTATION, { input });
    const createdId = data.createCollection.id;

    console.log(`   ✅ "${collection.name}" creada (ID: ${createdId})`);
    
    // Añadir al mapa de existentes
    existingCollections.set(collection.slug, createdId);

    return createdId;
}

/**
 * Procesa una colección y sus hijos de forma recursiva
 */
async function processCollection(
    collection: CollectionDefinition,
    parentId: string | null,
    existingCollections: Map<string, string>,
    depth: number = 0
): Promise<void> {
    const indent = '   '.repeat(depth);
    
    if (depth === 0) {
        console.log(`\n📁 Categoría Raíz: ${collection.name}`);
        console.log('─'.repeat(50));
    }

    const collectionId = await createCollection(collection, parentId, existingCollections);

    // Procesar hijos si existen
    if (collection.children && collection.children.length > 0) {
        for (const child of collection.children) {
            await processCollection(child, collectionId, existingCollections, depth + 1);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

/**
 * Cuenta el total de colecciones en la estructura
 */
function countCollections(collections: CollectionDefinition[]): number {
    let count = collections.length;
    for (const collection of collections) {
        if (collection.children) {
            count += countCollections(collection.children);
        }
    }
    return count;
}

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        📂 SEED COLLECTIONS HVAC - Uniclima Vendure            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener colecciones existentes
        console.log('\n📋 Obteniendo colecciones existentes...');
        const existingCollections = await getExistingCollections();
        console.log(`   Encontradas: ${existingCollections.size} colecciones\n`);

        // 3. Crear colecciones
        for (const rootCollection of HVAC_COLLECTIONS) {
            await processCollection(rootCollection, null, existingCollections);
        }

        const totalCollections = countCollections(HVAC_COLLECTIONS);

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ SEED COMPLETADO EXITOSAMENTE                       ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        // Resumen
        console.log('📊 Resumen:');
        console.log(`   • Categorías raíz: ${HVAC_COLLECTIONS.length}`);
        console.log(`   • Total categorías: ${totalCollections}`);
        console.log('\n🔗 Verifica en: http://localhost:3001/dashboard → Catalog → Collections\n');

    } catch (error: any) {
        console.error('\n❌ Error durante el seed:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();