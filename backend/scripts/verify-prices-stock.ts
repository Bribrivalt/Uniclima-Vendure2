/**
 * ═══════════════════════════════════════════════════════════════════════
 * SCRIPT: Verify Prices and Stock
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Analiza y reporta el estado de precios y stock de todos los productos.
 * Identifica:
 * - Productos sin precio
 * - Productos con precio 0
 * - Productos sin stock
 * - Productos deshabilitados
 * 
 * Ejecutar con: npx ts-node scripts/verify-prices-stock.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

const API_URL = 'http://localhost:3001/admin-api';
const SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'superadmin';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'superadmin';

let authToken: string | null = null;

// ─────────────────────────────────────────────────────────────────────────
// GRAPHQL QUERIES
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

const GET_PRODUCTS_WITH_VARIANTS_QUERY = `
    query GetProductsWithVariants {
        products(options: { take: 500 }) {
            items {
                id
                name
                slug
                enabled
                featuredAsset {
                    id
                }
                variants {
                    id
                    name
                    sku
                    price
                    priceWithTax
                    stockOnHand
                    stockAllocated
                    enabled
                }
            }
            totalItems
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

interface ProductIssue {
    productId: string;
    productName: string;
    slug: string;
    issues: string[];
    variantSku?: string;
    variantPrice?: number;
    variantStock?: number;
}

async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('        📊 VERIFY PRICES & STOCK - Uniclima Vendure            ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // 1. Login
        await login();

        // 2. Obtener productos con variantes
        console.log('\n📋 Obteniendo productos y variantes...');
        const productsData = await graphqlRequest(GET_PRODUCTS_WITH_VARIANTS_QUERY);
        const products = productsData.products.items;
        console.log(`   ✅ Encontrados: ${products.length} productos`);

        // 3. Análisis
        const issues: ProductIssue[] = [];
        let totalVariants = 0;
        let variantsWithPrice = 0;
        let variantsWithStock = 0;
        let enabledProducts = 0;
        let enabledVariants = 0;
        let productsWithImages = 0;

        // Estadísticas de precios
        let minPrice = Infinity;
        let maxPrice = 0;
        let totalPrice = 0;
        let priceCount = 0;

        // Estadísticas de stock
        let totalStock = 0;

        for (const product of products) {
            const productIssues: string[] = [];
            
            // Verificar si producto está habilitado
            if (product.enabled) {
                enabledProducts++;
            } else {
                productIssues.push('❌ Producto deshabilitado');
            }

            // Verificar imagen
            if (product.featuredAsset) {
                productsWithImages++;
            } else {
                productIssues.push('📷 Sin imagen');
            }

            // Verificar variantes
            if (!product.variants || product.variants.length === 0) {
                productIssues.push('⚠️ Sin variantes (no vendible)');
            } else {
                for (const variant of product.variants) {
                    totalVariants++;

                    if (variant.enabled) {
                        enabledVariants++;
                    }

                    // Precio
                    if (variant.price > 0) {
                        variantsWithPrice++;
                        totalPrice += variant.price;
                        priceCount++;
                        if (variant.price < minPrice) minPrice = variant.price;
                        if (variant.price > maxPrice) maxPrice = variant.price;
                    } else {
                        productIssues.push(`💰 Variante "${variant.sku}" sin precio o precio 0`);
                    }

                    // Stock
                    if (variant.stockOnHand > 0) {
                        variantsWithStock++;
                        totalStock += variant.stockOnHand;
                    } else {
                        productIssues.push(`📦 Variante "${variant.sku}" sin stock (stockOnHand: ${variant.stockOnHand})`);
                    }
                }
            }

            if (productIssues.length > 0) {
                issues.push({
                    productId: product.id,
                    productName: product.name,
                    slug: product.slug,
                    issues: productIssues,
                });
            }
        }

        // 4. Reporte
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('                      📊 REPORTE DE ESTADO                      ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        // Estadísticas generales
        console.log('📈 ESTADÍSTICAS GENERALES:');
        console.log('─'.repeat(60));
        console.log(`   Total productos:          ${products.length}`);
        console.log(`   Productos habilitados:    ${enabledProducts} (${((enabledProducts/products.length)*100).toFixed(1)}%)`);
        console.log(`   Productos con imagen:     ${productsWithImages} (${((productsWithImages/products.length)*100).toFixed(1)}%)`);
        console.log(`   Total variantes:          ${totalVariants}`);
        console.log(`   Variantes habilitadas:    ${enabledVariants}`);
        console.log(`   Variantes con precio:     ${variantsWithPrice}`);
        console.log(`   Variantes con stock:      ${variantsWithStock}`);

        // Estadísticas de precios
        console.log('\n💰 ESTADÍSTICAS DE PRECIOS:');
        console.log('─'.repeat(60));
        if (priceCount > 0) {
            console.log(`   Precio mínimo:            ${(minPrice/100).toFixed(2)}€`);
            console.log(`   Precio máximo:            ${(maxPrice/100).toFixed(2)}€`);
            console.log(`   Precio promedio:          ${(totalPrice/priceCount/100).toFixed(2)}€`);
        } else {
            console.log('   ⚠️  No hay productos con precio definido');
        }

        // Estadísticas de stock
        console.log('\n📦 ESTADÍSTICAS DE STOCK:');
        console.log('─'.repeat(60));
        console.log(`   Stock total:              ${totalStock} unidades`);
        console.log(`   Variantes con stock:      ${variantsWithStock} de ${totalVariants}`);

        // Problemas detectados
        console.log('\n⚠️  PROBLEMAS DETECTADOS:');
        console.log('─'.repeat(60));

        if (issues.length === 0) {
            console.log('   ✅ ¡No se detectaron problemas! Todos los productos están OK.');
        } else {
            console.log(`   Se encontraron ${issues.length} productos con problemas:\n`);
            
            // Agrupar por tipo de problema
            const noVariants = issues.filter(i => i.issues.some(iss => iss.includes('Sin variantes')));
            const noPrice = issues.filter(i => i.issues.some(iss => iss.includes('sin precio')));
            const noStock = issues.filter(i => i.issues.some(iss => iss.includes('sin stock')));
            const disabled = issues.filter(i => i.issues.some(iss => iss.includes('deshabilitado')));
            const noImage = issues.filter(i => i.issues.some(iss => iss.includes('Sin imagen')));

            if (noVariants.length > 0) {
                console.log(`   ❌ Sin variantes: ${noVariants.length} productos`);
            }
            if (noPrice.length > 0) {
                console.log(`   💰 Sin precio: ${noPrice.length} productos`);
            }
            if (noStock.length > 0) {
                console.log(`   📦 Sin stock: ${noStock.length} productos`);
            }
            if (disabled.length > 0) {
                console.log(`   🚫 Deshabilitados: ${disabled.length} productos`);
            }
            if (noImage.length > 0) {
                console.log(`   📷 Sin imagen: ${noImage.length} productos`);
            }

            // Detalle de primeros 10 problemas
            console.log('\n   Detalle (primeros 10):');
            for (const issue of issues.slice(0, 10)) {
                console.log(`\n   📦 ${issue.productName}`);
                console.log(`      Slug: ${issue.slug}`);
                for (const iss of issue.issues) {
                    console.log(`      ${iss}`);
                }
            }

            if (issues.length > 10) {
                console.log(`\n   ... y ${issues.length - 10} más`);
            }
        }

        // Resumen de salud
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('                    🏥 RESUMEN DE SALUD                         ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        const healthScore = ((variantsWithPrice + variantsWithStock + enabledVariants) / (totalVariants * 3)) * 100;
        
        if (healthScore >= 90) {
            console.log(`   ✅ EXCELENTE (${healthScore.toFixed(1)}%)`);
        } else if (healthScore >= 70) {
            console.log(`   🟡 BUENO (${healthScore.toFixed(1)}%)`);
        } else if (healthScore >= 50) {
            console.log(`   🟠 REGULAR (${healthScore.toFixed(1)}%)`);
        } else {
            console.log(`   🔴 NECESITA ATENCIÓN (${healthScore.toFixed(1)}%)`);
        }

        console.log('\n🔗 Dashboard: http://localhost:3001/dashboard → Catalog → Products\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar script
main();