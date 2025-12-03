/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Seed Shipping Methods
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Crea los métodos de envío para la tienda:
 * - Envío Estándar: 50€
 * - Envío Express: 100€
 * - Recogida en Tienda: Gratis
 * - Envío Gratis para pedidos > 1000€
 * 
 * Ejecutar con: npx tsx scripts/seed-shipping-methods.ts
 * 
 * Requisitos:
 * - El servidor Vendure debe estar corriendo en http://localhost:3001
 * - Credenciales de superadmin configuradas
 * - Debe existir al menos una zona (España) configurada
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

const GET_SHIPPING_METHODS_QUERY = `
    query GetShippingMethods {
        shippingMethods {
            items {
                id
                code
                name
            }
        }
    }
`;

const CREATE_SHIPPING_METHOD_MUTATION = `
    mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
        createShippingMethod(input: $input) {
            id
            code
            name
            description
            calculator {
                code
                args {
                    name
                    value
                }
            }
            checker {
                code
                args {
                    name
                    value
                }
            }
        }
    }
`;

const GET_CHANNELS_QUERY = `
    query GetChannels {
        channels {
            items {
                id
                code
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
// DEFINICIÓN DE MÉTODOS DE ENVÍO
// ─────────────────────────────────────────────────────────────────────────

interface ShippingMethodDefinition {
    code: string;
    name: string;
    description: string;
    price: number;  // En céntimos (5000 = 50€)
    minOrderAmount?: number;  // Para envío gratis condicional (en céntimos)
}

const SHIPPING_METHODS: ShippingMethodDefinition[] = [
    {
        code: 'envio-estandar',
        name: 'Envío Estándar',
        description: 'Entrega en 5-7 días laborables. Envío a toda España peninsular.',
        price: 5000,  // 50€
    },
    {
        code: 'envio-express',
        name: 'Envío Express',
        description: 'Entrega en 24-48 horas. Envío urgente a toda España peninsular.',
        price: 10000,  // 100€
    },
    {
        code: 'recogida-tienda',
        name: 'Recogida en Tienda',
        description: 'Recoge tu pedido en nuestra tienda de forma gratuita. Te avisaremos cuando esté listo.',
        price: 0,  // Gratis
    },
    {
        code: 'envio-gratis-1000',
        name: 'Envío Gratis',
        description: 'Envío gratuito para pedidos superiores a 1.000€. Entrega en 5-7 días laborables.',
        price: 0,  // Gratis
        minOrderAmount: 100000,  // 1000€ en céntimos
    },
];

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🚚 SEED SHIPPING METHODS - Uniclima Vendure            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener zonas existentes
        console.log('\n📋 Obteniendo zonas de envío...');
        const zonesData = await graphqlRequest(GET_ZONES_QUERY);
        const zones = zonesData.zones.items;
        
        if (zones.length === 0) {
            throw new Error('No hay zonas configuradas. Ejecuta primero: npx tsx scripts/seed-tax-config.ts');
        }

        // Buscar zona España o usar la primera disponible
        let targetZone = zones.find((z: any) => z.name === 'España' || z.name === 'Spain');
        if (!targetZone) {
            targetZone = zones[0];
            console.log(`   ⚠️  Zona "España" no encontrada, usando: ${targetZone.name}`);
        } else {
            console.log(`   ✅ Zona encontrada: ${targetZone.name} (ID: ${targetZone.id})`);
        }

        // 3. Obtener canales
        console.log('\n📋 Obteniendo canales...');
        const channelsData = await graphqlRequest(GET_CHANNELS_QUERY);
        const defaultChannel = channelsData.channels.items.find((c: any) => c.code === '__default_channel__');
        
        if (!defaultChannel) {
            throw new Error('Canal predeterminado no encontrado');
        }
        console.log(`   ✅ Canal predeterminado: ${defaultChannel.id}`);

        // 4. Verificar métodos de envío existentes
        console.log('\n📋 Verificando métodos de envío existentes...');
        const existingMethodsData = await graphqlRequest(GET_SHIPPING_METHODS_QUERY);
        const existingCodes = new Set(existingMethodsData.shippingMethods.items.map((m: any) => m.code));
        console.log(`   Encontrados: ${existingCodes.size} métodos de envío`);

        // 5. Crear métodos de envío
        console.log('\n🚚 Creando métodos de envío...');
        console.log('─'.repeat(60));

        let createdCount = 0;
        let skippedCount = 0;

        for (const method of SHIPPING_METHODS) {
            // Verificar si ya existe
            if (existingCodes.has(method.code)) {
                console.log(`   ⏭️  "${method.name}" ya existe (código: ${method.code})`);
                skippedCount++;
                continue;
            }

            // Preparar el checker (verificador de elegibilidad)
            let checker: any;
            
            if (method.minOrderAmount) {
                // Usar checker de monto mínimo para envío gratis condicional
                checker = {
                    code: 'default-shipping-eligibility-checker',
                    arguments: [
                        {
                            name: 'orderMinimum',
                            value: method.minOrderAmount.toString(),
                        },
                    ],
                };
            } else {
                // Checker por defecto (siempre elegible)
                checker = {
                    code: 'default-shipping-eligibility-checker',
                    arguments: [],
                };
            }

            // Preparar el calculator (calculador de precio)
            const calculator = {
                code: 'default-shipping-calculator',
                arguments: [
                    {
                        name: 'rate',
                        value: method.price.toString(),
                    },
                    {
                        name: 'includesTax',
                        value: 'true',
                    },
                    {
                        name: 'taxRate',
                        value: '21',
                    },
                ],
            };

            // Crear el método de envío
            try {
                const input = {
                    code: method.code,
                    checker,
                    calculator,
                    fulfillmentHandler: 'manual-fulfillment',
                    translations: [
                        {
                            languageCode: 'en',
                            name: method.name,
                            description: method.description,
                        },
                    ],
                };

                const result = await graphqlRequest(CREATE_SHIPPING_METHOD_MUTATION, { input });
                const created = result.createShippingMethod;
                
                const priceDisplay = method.price === 0 ? 'GRATIS' : `${(method.price / 100).toFixed(2)}€`;
                console.log(`   ✅ "${method.name}" creado`);
                console.log(`      • Código: ${created.code}`);
                console.log(`      • Precio: ${priceDisplay}`);
                if (method.minOrderAmount) {
                    console.log(`      • Mínimo pedido: ${(method.minOrderAmount / 100).toFixed(2)}€`);
                }
                
                createdCount++;
            } catch (error: any) {
                console.log(`   ❌ Error creando "${method.name}": ${error.message}`);
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ SEED COMPLETADO EXITOSAMENTE                       ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        // Resumen
        console.log('📊 Resumen:');
        console.log(`   • Métodos creados: ${createdCount}`);
        console.log(`   • Métodos existentes (omitidos): ${skippedCount}`);
        console.log('\n📦 Métodos de envío configurados:');
        console.log('   ┌─────────────────────────┬──────────────┬─────────────────┐');
        console.log('   │ Método                  │ Precio       │ Condición       │');
        console.log('   ├─────────────────────────┼──────────────┼─────────────────┤');
        console.log('   │ Envío Estándar          │ 50,00€       │ -               │');
        console.log('   │ Envío Express           │ 100,00€      │ -               │');
        console.log('   │ Recogida en Tienda      │ GRATIS       │ -               │');
        console.log('   │ Envío Gratis            │ GRATIS       │ Pedido > 1.000€ │');
        console.log('   └─────────────────────────┴──────────────┴─────────────────┘');
        console.log('\n🔗 Verifica en: http://localhost:3001/dashboard → Settings → Shipping methods\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();