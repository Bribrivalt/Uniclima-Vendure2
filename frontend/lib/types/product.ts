/**
 * Product Types - Uniclima
 *
 * Tipos TypeScript para productos de Vendure con customFields HVAC.
 * Estos tipos deben coincidir exactamente con los campos definidos
 * en backend/src/vendure-config.ts
 *
 * @author Frontend Team
 * @version 1.1.0
 */

/**
 * Modo de venta del producto
 * - compra_directa: El producto se puede añadir al carrito directamente
 * - solicitar_presupuesto: El producto requiere solicitar un presupuesto
 */
export type ModoVenta = 'compra_directa' | 'solicitar_presupuesto';

/**
 * Custom Fields del producto HVAC configurados en Vendure
 *
 * Estos campos coinciden con los definidos en vendure-config.ts:
 * - potenciaKw: Potencia nominal en kilowatios
 * - frigorias: Capacidad frigorífica en frigorías/hora
 * - claseEnergetica: Clasificación de eficiencia energética (A+++ a G)
 * - refrigerante: Tipo de gas refrigerante (R32, R410A, R290)
 * - wifi: Si el equipo tiene WiFi integrado
 * - garantiaAnos: Años de garantía del fabricante
 * - seer: Eficiencia energética estacional en refrigeración
 * - scop: Eficiencia energética estacional en calefacción
 * - nivelSonoroInterior: Nivel de ruido unidad interior en dB(A)
 * - nivelSonoroExterior: Nivel de ruido unidad exterior en dB(A)
 * - superficieRecomendada: Metros cuadrados recomendados
 * - dimensionesInterior: Dimensiones unidad interior (Alto x Ancho x Profundo mm)
 * - dimensionesExterior: Dimensiones unidad exterior (Alto x Ancho x Profundo mm)
 * - pesoUnidadInterior: Peso unidad interior en kg
 * - pesoUnidadExterior: Peso unidad exterior en kg
 * - alimentacion: Tipo de alimentación eléctrica (Monofásico/Trifásico)
 * - cargaRefrigerante: Cantidad de gas refrigerante precargado en kg
 * - longitudMaximaTuberia: Longitud máxima de tubería frigorífica en metros
 * - desnivelMaximo: Desnivel máximo permitido entre unidades en metros
 */
export interface ProductCustomFields {
    /** Modo de venta: compra directa o solicitar presupuesto */
    modoVenta?: ModoVenta;
    /** Compatibilidades del producto con otros equipos/marcas */
    compatibilidades?: string;

    // ═══════════════════════════════════════════════════════════════════════
    // CAMPOS TÉCNICOS BÁSICOS
    // ═══════════════════════════════════════════════════════════════════════

    /** Potencia nominal del equipo en kilowatios (kW) */
    potenciaKw?: number;
    /** Capacidad frigorífica en frigorías por hora */
    frigorias?: number;
    /** Clasificación de eficiencia energética (A+++ a G) */
    claseEnergetica?: string;
    /** Tipo de gas refrigerante (R32, R410A, R290) */
    refrigerante?: string;
    /** Indica si el equipo tiene WiFi integrado para control remoto */
    wifi?: boolean;
    /** Años de garantía del fabricante (0-10) */
    garantiaAnos?: number;

    // ═══════════════════════════════════════════════════════════════════════
    // EFICIENCIA ENERGÉTICA
    // ═══════════════════════════════════════════════════════════════════════

    /** SEER: Eficiencia energética estacional en refrigeración */
    seer?: number;
    /** SCOP: Eficiencia energética estacional en calefacción */
    scop?: number;

    // ═══════════════════════════════════════════════════════════════════════
    // NIVEL SONORO
    // ═══════════════════════════════════════════════════════════════════════

    /** Nivel de ruido de la unidad interior en decibelios dB(A) */
    nivelSonoroInterior?: number;
    /** Nivel de ruido de la unidad exterior en decibelios dB(A) */
    nivelSonoroExterior?: number;

    // ═══════════════════════════════════════════════════════════════════════
    // DIMENSIONES Y PESO
    // ═══════════════════════════════════════════════════════════════════════

    /** Metros cuadrados recomendados para climatizar */
    superficieRecomendada?: string;
    /** Dimensiones unidad interior: Alto x Ancho x Profundo en mm */
    dimensionesInterior?: string;
    /** Dimensiones unidad exterior: Alto x Ancho x Profundo en mm */
    dimensionesExterior?: string;
    /** Peso de la unidad interior en kilogramos */
    pesoUnidadInterior?: number;
    /** Peso de la unidad exterior en kilogramos */
    pesoUnidadExterior?: number;

    // ═══════════════════════════════════════════════════════════════════════
    // INSTALACIÓN
    // ═══════════════════════════════════════════════════════════════════════

    /** Tipo de alimentación eléctrica (Monofásico/Trifásico) */
    alimentacion?: string;
    /** Cantidad de gas refrigerante precargado en kg */
    cargaRefrigerante?: number;
    /** Longitud máxima de tubería frigorífica en metros */
    longitudMaximaTuberia?: number;
    /** Desnivel máximo permitido entre unidad interior y exterior en metros */
    desnivelMaximo?: number;
}

/**
 * Custom Fields de variante de producto (vacío por ahora)
 */
export interface VariantCustomFields {
    // Los campos HVAC están en Product, no en ProductVariant
}

/**
 * Variante de producto (SKU)
 */
export interface ProductVariant {
    id: string;
    name: string;
    sku: string;
    price: number;
    priceWithTax: number;
    currencyCode?: string;
    stockLevel: string;
    customFields?: VariantCustomFields;
}

/**
 * Asset (imagen) del producto
 */
export interface ProductAsset {
    id: string;
    preview: string;
    source?: string;  // Opcional porque en búsquedas no siempre viene
}

/**
 * Facet Value del producto
 */
export interface FacetValue {
    id: string;
    code: string;
    name: string;
    facet: {
        id: string;
        code: string;
        name: string;
    };
}

/**
 * Producto completo de Vendure
 */
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt?: string;
    featuredAsset?: ProductAsset;
    assets?: ProductAsset[];
    variants: ProductVariant[];
    customFields?: ProductCustomFields;
    facetValues?: FacetValue[];
}

/**
 * Producto simplificado para listados
 */
export interface ProductListItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset?: ProductAsset;
    priceRange: {
        min: number;
        max: number;
    };
    customFields: ProductCustomFields;
}
