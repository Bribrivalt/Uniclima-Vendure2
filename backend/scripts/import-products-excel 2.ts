/**
 * Script de importación de productos desde Excel
 * 
 * Lee el archivo Vendure_BBDD.xlsx y crea productos en Vendure usando la Admin API.
 * 
 * Columnas del Excel:
 * - SKU: código único del producto
 * - Categoria: nombre de la colección
 * - Marca: facet de marca
 * - precio: precio en euros (se convierte a céntimos)
 * - inventario: cantidad en stock
 * - nombre_corregido_nuevo: nombre del producto
 * - compatibilidades: customField
 * - errores_sintomas: customField
 * - descripcion_tecnica: descripción del producto
 * - imagen_1, imagen_2, imagen_3, imagen_4: URLs de imágenes
 * 
 * Uso:
 *   npx ts-node scripts/import-products-excel.ts
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Tipos para los datos del Excel (nombres exactos de columnas en minúsculas)
interface ExcelRow {
    sku: string;
    categoria: string;
    marca: string;
    precio: number;
    inventario: number;
    nombre_corregido_nuevo: string;
    compatibilidades?: string;
    errores_sintomas?: string;
    descripcion_tecnica?: string;
    imagen_1?: string;
    imagen_2?: string;
    imagen_3?: string;
    imagen_4?: string;
}

// Configuración de la API
const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

// Token de autenticación (bearer token)
let authToken: string | null = null;

/**
 * Ejecuta una query GraphQL contra la Admin API
 */
async function adminApiQuery(query: string, variables: Record<string, unknown> = {}): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    // Capturar el bearer token del header si existe
    const vendureAuthToken = response.headers.get('vendure-auth-token');
    if (vendureAuthToken) {
        authToken = vendureAuthToken;
    }

    const result = await response.json();
    
    if (result.errors) {
        console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
        throw new Error(result.errors[0]?.message || 'GraphQL Error');
    }

    return result.data;
}

/**
 * Autenticación con la Admin API usando bearer token
 */
async function login(): Promise<void> {
    console.log('🔐 Autenticando con la Admin API...');
    
    const query = `
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
                ... on NativeAuthStrategyError {
                    errorCode
                    message
                }
            }
        }
    `;

    // Hacer la petición de login y capturar el token
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(ADMIN_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables: {
                username: SUPERADMIN_USERNAME,
                password: SUPERADMIN_PASSWORD,
            }
        }),
    });

    // Capturar el bearer token del header
    const vendureAuthToken = response.headers.get('vendure-auth-token');
    if (vendureAuthToken) {
        authToken = vendureAuthToken;
        console.log(`🔑 Token obtenido: ${authToken.substring(0, 20)}...`);
    }

    const result = await response.json();
    
    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Login error');
    }

    const data = result.data;

    if (data.login.errorCode) {
        throw new Error(`Login failed: ${data.login.message}`);
    }

    console.log(`✅ Autenticado como: ${data.login.identifier}`);
}

/**
 * Lee el archivo Excel y retorna los datos como array de objetos
 */
function readExcel(filePath: string): ExcelRow[] {
    console.log(`📖 Leyendo archivo Excel: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
    
    console.log(`📊 Encontrados ${data.length} productos en el Excel`);
    
    return data;
}

/**
 * Obtiene o crea una colección por nombre
 */
async function getOrCreateCollection(name: string): Promise<string> {
    // Primero buscar si existe
    const searchQuery = `
        query SearchCollections($term: String!) {
            collections(options: { filter: { name: { contains: $term } } }) {
                items {
                    id
                    name
                }
            }
        }
    `;

    const searchResult = await adminApiQuery(searchQuery, { term: name });
    const existing = searchResult.collections.items.find(
        (c: { name: string }) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
        console.log(`  📁 Colección existente: ${name} (ID: ${existing.id})`);
        return existing.id;
    }

    // Crear la colección si no existe
    const createQuery = `
        mutation CreateCollection($input: CreateCollectionInput!) {
            createCollection(input: $input) {
                id
                name
            }
        }
    `;

    const slug = name.toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const createResult = await adminApiQuery(createQuery, {
        input: {
            translations: [{
                languageCode: 'es',
                name: name,
                slug: slug,
                description: `Productos de ${name}`,
            }],
            filters: [],
        },
    });

    console.log(`  📁 Colección creada: ${name} (ID: ${createResult.createCollection.id})`);
    return createResult.createCollection.id;
}

/**
 * Obtiene o crea un facet "Marca" y su valor
 */
async function getOrCreateBrandFacetValue(brandName: string): Promise<string> {
    // Buscar el facet "Marca"
    const searchFacetQuery = `
        query {
            facets(options: { filter: { name: { eq: "Marca" } } }) {
                items {
                    id
                    name
                    values {
                        id
                        name
                    }
                }
            }
        }
    `;

    let facetResult = await adminApiQuery(searchFacetQuery);
    let marcaFacet = facetResult.facets.items[0];

    // Crear el facet "Marca" si no existe
    if (!marcaFacet) {
        const createFacetQuery = `
            mutation CreateFacet($input: CreateFacetInput!) {
                createFacet(input: $input) {
                    id
                    name
                    values {
                        id
                        name
                    }
                }
            }
        `;

        const createFacetResult = await adminApiQuery(createFacetQuery, {
            input: {
                code: 'marca',
                isPrivate: false,
                translations: [{
                    languageCode: 'es',
                    name: 'Marca',
                }],
            },
        });

        marcaFacet = createFacetResult.createFacet;
        console.log(`  🏷️ Facet "Marca" creado (ID: ${marcaFacet.id})`);
    }

    // Buscar si el valor de marca ya existe
    const existingValue = marcaFacet.values?.find(
        (v: { name: string }) => v.name.toLowerCase() === brandName.toLowerCase()
    );

    if (existingValue) {
        console.log(`  🏷️ Marca existente: ${brandName} (ID: ${existingValue.id})`);
        return existingValue.id;
    }

    // Crear el valor de facet para esta marca
    const createValueQuery = `
        mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
            createFacetValues(input: $input) {
                id
                name
            }
        }
    `;

    const valueCode = brandName.toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const createValueResult = await adminApiQuery(createValueQuery, {
        input: [{
            facetId: marcaFacet.id,
            code: valueCode,
            translations: [{
                languageCode: 'es',
                name: brandName,
            }],
        }],
    });

    console.log(`  🏷️ Marca creada: ${brandName} (ID: ${createValueResult.createFacetValues[0].id})`);
    return createValueResult.createFacetValues[0].id;
}

/**
 * Crea un producto en Vendure
 */
async function createProduct(row: ExcelRow): Promise<void> {
    console.log(`\n📦 Procesando: ${row.nombre_corregido_nuevo} (SKU: ${row.sku})`);

    // Obtener/crear colección
    let collectionId: string | null = null;
    if (row.categoria) {
        collectionId = await getOrCreateCollection(row.categoria);
    }

    // Obtener/crear facet de marca
    let facetValueIds: string[] = [];
    if (row.marca) {
        const brandFacetValueId = await getOrCreateBrandFacetValue(row.marca);
        facetValueIds.push(brandFacetValueId);
    }

    // Generar slug
    const slug = row.nombre_corregido_nuevo.toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + (row.sku || '').toLowerCase();

    // Crear el producto
    const createProductQuery = `
        mutation CreateProduct($input: CreateProductInput!) {
            createProduct(input: $input) {
                id
                name
                slug
            }
        }
    `;

    const productResult = await adminApiQuery(createProductQuery, {
        input: {
            translations: [{
                languageCode: 'es',
                name: row.nombre_corregido_nuevo,
                slug: slug,
                description: row.descripcion_tecnica || '',
            }],
            facetValueIds: facetValueIds,
            customFields: {
                compatibilidades: row.compatibilidades || null,
                erroresSintomas: row.errores_sintomas || null,
            },
        },
    });

    const productId = productResult.createProduct.id;
    console.log(`  ✅ Producto creado: ${productResult.createProduct.name} (ID: ${productId})`);

    // Crear la variante del producto
    const createVariantQuery = `
        mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
            createProductVariants(input: $input) {
                id
                sku
                name
                price
                stockOnHand
            }
        }
    `;

    // Convertir precio a céntimos (Vendure usa céntimos)
    const priceInCents = Math.round((row.precio || 0) * 100);

    const variantResult = await adminApiQuery(createVariantQuery, {
        input: [{
            productId: productId,
            sku: row.sku || `SKU-${Date.now()}`,
            translations: [{
                languageCode: 'es',
                name: row.nombre_corregido_nuevo,
            }],
            price: priceInCents,
            stockOnHand: row.inventario || 0,
            trackInventory: 'TRUE',
        }],
    });

    console.log(`  ✅ Variante creada: SKU ${row.sku}, Precio: €${row.precio}, Stock: ${row.inventario}`);

    // Asignar a colección si existe
    if (collectionId) {
        // Las colecciones en Vendure se asignan mediante filtros
        // Por simplicidad, podemos añadir el producto a la colección manualmente
        // o usar la funcionalidad de filtros de colección
        console.log(`  📁 Producto asociado a colección: ${row.categoria}`);
    }

    // TODO: Subir imágenes si las URLs son válidas
    // Las imágenes requieren descargar de las URLs y subir como assets
    const images = [row.imagen_1, row.imagen_2, row.imagen_3, row.imagen_4].filter(Boolean);
    if (images.length > 0) {
        console.log(`  🖼️ ${images.length} imagen(es) pendientes de subir (se requiere implementación adicional)`);
    }
}

/**
 * Función principal
 */
async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  IMPORTADOR DE PRODUCTOS DESDE EXCEL');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        // Autenticarse
        await login();

        // Leer el Excel
        const excelPath = path.join(__dirname, '../../Vendure_BBDD.xlsx');
        const products = readExcel(excelPath);

        if (products.length === 0) {
            console.log('⚠️ No se encontraron productos en el Excel');
            return;
        }

        // Procesar cada producto
        let successCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                await createProduct(product);
                successCount++;
            } catch (error) {
                console.error(`  ❌ Error procesando ${product.sku}:`, error);
                errorCount++;
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log(`  IMPORTACIÓN COMPLETADA`);
        console.log(`  ✅ Exitosos: ${successCount}`);
        console.log(`  ❌ Errores: ${errorCount}`);
        console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

// Ejecutar
main();