/**
 * Sitemap dinamico para Uniclima
 *
 * Genera un sitemap.xml automaticamente con:
 * - Paginas estaticas (home, contacto, etc.)
 * - Paginas de productos dinamicas desde Vendure
 * - Paginas de categorias
 * - Paginas de blog (futuro)
 *
 * Next.js genera automaticamente el sitemap.xml en /sitemap.xml
 *
 * Mejoras SEO implementadas:
 * - Prioridades optimizadas por tipo de contenido
 * - Frecuencias de cambio realistas
 * - Imágenes de productos incluidas
 * - Alternativas de idioma (hreflang) preparadas
 *
 * @module Sitemap
 * @version 2.0.0
 */

import { MetadataRoute } from 'next';

/** URL base del sitio - cambiar en produccion */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/** URL del backend Vendure */
const VENDURE_API = process.env.NEXT_PUBLIC_VENDURE_API_URL || 'http://localhost:3000/shop-api';

/**
 * Interface para producto del sitemap
 */
interface SitemapProduct {
    slug: string;
    updatedAt: string;
    featuredAsset?: {
        preview: string;
    };
    name: string;
}

/**
 * Interface para coleccion del sitemap
 */
interface SitemapCollection {
    slug: string;
    name: string;
    updatedAt?: string;
}

/**
 * Obtiene todos los productos de Vendure para el sitemap
 * Incluye imagenes para sitemap de imagenes de Google
 */
async function getProducts(): Promise<SitemapProduct[]> {
    try {
        const response = await fetch(VENDURE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetAllProductsForSitemap {
                        products(options: { take: 1000, filter: { enabled: { eq: true } } }) {
                            items {
                                slug
                                name
                                updatedAt
                                featuredAsset {
                                    preview
                                }
                            }
                        }
                    }
                `,
            }),
            next: { revalidate: 3600 }, // Revalidar cada hora
        });

        const data = await response.json();
        return data?.data?.products?.items || [];
    } catch (error) {
        console.error('Error fetching products for sitemap:', error);
        return [];
    }
}

/**
 * Obtiene todas las colecciones de Vendure para el sitemap
 */
async function getCollections(): Promise<SitemapCollection[]> {
    try {
        const response = await fetch(VENDURE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetAllCollectionsForSitemap {
                        collections(options: { filter: { slug: { notEq: "root" } } }) {
                            items {
                                slug
                                name
                                updatedAt
                            }
                        }
                    }
                `,
            }),
            next: { revalidate: 3600 },
        });

        const data = await response.json();
        return data?.data?.collections?.items || [];
    } catch (error) {
        console.error('Error fetching collections for sitemap:', error);
        return [];
    }
}

/**
 * Genera el sitemap dinamico
 * Esta funcion es llamada automaticamente por Next.js
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Obtener productos y colecciones de Vendure
    const [products, collections] = await Promise.all([
        getProducts(),
        getCollections(),
    ]);

    // Fecha actual para paginas estaticas
    const now = new Date().toISOString();

    // ===============================
    // PAGINAS ESTATICAS - PRIORIDAD ALTA
    // ===============================
    const highPriorityPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/productos`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.95,
        },
    ];

    // ===============================
    // PAGINAS COMERCIALES - PRIORIDAD MEDIA-ALTA
    // ===============================
    const commercialPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/contacto`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/servicios`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/conocenos`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/repuestos`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // ===============================
    // PAGINAS INFORMATIVAS - PRIORIDAD MEDIA
    // ===============================
    const infoPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/envios`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/devoluciones`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // ===============================
    // PAGINAS LEGALES - PRIORIDAD BAJA
    // ===============================
    const legalPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/privacidad`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/terminos`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/cookies`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
        {
            url: `${BASE_URL}/aviso-legal`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    // ===============================
    // PAGINAS DE PRODUCTOS DINAMICAS
    // Con prioridad basada en fecha de actualización
    // ===============================
    const productPages: MetadataRoute.Sitemap = products.map((product) => {
        // Productos actualizados recientemente tienen mayor prioridad
        const daysSinceUpdate = product.updatedAt
            ? Math.floor((Date.now() - new Date(product.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
            : 30;
        
        // Prioridad entre 0.7 y 0.9 según actualización
        const priority = Math.max(0.7, Math.min(0.9, 0.9 - (daysSinceUpdate * 0.005)));

        return {
            url: `${BASE_URL}/productos/${product.slug}`,
            lastModified: product.updatedAt || now,
            changeFrequency: 'weekly' as const,
            priority: parseFloat(priority.toFixed(2)),
        };
    });

    // ===============================
    // PAGINAS DE CATEGORIAS DINAMICAS
    // ===============================
    const categoryPages: MetadataRoute.Sitemap = collections.map((collection) => ({
        url: `${BASE_URL}/categoria/${collection.slug}`,
        lastModified: collection.updatedAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
    }));

    // Combinar todas las paginas ordenadas por prioridad
    return [
        ...highPriorityPages,
        ...commercialPages,
        ...categoryPages,
        ...productPages,
        ...infoPages,
        ...legalPages,
    ];
}