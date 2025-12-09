/**
 * Utilidades de Metadata SEO para Uniclima
 * 
 * Funciones helper para generar meta tags dinamicos en cada pagina.
 * Incluye soporte para:
 * - Open Graph (Facebook, LinkedIn)
 * - Twitter Cards
 * - Structured Data (JSON-LD)
 * - Meta tags basicos
 * 
 * @module SEO/Metadata
 * @version 2.0.0
 */

import { Metadata } from 'next';

/** URL base del sitio */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/** Configuracion por defecto del sitio */
const SITE_CONFIG = {
    name: 'Uniclima',
    description: 'Tienda online de climatizacion y HVAC. Aires acondicionados, calderas y sistemas de ventilacion de las mejores marcas.',
    locale: 'es_ES',
    type: 'website',
    twitterHandle: '@uniclima',
    defaultImage: '/images/og-default.jpg',
};

/**
 * Interface para datos de producto para SEO
 */
export interface ProductSEOData {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    price?: number;
    currency?: string;
    sku?: string;
    brand?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    category?: string;
}

/**
 * Interface para datos de pagina para SEO
 */
export interface PageSEOData {
    title: string;
    description?: string;
    image?: string;
    path?: string;
    noIndex?: boolean;
}

/**
 * Genera metadata base para cualquier pagina
 * 
 * @param data - Datos de la pagina
 * @returns Objeto Metadata de Next.js
 * 
 * @example
 * ```ts
 * export const metadata = generatePageMetadata({
 *   title: 'Contacto',
 *   description: 'Contacta con nosotros',
 *   path: '/contacto'
 * });
 * ```
 */
export function generatePageMetadata(data: PageSEOData): Metadata {
    const title = data.title
        ? `${data.title} | ${SITE_CONFIG.name}`
        : SITE_CONFIG.name;

    const description = data.description || SITE_CONFIG.description;
    const url = data.path ? `${BASE_URL}${data.path}` : BASE_URL;
    const image = data.image || `${BASE_URL}${SITE_CONFIG.defaultImage}`;

    return {
        title,
        description,
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            type: 'website',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: SITE_CONFIG.twitterHandle,
        },
        robots: data.noIndex ? {
            index: false,
            follow: false,
        } : {
            index: true,
            follow: true,
        },
    };
}

/**
 * Genera metadata especifica para paginas de producto
 * 
 * @param product - Datos del producto
 * @returns Objeto Metadata de Next.js
 * 
 * @example
 * ```ts
 * export async function generateMetadata({ params }) {
 *   const product = await getProduct(params.slug);
 *   return generateProductMetadata({
 *     name: product.name,
 *     slug: product.slug,
 *     description: product.description,
 *     image: product.featuredAsset?.preview,
 *     price: product.variants[0]?.priceWithTax,
 *     brand: 'Daikin'
 *   });
 * }
 * ```
 */
export function generateProductMetadata(product: ProductSEOData): Metadata {
    const title = `${product.name} | ${SITE_CONFIG.name}`;
    const description = product.description
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
        : `Compra ${product.name} en Uniclima. Envio rapido y garantia oficial.`;

    const url = `${BASE_URL}/productos/${product.slug}`;
    const image = product.image || `${BASE_URL}${SITE_CONFIG.defaultImage}`;

    return {
        title,
        description,
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            type: 'website',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: SITE_CONFIG.twitterHandle,
        },
    };
}

/**
 * Genera JSON-LD estructurado para un producto
 * Mejora el SEO y permite rich snippets en Google
 * 
 * @param product - Datos del producto
 * @returns Script JSON-LD como string
 * 
 * @example
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{
 *     __html: generateProductJsonLd(product)
 *   }}
 * />
 * ```
 */
export function generateProductJsonLd(product: ProductSEOData): string {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description?.replace(/<[^>]*>/g, ''),
        image: product.image,
        url: `${BASE_URL}/productos/${product.slug}`,
        sku: product.sku,
        brand: product.brand ? {
            '@type': 'Brand',
            name: product.brand,
        } : undefined,
        offers: product.price ? {
            '@type': 'Offer',
            price: (product.price / 100).toFixed(2),
            priceCurrency: product.currency || 'EUR',
            availability: product.availability === 'InStock'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: SITE_CONFIG.name,
            },
        } : undefined,
    };

    return JSON.stringify(jsonLd);
}

/**
 * Genera JSON-LD estructurado para la organizacion
 * Se usa en el layout principal
 * 
 * @returns Script JSON-LD como string
 */
export function generateOrganizationJsonLd(): string {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: BASE_URL,
        logo: `${BASE_URL}/images/logo.png`,
        description: SITE_CONFIG.description,
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'ES',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Spanish'],
        },
        sameAs: [
            'https://www.facebook.com/uniclima',
            'https://www.instagram.com/uniclima',
            'https://twitter.com/uniclima',
        ],
    };

    return JSON.stringify(jsonLd);
}

/**
 * Genera JSON-LD para breadcrumbs
 * 
 * @param items - Array de items del breadcrumb
 * @returns Script JSON-LD como string
 * 
 * @example
 * ```tsx
 * const breadcrumbs = [
 *   { name: 'Inicio', url: '/' },
 *   { name: 'Productos', url: '/productos' },
 *   { name: 'Aire Acondicionado', url: '/productos/aire-split' },
 * ];
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{
 *     __html: generateBreadcrumbJsonLd(breadcrumbs)
 *   }}
 * />
 * ```
 */
export function generateBreadcrumbJsonLd(
    items: Array<{ name: string; url: string }>
): string {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${BASE_URL}${item.url}`,
        })),
    };

    return JSON.stringify(jsonLd);
}

/**
 * Genera JSON-LD para FAQ
 * 
 * @param faqs - Array de preguntas y respuestas
 * @returns Script JSON-LD como string
 */
export function generateFAQJsonLd(
    faqs: Array<{ question: string; answer: string }>
): string {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return JSON.stringify(jsonLd);
}

/**
 * Metadata por defecto para el sitio
 * Se exporta para usar en app/layout.tsx
 */
export const defaultMetadata: Metadata = {
    title: {
        default: SITE_CONFIG.name,
        template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    metadataBase: new URL(BASE_URL),
    keywords: [
        'aire acondicionado',
        'climatizacion',
        'HVAC',
        'calderas',
        'splits',
        'ventilacion',
        'Daikin',
        'Mitsubishi',
        'LG',
        'instalacion climatizacion',
        'tienda climatizacion online',
    ],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: SITE_CONFIG.locale,
        url: BASE_URL,
        siteName: SITE_CONFIG.name,
        title: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        images: [
            {
                url: `${BASE_URL}${SITE_CONFIG.defaultImage}`,
                width: 1200,
                height: 630,
                alt: SITE_CONFIG.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        images: [`${BASE_URL}${SITE_CONFIG.defaultImage}`],
        creator: SITE_CONFIG.twitterHandle,
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
        // Añadir cuando se tengan las verificaciones
        // google: 'google-site-verification-code',
        // yandex: 'yandex-verification-code',
    },
};