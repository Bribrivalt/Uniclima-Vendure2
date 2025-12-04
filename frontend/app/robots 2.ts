/**
 * robots.ts
 * 
 * Configuración de robots.txt para SEO.
 * Next.js genera automáticamente robots.txt desde este archivo.
 */

import { MetadataRoute } from 'next';

/**
 * Configuración del sitemap
 */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Genera el archivo robots.txt
 * 
 * Define las reglas de rastreo para los motores de búsqueda.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/cuenta/',      // Área privada de usuario
                    '/checkout/',    // Proceso de checkout
                    '/carrito/',     // Carrito de compra
                    '/api/',         // Endpoints de API
                    '/pedido/',      // Detalles de pedido
                    '/_next/',       // Recursos de Next.js
                    '/admin/',       // Panel de administración
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/cuenta/',
                    '/checkout/',
                    '/carrito/',
                    '/api/',
                    '/pedido/',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}