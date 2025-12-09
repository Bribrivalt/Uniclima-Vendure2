/**
 * Sitemap dinamico para Uniclima
 * 
 * Genera un sitemap.xml automaticamente con:
 * - Paginas estaticas (home, contacto, etc.)
 * - Paginas de productos dinamicas desde Vendure
 * - Paginas de categorias
 * 
 * Next.js genera automaticamente el sitemap.xml en /sitemap.xml
 * 
 * @module Sitemap
 * @version 1.0.0
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
}

/**
 * Interface para coleccion del sitemap
 */
interface SitemapCollection {
    slug: string;
}

/**
 * Obtiene todos los productos de Vendure para el sitemap
 * Usa fetch directamente para evitar dependencias de Apollo en build time
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
                        products(options: { take: 1000 }) {
                            items {
                                slug
                                updatedAt
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
                        collections {
                            items {
                                slug
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
    // PAGINAS ESTATICAS
    // ===============================
    const staticPages: MetadataRoute.Sitemap = [
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
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/contacto`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/conocenos`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/servicios`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/envios`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
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
    ];

    // ===============================
    // PAGINAS DE PRODUCTOS DINAMICAS
    // ===============================
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${BASE_URL}/productos/${product.slug}`,
        lastModified: product.updatedAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // ===============================
    // PAGINAS DE CATEGORIAS DINAMICAS
    // ===============================
    const categoryPages: MetadataRoute.Sitemap = collections.map((collection) => ({
        url: `${BASE_URL}/categoria/${collection.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Combinar todas las paginas
    return [...staticPages, ...productPages, ...categoryPages];
}