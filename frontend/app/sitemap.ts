/**
 * sitemap.ts
 * 
 * Generador de sitemap dinámico para SEO.
 * Next.js genera automáticamente sitemap.xml desde este archivo.
 */

import { MetadataRoute } from 'next';

/**
 * Configuración del sitemap
 */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Genera el sitemap del sitio
 * 
 * Incluye:
 * - Páginas estáticas
 * - Categorías de productos
 * - Productos individuales (a cargar desde Vendure)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Páginas estáticas
    const staticPages = [
        '',
        '/productos',
        '/repuestos',
        '/servicios',
        '/contacto',
        '/conocenos',
        '/faq',
        '/login',
        '/registro',
        '/terminos',
        '/privacidad',
        '/cookies',
    ];

    const staticUrls = staticPages.map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1 : 0.8,
    }));

    // Categorías de productos (estáticas por ahora, se podrían cargar de Vendure)
    const categories = [
        'climatizacion',
        'calefaccion',
        'ventilacion',
        'aire-acondicionado',
        'bombas-calor',
    ];

    const categoryUrls = categories.map((slug) => ({
        url: `${BASE_URL}/categoria/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // TODO: Cargar productos desde Vendure GraphQL
    // const products = await fetchProductsFromVendure();
    // const productUrls = products.map((product) => ({
    //     url: `${BASE_URL}/productos/${product.slug}`,
    //     lastModified: new Date(product.updatedAt),
    //     changeFrequency: 'weekly' as const,
    //     priority: 0.7,
    // }));

    // Productos de ejemplo (reemplazar con datos reales)
    const productUrls: MetadataRoute.Sitemap = [];

    return [
        ...staticUrls,
        ...categoryUrls,
        ...productUrls,
    ];
}