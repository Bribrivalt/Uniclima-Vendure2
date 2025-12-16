/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Crear Método de Pago Stripe
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Crea el método de pago "Stripe" en Vendure usando las claves API
 * configuradas en las variables de entorno.
 * 
 * REQUISITOS PREVIOS:
 * 1. El servidor Vendure debe estar corriendo
 * 2. Tener configuradas las variables STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET en .env
 * 3. Tener una cuenta de Stripe con las claves API
 * 
 * Ejecutar con: npx tsx scripts/seed-stripe-payment-method.ts
 * 
 * IMPORTANTE: Este script usa las claves del .env. Asegúrate de que
 * sean las correctas (test para desarrollo, live para producción).
 * ═══════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config';

const API_URL = 'http://localhost:3000/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

// Claves de Stripe desde variables de entorno
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

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

const GET_PAYMENT_METHODS_QUERY = `
    query GetPaymentMethods {
        paymentMethods {
            items {
                id
                code
                name
                enabled
                handler {
                    code
                    args {
                        name
                        value
                    }
                }
            }
        }
    }
`;

const GET_PAYMENT_METHOD_HANDLERS_QUERY = `
    query GetPaymentMethodHandlers {
        paymentMethodHandlers {
            code
            args {
                name
                type
                required
                defaultValue
                label
                description
            }
        }
    }
`;

const CREATE_PAYMENT_METHOD_MUTATION = `
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
        createPaymentMethod(input: $input) {
            id
            code
            name
            description
            enabled
            handler {
                code
                args {
                    name
                    value
                }
            }
        }
    }
`;

const UPDATE_PAYMENT_METHOD_MUTATION = `
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
        updatePaymentMethod(input: $input) {
            id
            code
            name
            enabled
            handler {
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
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        💳 CREAR MÉTODO DE PAGO STRIPE - Uniclima              ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Verificar variables de entorno
    console.log('📋 Verificando configuración...');
    
    if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX') {
        console.log('');
        console.log('⚠️  STRIPE_SECRET_KEY no está configurada correctamente');
        console.log('');
        console.log('   Para configurar Stripe:');
        console.log('   1. Ve a https://dashboard.stripe.com/apikeys');
        console.log('   2. Copia tu Secret Key (sk_test_... o sk_live_...)');
        console.log('   3. Añádela al archivo backend/.env como STRIPE_SECRET_KEY');
        console.log('');
        console.log('   Ejemplo:');
        console.log('   STRIPE_SECRET_KEY=sk_test_51ABC...xyz');
        console.log('');
        process.exit(1);
    }

    if (!STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET === 'whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX') {
        console.log('');
        console.log('⚠️  STRIPE_WEBHOOK_SECRET no está configurada');
        console.log('');
        console.log('   Para desarrollo local:');
        console.log('   1. Instala Stripe CLI: https://stripe.com/docs/stripe-cli');
        console.log('   2. Ejecuta: stripe listen --forward-to localhost:3000/payments/stripe');
        console.log('   3. Copia el webhook signing secret que aparece');
        console.log('   4. Añádelo al archivo backend/.env como STRIPE_WEBHOOK_SECRET');
        console.log('');
        console.log('   Para producción:');
        console.log('   1. Ve a https://dashboard.stripe.com/webhooks');
        console.log('   2. Crea un webhook apuntando a: https://tu-dominio.com/payments/stripe');
        console.log('   3. Selecciona eventos: payment_intent.succeeded, payment_intent.payment_failed');
        console.log('   4. Copia el Signing Secret');
        console.log('');
        process.exit(1);
    }

    console.log(`   ✅ STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY.substring(0, 12)}...`);
    console.log(`   ✅ STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET.substring(0, 12)}...`);

    try {
        // 1. Login
        await login();

        // 2. Verificar que el handler de Stripe está disponible
        console.log('\n📋 Verificando handlers de pago disponibles...');
        const handlersData = await graphqlRequest(GET_PAYMENT_METHOD_HANDLERS_QUERY);
        const stripeHandler = handlersData.paymentMethodHandlers.find((h: any) => h.code === 'stripe');
        
        if (!stripeHandler) {
            throw new Error('El handler "stripe" no está disponible. Asegúrate de que el StripePlugin esté configurado en vendure-config.ts');
        }
        console.log('   ✅ Handler "stripe" disponible');
        
        // Mostrar argumentos del handler
        console.log('\n   Argumentos del handler Stripe:');
        for (const arg of stripeHandler.args) {
            console.log(`   • ${arg.name} (${arg.type})${arg.required ? ' [requerido]' : ''}`);
        }

        // 3. Verificar si ya existe un método de pago Stripe
        console.log('\n📋 Verificando métodos de pago existentes...');
        const methodsData = await graphqlRequest(GET_PAYMENT_METHODS_QUERY);
        const existingStripeMethod = methodsData.paymentMethods.items.find(
            (m: any) => m.handler?.code === 'stripe' || m.code === 'stripe'
        );

        if (existingStripeMethod) {
            console.log(`   ⚠️  Ya existe un método de pago Stripe (ID: ${existingStripeMethod.id})`);
            console.log('   Actualizando configuración...');
            
            // Actualizar el método existente
            const updateResult = await graphqlRequest(UPDATE_PAYMENT_METHOD_MUTATION, {
                input: {
                    id: existingStripeMethod.id,
                    enabled: true,
                    handler: {
                        code: 'stripe',
                        arguments: [
                            { name: 'apiKey', value: STRIPE_SECRET_KEY },
                            { name: 'webhookSecret', value: STRIPE_WEBHOOK_SECRET },
                        ],
                    },
                }
            });
            
            console.log(`   ✅ Método de pago actualizado (ID: ${updateResult.updatePaymentMethod.id})`);
        } else {
            // 4. Crear nuevo método de pago
            console.log('\n💳 Creando método de pago Stripe...');
            
            const createResult = await graphqlRequest(CREATE_PAYMENT_METHOD_MUTATION, {
                input: {
                    code: 'stripe',
                    enabled: true,
                    handler: {
                        code: 'stripe',
                        arguments: [
                            { name: 'apiKey', value: STRIPE_SECRET_KEY },
                            { name: 'webhookSecret', value: STRIPE_WEBHOOK_SECRET },
                        ],
                    },
                    translations: [
                        {
                            languageCode: 'en',
                            name: 'Tarjeta de crédito/débito',
                            description: 'Pago seguro con tarjeta mediante Stripe. Aceptamos Visa, Mastercard, American Express.',
                        }
                    ],
                }
            });
            
            console.log(`   ✅ Método de pago creado (ID: ${createResult.createPaymentMethod.id})`);
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ CONFIGURACIÓN DE STRIPE COMPLETADA                 ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        console.log('📊 Resumen:');
        console.log('   • Método de pago: Tarjeta de crédito/débito (Stripe)');
        console.log('   • Estado: Habilitado');
        console.log(`   • API Key: ${STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'TEST MODE' : 'LIVE MODE'}`);
        
        console.log('\n🔗 Próximos pasos:');
        console.log('   1. Verifica en Dashboard: http://localhost:3000/dashboard → Settings → Payment methods');
        console.log('   2. Para desarrollo, ejecuta: stripe listen --forward-to localhost:3000/payments/stripe');
        console.log('   3. Configura NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en frontend/.env.local');
        console.log('   4. Prueba un pago de prueba con tarjeta 4242 4242 4242 4242');
        
        console.log('\n💡 Tarjetas de prueba de Stripe:');
        console.log('   • Exitosa: 4242 4242 4242 4242');
        console.log('   • Requiere autenticación: 4000 0025 0000 3155');
        console.log('   • Rechazada: 4000 0000 0000 9995');
        console.log('');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();