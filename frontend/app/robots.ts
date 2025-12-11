/**
 * robots.ts
 *
 * Configuración de robots.txt para SEO.
 * Next.js genera automáticamente robots.txt desde este archivo.
 *
 * @module Robots
 * @version 2.0.0
 */

import { MetadataRoute } from 'next';

/**
 * URL base del sitio
 */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Determina si estamos en producción
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Genera el archivo robots.txt
 *
 * Define las reglas de rastreo para los motores de búsqueda.
 * En desarrollo, bloquea todos los crawlers.
 * En producción, permite el rastreo con restricciones específicas.
 */
export default function robots(): MetadataRoute.Robots {
    // En desarrollo, no permitir indexación
    if (!isProduction) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            },
        };
    }

    return {
        rules: [
            // Reglas generales para todos los bots
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/cuenta/',         // Área privada de usuario
                    '/checkout/',       // Proceso de checkout
                    '/carrito/',        // Carrito de compra
                    '/api/',            // Endpoints de API
                    '/pedido/',         // Detalles de pedido
                    '/pedidos/',        // Historial de pedidos
                    '/_next/',          // Recursos de Next.js
                    '/admin/',          // Panel de administración
                    '/login/',          // Página de login
                    '/registro/',       // Página de registro
                    '/*?*sort=',        // URLs con parámetros de ordenación
                    '/*?*page=',        // URLs con paginación
                    '/*?*filter=',      // URLs con filtros
                    '/buscar',          // Página de búsqueda (evita contenido duplicado)
                ],
            },
            // Reglas específicas para Googlebot
            {
                userAgent: 'Googlebot',
                allow: [
                    '/',
                    '/productos/',
                    '/categoria/',
                    '/contacto',
                    '/conocenos',
                    '/servicios',
                    '/faq',
                ],
                disallow: [
                    '/cuenta/',
                    '/checkout/',
                    '/carrito/',
                    '/api/',
                    '/pedido/',
                    '/pedidos/',
                    '/login/',
                    '/registro/',
                ],
            },
            // Reglas para Googlebot-Image (permitir imágenes de productos)
            {
                userAgent: 'Googlebot-Image',
                allow: [
                    '/productos/',
                    '/*.jpg$',
                    '/*.jpeg$',
                    '/*.png$',
                    '/*.webp$',
                ],
            },
            // Bloquear bots de scraping conocidos
            {
                userAgent: 'AhrefsBot',
                disallow: '/',
            },
            {
                userAgent: 'SemrushBot',
                disallow: '/',
            },
            {
                userAgent: 'MJ12bot',
                disallow: '/',
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}