/**
 * Utilidades mejoradas para metadata SEO
 * 
 * Genera metadata optimizada para Next.js con:
 * - Títulos optimizados (max 60 caracteres)
 * - Descripciones optimizadas (max 160 caracteres)
 * - Open Graph completo
 * - Twitter Cards
 * - Canonical URLs
 */

import { Metadata } from 'next';
import { Product } from '@/lib/types/product';

const SITE_NAME = 'Uniclima';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.com';
const DEFAULT_DESCRIPTION = 'Especialistas en climatización, aires acondicionados y sistemas HVAC. Productos de calidad con garantía y servicio técnico profesional.';

/**
 * Trunca texto a una longitud máxima
 */
function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Interface para parámetros simplificados de producto
 */
export interface ProductMetadataParams {
    name: string;
    description: string;
    slug: string;
    image?: string;
    price?: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock';
    brand?: string;
    sku?: string;
}

/**
 * Genera metadata para página de producto
 * Acepta tanto un objeto Product completo como parámetros simplificados
 */
export function generateProductMetadata(input: Product | ProductMetadataParams): Metadata {
    // Detectar si es un Product completo o parámetros simplificados
    const isFullProduct = 'variants' in input && Array.isArray(input.variants);

    let name: string;
    let productDescription: string;
    let slug: string;
    let imageUrl: string;
    let price: string | null;
    let inStock: boolean;

    if (isFullProduct) {
        const product = input as Product;
        const variant = product.variants[0];
        name = product.name;
        productDescription = product.description;
        slug = product.slug;
        imageUrl = product.featuredAsset?.preview || `${SITE_URL}/og-image.jpg`;
        price = variant?.priceWithTax ? (variant.priceWithTax / 100).toFixed(2) : null;
        inStock = variant?.stockLevel === 'IN_STOCK';
    } else {
        const params = input as ProductMetadataParams;
        name = params.name;
        productDescription = params.description;
        slug = params.slug;
        imageUrl = params.image || `${SITE_URL}/og-image.jpg`;
        price = params.price || null;
        inStock = params.availability === 'InStock';
    }

    // Título optimizado (max 60 chars)
    const title = truncate(`${name} | ${SITE_NAME}`, 60);

    // Descripción optimizada (max 160 chars)
    const description = productDescription
        ? truncate(productDescription.replace(/<[^>]*>/g, ''), 160)
        : truncate(`${name} - ${DEFAULT_DESCRIPTION}`, 160);

    const productUrl = `${SITE_URL}/productos/${slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            title,
            description,
            url: productUrl,
            siteName: SITE_NAME,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
            type: 'website',
            locale: 'es_ES',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
            creator: '@uniclima',
        },
        other: {
            'product:price:amount': price || '',
            'product:price:currency': 'EUR',
            'product:availability': inStock ? 'in stock' : 'out of stock',
        },
    };
}

/**
 * Genera metadata para página de categoría
 */
export function generateCategoryMetadata(categoryName: string, categorySlug: string): Metadata {
    const title = truncate(`${categoryName} | ${SITE_NAME}`, 60);
    const description = truncate(`Descubre nuestra selección de ${categoryName.toLowerCase()}. ${DEFAULT_DESCRIPTION}`, 160);
    const categoryUrl = `${SITE_URL}/categoria/${categorySlug}`;

    return {
        title,
        description,
        alternates: {
            canonical: categoryUrl,
        },
        openGraph: {
            title,
            description,
            url: categoryUrl,
            siteName: SITE_NAME,
            type: 'website',
            locale: 'es_ES',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    };
}

/**
 * Genera metadata para página de búsqueda
 */
export function generateSearchMetadata(query?: string): Metadata {
    const title = query
        ? truncate(`Resultados para "${query}" | ${SITE_NAME}`, 60)
        : `Búsqueda | ${SITE_NAME}`;

    const description = query
        ? truncate(`Resultados de búsqueda para "${query}" en ${SITE_NAME}`, 160)
        : DEFAULT_DESCRIPTION;

    return {
        title,
        description,
        robots: {
            index: false, // No indexar páginas de búsqueda
            follow: true,
        },
    };
}

/**
 * Genera metadata por defecto para el sitio
 */
export function generateDefaultMetadata(): Metadata {
    return {
        title: {
            default: SITE_NAME,
            template: `%s | ${SITE_NAME}`,
        },
        description: DEFAULT_DESCRIPTION,
        keywords: [
            'climatización',
            'aire acondicionado',
            'HVAC',
            'sistemas de climatización',
            'repuestos HVAC',
            'instalación aire acondicionado',
            'mantenimiento climatización',
        ],
        authors: [{ name: SITE_NAME }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        alternates: {
            canonical: SITE_URL,
        },
        openGraph: {
            type: 'website',
            locale: 'es_ES',
            url: SITE_URL,
            siteName: SITE_NAME,
            title: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
        },
        twitter: {
            card: 'summary_large_image',
            title: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            creator: '@uniclima',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            // Agregar cuando estén disponibles
            // google: 'google-site-verification-code',
            // yandex: 'yandex-verification-code',
        },
    };
}