import { Metadata } from 'next';

/**
 * Configuración SEO base del sitio
 */
export const siteConfig = {
    name: 'Uniclima',
    description: 'Repuestos y accesorios de climatización para profesionales',
    url: 'https://uniclima.es',
    ogImage: '/og-image.jpg',
    locale: 'es_ES',
    keywords: [
        'climatización',
        'repuestos',
        'aire acondicionado',
        'HVAC',
        'profesionales',
        'calefacción',
        'ventilación',
    ],
};

/**
 * Genera metadata base para Next.js 
 */
export function generateSiteMetadata(): Metadata {
    return {
        metadataBase: new URL(siteConfig.url),
        title: {
            default: siteConfig.name,
            template: `%s | ${siteConfig.name}`,
        },
        description: siteConfig.description,
        keywords: siteConfig.keywords,
        authors: [{ name: 'Uniclima' }],
        creator: 'Uniclima',
        openGraph: {
            type: 'website',
            locale: siteConfig.locale,
            url: siteConfig.url,
            title: siteConfig.name,
            description: siteConfig.description,
            siteName: siteConfig.name,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteConfig.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: siteConfig.name,
            description: siteConfig.description,
            images: [siteConfig.ogImage],
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
            // google: 'tu-codigo-de-verificacion',
        },
    };
}

/**
 * Genera metadata para una página específica
 */
export function generatePageMetadata(options: {
    title: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
}): Metadata {
    const { title, description, image, noIndex } = options;

    return {
        title,
        description: description || siteConfig.description,
        openGraph: {
            title,
            description: description || siteConfig.description,
            images: image ? [{ url: image }] : undefined,
        },
        twitter: {
            title,
            description: description || siteConfig.description,
            images: image ? [image] : undefined,
        },
        robots: noIndex
            ? {
                index: false,
                follow: false,
            }
            : undefined,
    };
}

/**
 * Genera metadata para un producto
 */
export function generateProductMetadata(product: {
    name: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    currency?: string;
}): Metadata {
    const { name, description, imageUrl, price, currency = 'EUR' } = product;

    return {
        title: name,
        description: description || `Compra ${name} en ${siteConfig.name}`,
        openGraph: {
            title: name,
            description: description || `Compra ${name} en ${siteConfig.name}`,
            type: 'website',
            images: imageUrl ? [{ url: imageUrl }] : undefined,
        },
        other: price
            ? {
                'product:price:amount': String(price / 100),
                'product:price:currency': currency,
            }
            : undefined,
    };
}

/**
 * JSON-LD para organización
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+34-900-000-000',
            contactType: 'customer service',
            availableLanguage: 'Spanish',
        },
        sameAs: [
            // 'https://www.facebook.com/uniclima',
            // 'https://www.linkedin.com/company/uniclima',
        ],
    };
}

/**
 * JSON-LD para producto
 */
export function generateProductSchema(product: {
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    currency?: string;
    sku?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}) {
    const {
        name,
        description,
        imageUrl,
        price,
        currency = 'EUR',
        sku,
        availability = 'InStock',
    } = product;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image: imageUrl,
        sku,
        offers: {
            '@type': 'Offer',
            price: (price / 100).toFixed(2),
            priceCurrency: currency,
            availability: `https://schema.org/${availability}`,
            seller: {
                '@type': 'Organization',
                name: siteConfig.name,
            },
        },
    };
}

/**
 * JSON-LD para breadcrumbs
 */
export function generateBreadcrumbSchema(
    items: Array<{ name: string; url: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.url}`,
        })),
    };
}