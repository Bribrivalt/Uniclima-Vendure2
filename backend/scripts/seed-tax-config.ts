/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Configurar Zona de Impuestos España
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Crea la zona de impuestos "España" y la configura como predeterminada.
 * Necesario antes de crear productos con precios.
 * 
 * Ejecutar con: npx tsx scripts/seed-tax-config.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

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

const GET_ZONES_QUERY = `
    query GetZones {
        zones {
            items {
                id
                name
            }
        }
    }
`;

const GET_COUNTRIES_QUERY = `
    query GetCountries {
        countries {
            items {
                id
                code
                name
            }
        }
    }
`;

const CREATE_ZONE_MUTATION = `
    mutation CreateZone($input: CreateZoneInput!) {
        createZone(input: $input) {
            id
            name
        }
    }
`;

const ADD_MEMBERS_TO_ZONE_MUTATION = `
    mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {
        addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {
            id
            name
            members {
                ... on Country {
                    id
                    name
                }
            }
        }
    }
`;

const GET_TAX_CATEGORIES_QUERY = `
    query GetTaxCategories {
        taxCategories {
            items {
                id
                name
            }
        }
    }
`;

const CREATE_TAX_CATEGORY_MUTATION = `
    mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
        createTaxCategory(input: $input) {
            id
            name
        }
    }
`;

const CREATE_TAX_RATE_MUTATION = `
    mutation CreateTaxRate($input: CreateTaxRateInput!) {
        createTaxRate(input: $input) {
            id
            name
            value
        }
    }
`;

const GET_CHANNELS_QUERY = `
    query GetChannels {
        channels {
            items {
                id
                code
                defaultTaxZone {
                    id
                }
            }
        }
    }
`;

const UPDATE_CHANNEL_MUTATION = `
    mutation UpdateChannel($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
            ... on Channel {
                id
                code
                defaultTaxZone {
                    id
                    name
                }
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
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        💶 CONFIGURAR IMPUESTOS ESPAÑA - Uniclima              ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Verificar zonas existentes
        console.log('\n📋 Verificando zonas existentes...');
        const zonesData = await graphqlRequest(GET_ZONES_QUERY);
        let spainZone = zonesData.zones.items.find((z: any) => z.name === 'España' || z.name === 'Spain');
        
        if (spainZone) {
            console.log(`   ⏭️  Zona "España" ya existe (ID: ${spainZone.id})`);
        } else {
            // Crear zona España
            console.log('   🆕 Creando zona "España"...');
            const createZoneData = await graphqlRequest(CREATE_ZONE_MUTATION, {
                input: {
                    name: 'España',
                }
            });
            spainZone = createZoneData.createZone;
            console.log(`   ✅ Zona creada (ID: ${spainZone.id})`);

            // Buscar país España para añadir a la zona
            console.log('\n📋 Buscando país España...');
            const countriesData = await graphqlRequest(GET_COUNTRIES_QUERY);
            const spainCountry = countriesData.countries.items.find((c: any) => c.code === 'ES');
            
            if (spainCountry) {
                console.log(`   ✅ País encontrado: ${spainCountry.name} (ID: ${spainCountry.id})`);
                
                // Añadir España a la zona
                await graphqlRequest(ADD_MEMBERS_TO_ZONE_MUTATION, {
                    zoneId: spainZone.id,
                    memberIds: [spainCountry.id],
                });
                console.log('   ✅ País añadido a la zona');
            } else {
                console.log('   ⚠️  País España (ES) no encontrado en la base de datos');
            }
        }

        // 3. Verificar/crear categoría de impuestos
        console.log('\n📋 Verificando categorías de impuestos...');
        const taxCategoriesData = await graphqlRequest(GET_TAX_CATEGORIES_QUERY);
        let standardCategory = taxCategoriesData.taxCategories.items.find((c: any) => c.name === 'Standard' || c.name === 'Estándar');
        
        if (standardCategory) {
            console.log(`   ⏭️  Categoría "Estándar" ya existe (ID: ${standardCategory.id})`);
        } else {
            console.log('   🆕 Creando categoría "Estándar"...');
            const createCategoryData = await graphqlRequest(CREATE_TAX_CATEGORY_MUTATION, {
                input: {
                    name: 'Estándar',
                }
            });
            standardCategory = createCategoryData.createTaxCategory;
            console.log(`   ✅ Categoría creada (ID: ${standardCategory.id})`);
        }

        // 4. Crear tasa de IVA 21%
        console.log('\n💶 Configurando IVA 21%...');
        try {
            const taxRateData = await graphqlRequest(CREATE_TAX_RATE_MUTATION, {
                input: {
                    name: 'IVA España 21%',
                    value: 21,
                    categoryId: standardCategory.id,
                    zoneId: spainZone.id,
                    enabled: true,
                }
            });
            console.log(`   ✅ Tasa de IVA creada: ${taxRateData.createTaxRate.name} (${taxRateData.createTaxRate.value}%)`);
        } catch (error: any) {
            if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                console.log('   ⏭️  Tasa de IVA ya existe');
            } else {
                throw error;
            }
        }

        // 5. Configurar zona predeterminada del canal
        console.log('\n🔧 Configurando zona predeterminada del canal...');
        const channelsData = await graphqlRequest(GET_CHANNELS_QUERY);
        const defaultChannel = channelsData.channels.items.find((c: any) => c.code === '__default_channel__');
        
        if (defaultChannel) {
            if (defaultChannel.defaultTaxZone?.id === spainZone.id) {
                console.log('   ⏭️  El canal ya tiene España como zona predeterminada');
            } else {
                await graphqlRequest(UPDATE_CHANNEL_MUTATION, {
                    input: {
                        id: defaultChannel.id,
                        defaultTaxZoneId: spainZone.id,
                    }
                });
                console.log('   ✅ Zona "España" configurada como predeterminada');
            }
        } else {
            console.log('   ⚠️  Canal predeterminado no encontrado');
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ CONFIGURACIÓN DE IMPUESTOS COMPLETADA              ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        console.log('📊 Resumen:');
        console.log(`   • Zona: España`);
        console.log(`   • IVA: 21%`);
        console.log(`   • Canal predeterminado configurado`);
        console.log('\n🔗 Ahora puedes ejecutar: npx tsx scripts/seed-product-example.ts\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();