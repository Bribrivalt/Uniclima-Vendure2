/**
 * Script para añadir países a Vendure
 * Ejecutar: npx ts-node scripts/seed-countries.ts
 */

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

async function graphqlRequest(query: string, variables: Record<string, any> = {}) {
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

    // Capturar token de autenticación de los headers de respuesta
    const newToken = response.headers.get('vendure-auth-token');
    if (newToken) {
        authToken = newToken;
    }

    const json = await response.json();
    
    if (json.errors) {
        console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
        throw new Error(json.errors[0].message);
    }
    
    return json.data;
}

async function login() {
    console.log('🔐 Iniciando sesión en Admin API...');
    
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

    const data = await graphqlRequest(LOGIN_MUTATION, {
        username: SUPERADMIN_USERNAME,
        password: SUPERADMIN_PASSWORD,
    });

    if (data.login.errorCode) {
        throw new Error(`Login fallido: ${data.login.message}`);
    }

    console.log(`✅ Login exitoso como: ${data.login.identifier}`);
}

async function getCountries() {
    const GET_COUNTRIES = `
        query GetCountries {
            countries {
                items {
                    id
                    code
                    name
                    enabled
                }
                totalItems
            }
        }
    `;

    const data = await graphqlRequest(GET_COUNTRIES);
    return data.countries;
}

async function createCountry(code: string, name: string) {
    const CREATE_COUNTRY = `
        mutation CreateCountry($input: CreateCountryInput!) {
            createCountry(input: $input) {
                id
                code
                name
                enabled
            }
        }
    `;

    const data = await graphqlRequest(CREATE_COUNTRY, {
        input: {
            code,
            enabled: true,
            translations: [
                {
                    languageCode: 'es',
                    name,
                },
                {
                    languageCode: 'en',
                    name,
                },
            ],
        },
    });

    return data.createCountry;
}

async function main() {
    console.log('🌍 Iniciando seed de países...\n');

    try {
        // Login
        await login();

        // Check existing countries
        const countries = await getCountries();
        console.log(`\n📊 Países actuales: ${countries.totalItems}`);
        
        const existingCodes = countries.items.map((c: any) => c.code);
        console.log('Códigos existentes:', existingCodes.join(', ') || '(ninguno)');

        // Countries to add
        const countriesToAdd = [
            { code: 'ES', name: 'España' },
            { code: 'PT', name: 'Portugal' },
            { code: 'FR', name: 'Francia' },
            { code: 'DE', name: 'Alemania' },
            { code: 'IT', name: 'Italia' },
            { code: 'GB', name: 'Reino Unido' },
            { code: 'AD', name: 'Andorra' },
        ];

        for (const country of countriesToAdd) {
            if (existingCodes.includes(country.code)) {
                console.log(`   ⏭️  ${country.name} (${country.code}) ya existe`);
            } else {
                const created = await createCountry(country.code, country.name);
                console.log(`   ✅ ${created.name} (${created.code}) creado con ID: ${created.id}`);
            }
        }

        console.log('\n✅ Seed de países completado!');
        
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

main();