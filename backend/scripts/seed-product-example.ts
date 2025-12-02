/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Seed Producto de Ejemplo HVAC
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Crea un producto de ejemplo con todos los custom fields y facets asignados.
 * 
 * Ejecutar con: npx tsx scripts/seed-product-example.ts
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

const GET_FACET_VALUES_QUERY = `
    query GetFacetValues {
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

const GET_COLLECTIONS_QUERY = `
    query GetCollections {
        collections {
            items {
                id
                name
                slug
            }
        }
    }
`;

const CREATE_PRODUCT_MUTATION = `
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
            name
            slug
            customFields {
                potenciaKw
                frigorias
                claseEnergetica
                refrigerante
            }
        }
    }
`;

const CREATE_PRODUCT_VARIANT_MUTATION = `
    mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
            id
            name
            sku
            price
        }
    }
`;

const ASSIGN_TO_COLLECTION_MUTATION = `
    mutation AssignProductsToCollection($input: AssignProductsToCollectionInput!) {
        assignProductsToCollection(input: $input) {
            id
            name
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
// DATOS DEL PRODUCTO DE EJEMPLO
// ─────────────────────────────────────────────────────────────────────────

const PRODUCT_DATA = {
    name: 'Daikin Sensira TXF35C',
    slug: 'daikin-sensira-txf35c',
    description: `
        <p><strong>Daikin Sensira TXF35C</strong> - El aire acondicionado split de pared más vendido de Daikin.</p>
        <p>Equipo con tecnología Inverter y refrigerante R32 ecológico. Ideal para habitaciones de 25-35 m².</p>
        <h3>Características principales:</h3>
        <ul>
            <li>Tecnología Inverter para máximo ahorro energético</li>
            <li>Refrigerante R32 con bajo impacto ambiental</li>
            <li>Modo silencioso para máximo confort nocturno</li>
            <li>Filtro de aire de alta eficiencia</li>
            <li>Función bomba de calor (frío + calor)</li>
        </ul>
    `,
    // Custom Fields HVAC
    customFields: {
        potenciaKw: 3.5,
        frigorias: 3010,
        claseEnergetica: 'A++',
        refrigerante: 'R32',
    },
    // Facets a asignar (por código)
    facets: {
        marca: 'daikin',
        'tipo-producto': 'split-pared',
        'clase-energetica': 'a',      // A++ no es slug válido, usar 'a'
        refrigerante: 'r32',
        potencia: '35-5kw-30-40m2',    // 3.5 - 5kW (30-40m²)
        caracteristicas: ['bomba-de-calor', 'inverter'],
    },
    // Collection a asignar
    collection: 'split-pared',
    // Variante (precio)
    variant: {
        sku: 'DAIKIN-TXF35C',
        price: 69900,  // En céntimos: 699.00€
        stock: 15,
    }
};

// ─────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        🏭 SEED PRODUCTO EJEMPLO - Uniclima Vendure            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener FacetValues existentes
        console.log('\n📋 Obteniendo facets...');
        const facetsData = await graphqlRequest(GET_FACET_VALUES_QUERY);
        const facetValuesMap = new Map<string, string>();
        
        for (const facet of facetsData.facets.items) {
            for (const value of facet.values) {
                // Guardar con key: "facetCode:valueCode"
                facetValuesMap.set(`${facet.code}:${value.code}`, value.id);
            }
        }
        console.log(`   Encontrados: ${facetValuesMap.size} valores de facets`);

        // 3. Obtener Collections existentes
        console.log('\n📋 Obteniendo collections...');
        const collectionsData = await graphqlRequest(GET_COLLECTIONS_QUERY);
        const collectionsMap = new Map<string, string>();
        
        for (const collection of collectionsData.collections.items) {
            collectionsMap.set(collection.slug, collection.id);
        }
        console.log(`   Encontradas: ${collectionsMap.size} collections`);

        // 4. Buscar IDs de facet values para asignar
        console.log('\n🔍 Buscando facet values para asignar...');
        const facetValueIds: string[] = [];
        
        // Buscar valor de Marca: Daikin
        const daikinId = facetValuesMap.get('marca:daikin');
        if (daikinId) {
            facetValueIds.push(daikinId);
            console.log('   ✅ Marca: Daikin');
        }

        // Buscar valor de Tipo: Split Pared  
        const splitId = facetValuesMap.get('tipo-producto:split-pared');
        if (splitId) {
            facetValueIds.push(splitId);
            console.log('   ✅ Tipo: Split Pared');
        }

        // Buscar valor de Refrigerante: R32
        const r32Id = facetValuesMap.get('refrigerante:r32');
        if (r32Id) {
            facetValueIds.push(r32Id);
            console.log('   ✅ Refrigerante: R32');
        }

        // Buscar valor de Características: Inverter
        const inverterId = facetValuesMap.get('caracteristicas:inverter');
        if (inverterId) {
            facetValueIds.push(inverterId);
            console.log('   ✅ Característica: Inverter');
        }

        // Buscar valor de Características: Bomba de Calor
        const bombaId = facetValuesMap.get('caracteristicas:bomba-de-calor');
        if (bombaId) {
            facetValueIds.push(bombaId);
            console.log('   ✅ Característica: Bomba de Calor');
        }

        // 5. Crear el producto
        console.log('\n🏭 Creando producto...');
        const productData = await graphqlRequest(CREATE_PRODUCT_MUTATION, {
            input: {
                translations: [
                    {
                        languageCode: 'en',
                        name: PRODUCT_DATA.name,
                        slug: PRODUCT_DATA.slug,
                        description: PRODUCT_DATA.description,
                    }
                ],
                customFields: PRODUCT_DATA.customFields,
                facetValueIds: facetValueIds,
            }
        });

        const productId = productData.createProduct.id;
        console.log(`   ✅ Producto creado: ${productData.createProduct.name} (ID: ${productId})`);
        console.log(`   📊 Custom Fields:`);
        console.log(`      - Potencia: ${productData.createProduct.customFields.potenciaKw} kW`);
        console.log(`      - Frigorías: ${productData.createProduct.customFields.frigorias}`);
        console.log(`      - Clase Energética: ${productData.createProduct.customFields.claseEnergetica}`);
        console.log(`      - Refrigerante: ${productData.createProduct.customFields.refrigerante}`);

        // 6. Crear variante con precio
        console.log('\n💰 Creando variante con precio...');
        const variantData = await graphqlRequest(CREATE_PRODUCT_VARIANT_MUTATION, {
            input: [
                {
                    productId: productId,
                    sku: PRODUCT_DATA.variant.sku,
                    price: PRODUCT_DATA.variant.price,
                    translations: [
                        {
                            languageCode: 'en',
                            name: PRODUCT_DATA.name,
                        }
                    ],
                    stockOnHand: PRODUCT_DATA.variant.stock,
                }
            ]
        });
        
        const variant = variantData.createProductVariants[0];
        console.log(`   ✅ Variante creada: ${variant.sku}`);
        console.log(`   💶 Precio: ${(variant.price / 100).toFixed(2)}€`);

        // 7. Asignar a Collection
        console.log('\n📁 Asignando a collection...');
        const collectionId = collectionsMap.get(PRODUCT_DATA.collection);
        
        if (collectionId) {
            await graphqlRequest(ASSIGN_TO_COLLECTION_MUTATION, {
                input: {
                    collectionId: collectionId,
                    productIds: [productId],
                }
            });
            console.log(`   ✅ Asignado a collection: ${PRODUCT_DATA.collection}`);
        } else {
            console.log(`   ⚠️  Collection "${PRODUCT_DATA.collection}" no encontrada`);
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('          ✅ PRODUCTO CREADO EXITOSAMENTE                       ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        console.log('📊 Resumen del producto:');
        console.log(`   • Nombre: ${PRODUCT_DATA.name}`);
        console.log(`   • SKU: ${PRODUCT_DATA.variant.sku}`);
        console.log(`   • Precio: ${(PRODUCT_DATA.variant.price / 100).toFixed(2)}€`);
        console.log(`   • Potencia: ${PRODUCT_DATA.customFields.potenciaKw} kW`);
        console.log(`   • Frigorías: ${PRODUCT_DATA.customFields.frigorias}`);
        console.log(`   • Clase: ${PRODUCT_DATA.customFields.claseEnergetica}`);
        console.log(`   • Refrigerante: ${PRODUCT_DATA.customFields.refrigerante}`);
        console.log(`   • Stock: ${PRODUCT_DATA.variant.stock} unidades`);
        
        console.log('\n🔗 Ver producto en:');
        console.log(`   Dashboard: http://localhost:3001/dashboard/catalog/products`);
        console.log(`   Shop API: http://localhost:3001/shop-api → Query: products { items { name customFields { potenciaKw } } }`);

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();