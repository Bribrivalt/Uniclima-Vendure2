/**
 * Schema.org JSON-LD Generators
 * 
 * Funciones para generar structured data (rich snippets) según Schema.org
 * para mejorar el SEO y la apariencia en resultados de búsqueda.
 * 
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { Product } from '@/lib/types/product';

/**
 * Genera el schema de Organization para el sitio
 * Se debe incluir en el layout principal
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Uniclima',
        description: 'Especialistas en climatización y sistemas HVAC',
        url: 'https://uniclima.com',
        logo: 'https://uniclima.com/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+34-XXX-XXX-XXX',
            contactType: 'customer service',
            areaServed: 'ES',
            availableLanguage: ['Spanish'],
        },
        sameAs: [
            // Redes sociales cuando estén disponibles
            // 'https://www.facebook.com/uniclima',
            // 'https://www.instagram.com/uniclima',
        ],
    };
}

/**
 * Genera el schema de Product para una página de producto
 * Incluye precio, disponibilidad, reviews, etc.
 */
export function generateProductSchema(product: Product) {
    const variant = product.variants[0];
    const price = variant?.priceWithTax ? (variant.priceWithTax / 100).toFixed(2) : '0';
    const inStock = variant?.stockLevel === 'IN_STOCK';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        image: product.featuredAsset?.preview || '',
        sku: variant?.sku || product.id,
        brand: {
            '@type': 'Brand',
            name: 'Uniclima',
        },
        offers: {
            '@type': 'Offer',
            url: `https://uniclima.com/productos/${product.slug}`,
            priceCurrency: 'EUR',
            price: price,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
            availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
        // Agregar custom fields HVAC como propiedades adicionales
        ...(product.customFields?.claseEnergetica && {
            additionalProperty: [
                {
                    '@type': 'PropertyValue',
                    name: 'Clase Energética',
                    value: product.customFields.claseEnergetica,
                },
                ...(product.customFields.potenciaKw
                    ? [
                        {
                            '@type': 'PropertyValue',
                            name: 'Potencia',
                            value: `${product.customFields.potenciaKw} kW`,
                        },
                    ]
                    : []),
                ...(product.customFields.frigorias
                    ? [
                        {
                            '@type': 'PropertyValue',
                            name: 'Frigorías',
                            value: `${product.customFields.frigorias} frig/h`,
                        },
                    ]
                    : []),
            ],
        }),
    };
}

/**
 * Genera el schema de BreadcrumbList para navegación
 * Mejora la visualización de breadcrumbs en resultados de búsqueda
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Genera el schema de WebSite para búsqueda en el sitio
 * Permite que Google muestre un cuadro de búsqueda en los resultados
 */
export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Uniclima',
        url: 'https://uniclima.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://uniclima.com/buscar?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Genera el schema de ItemList para listados de productos
 * Útil para páginas de categorías o resultados de búsqueda
 */
export function generateItemListSchema(products: Product[], listName: string = 'Productos') {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: listName,
        itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://uniclima.com/productos/${product.slug}`,
            name: product.name,
        })),
    };
}

/**
 * Helper para obtener el script tag de JSON-LD como string
 * Uso en componentes: 
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getJsonLdScript(schema) }} />
 */
export function getJsonLdScript(data: object): string {
    return JSON.stringify(data);
}
