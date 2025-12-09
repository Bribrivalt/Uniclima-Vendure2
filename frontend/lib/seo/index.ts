/**
 * Modulo SEO - Exportaciones
 * 
 * Re-exporta todas las utilidades de SEO desde un unico punto
 * 
 * @module SEO
 */

export {
    // Funciones de metadata
    generatePageMetadata,
    generateProductMetadata,

    // Funciones de JSON-LD
    generateProductJsonLd,
    generateOrganizationJsonLd,
    generateBreadcrumbJsonLd,
    generateFAQJsonLd,

    // Metadata por defecto
    defaultMetadata,

    // Types
    type ProductSEOData,
    type PageSEOData,
} from './metadata';