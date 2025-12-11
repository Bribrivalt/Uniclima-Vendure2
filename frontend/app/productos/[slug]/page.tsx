/**
 * Página de Detalle de Producto - Server Component con ISR
 *
 * Esta página usa Incremental Static Regeneration (ISR) para:
 * - Generar páginas estáticas en el primer acceso
 * - Regenerar en background cada 60 segundos
 * - Mejorar SEO con metadata dinámica
 * - Reducir carga en el servidor
 *
 * @author Frontend Team
 * @version 3.0.0 - ISR implementation
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { generateProductMetadata } from '@/lib/seo/metadata';
import styles from './page.module.css';

// ========================================
// CONFIGURACIÓN ISR
// ========================================

/**
 * Revalidar cada 60 segundos
 * Las páginas se regeneran en background mientras se sirve la versión en caché
 */
export const revalidate = 60;

/**
 * Permitir generación dinámica de páginas no generadas en build time
 */
export const dynamicParams = true;

// ========================================
// TIPOS
// ========================================

interface PageProps {
    params: { slug: string };
}

interface ProductData {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset?: {
        id: string;
        preview: string;
    };
    assets?: Array<{
        id: string;
        preview: string;
    }>;
    variants: Array<{
        id: string;
        name: string;
        sku: string;
        priceWithTax: number;
        stockLevel: string;
    }>;
    customFields?: {
        potenciaKw?: number;
        frigorias?: number;
        claseEnergetica?: string;
        refrigerante?: string;
        wifi?: boolean;
        garantiaAnos?: number;
        modoVenta?: string;
        superficieRecomendada?: string;
        seer?: number;
        scop?: number;
        nivelSonoroInterior?: number;
        nivelSonoroExterior?: number;
        dimensionesInterior?: string;
        dimensionesExterior?: string;
        pesoUnidadInterior?: number;
        pesoUnidadExterior?: number;
        alimentacion?: string;
        cargaRefrigerante?: number;
        longitudMaximaTuberia?: number;
        desnivelMaximo?: number;
    };
    facetValues?: Array<{
        id: string;
        name: string;
        facet: {
            id: string;
            name: string;
        };
    }>;
}

// ========================================
// DATA FETCHING
// ========================================

const VENDURE_API = process.env.NEXT_PUBLIC_VENDURE_SHOP_API || 'http://localhost:3000/shop-api';

/**
 * Obtiene el producto desde Vendure API
 * Se ejecuta en el servidor durante ISR
 */
async function getProduct(slug: string): Promise<ProductData | null> {
    const query = `
        query GetProductBySlug($slug: String!) {
            product(slug: $slug) {
                id
                name
                slug
                description
                featuredAsset {
                    id
                    preview
                }
                assets {
                    id
                    preview
                }
                variants {
                    id
                    name
                    sku
                    priceWithTax
                    stockLevel
                }
                customFields {
                    potenciaKw
                    frigorias
                    claseEnergetica
                    refrigerante
                    wifi
                    garantiaAnos
                    modoVenta
                    superficieRecomendada
                    seer
                    scop
                    nivelSonoroInterior
                    nivelSonoroExterior
                    dimensionesInterior
                    dimensionesExterior
                    pesoUnidadInterior
                    pesoUnidadExterior
                    alimentacion
                    cargaRefrigerante
                    longitudMaximaTuberia
                    desnivelMaximo
                }
                facetValues {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch(VENDURE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { slug },
            }),
            next: {
                revalidate: 60, // ISR: revalidar cada 60 segundos
            },
        });

        if (!response.ok) {
            console.error('Error fetching product:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data?.data?.product || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * Obtiene todos los slugs de productos para generar rutas estáticas
 */
async function getAllProductSlugs(): Promise<string[]> {
    const query = `
        query GetAllProductSlugs {
            products(options: { take: 100, filter: { enabled: { eq: true } } }) {
                items {
                    slug
                }
            }
        }
    `;

    try {
        const response = await fetch(VENDURE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 300 }, // Cache slugs por 5 minutos
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data?.data?.products?.items?.map((p: { slug: string }) => p.slug) || [];
    } catch (error) {
        console.error('Error fetching product slugs:', error);
        return [];
    }
}

// ========================================
// METADATA GENERATION
// ========================================

/**
 * Genera metadata dinámica para SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const product = await getProduct(params.slug);

    if (!product) {
        return {
            title: 'Producto no encontrado | Uniclima',
            description: 'El producto que buscas no existe o ha sido eliminado.',
        };
    }

    const price = product.variants[0]?.priceWithTax
        ? (product.variants[0].priceWithTax / 100).toFixed(2)
        : undefined;

    return generateProductMetadata({
        name: product.name,
        description: product.description,
        slug: product.slug,
        image: product.featuredAsset?.preview,
        price: price,
        currency: 'EUR',
        availability: product.variants[0]?.stockLevel === 'IN_STOCK' ? 'InStock' : 'OutOfStock',
        brand: 'Uniclima',
        sku: product.variants[0]?.sku,
    });
}

// ========================================
// STATIC PARAMS GENERATION
// ========================================

/**
 * Genera rutas estáticas para los productos más populares
 * en build time. Los demás se generan on-demand con ISR.
 */
export async function generateStaticParams() {
    const slugs = await getAllProductSlugs();

    // Limitar a los primeros 50 productos para el build inicial
    // El resto se generará on-demand con ISR
    return slugs.slice(0, 50).map((slug) => ({
        slug,
    }));
}

// ========================================
// PAGE COMPONENT
// ========================================

export default async function ProductDetailPage({ params }: PageProps) {
    const product = await getProduct(params.slug);

    // Si no se encuentra el producto, mostrar 404
    if (!product) {
        notFound();
    }

    // Pasar los datos al componente cliente para interactividad
    return <ProductDetailClient product={product as any} />;
}