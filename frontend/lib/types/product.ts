/**
 * Product Types - Uniclima
 * Tipos TypeScript para productos de Vendure con customFields
 */

/**
 * Modo de venta del producto
 * - compra_directa: El producto se puede añadir al carrito directamente
 * - solicitar_presupuesto: El producto requiere solicitar un presupuesto
 */
export type ModoVenta = 'compra_directa' | 'solicitar_presupuesto';

/**
 * Custom Fields del producto HVAC configurados en Vendure
 */
export interface ProductCustomFields {
    modoVenta?: ModoVenta;
    // Campos técnicos HVAC
    potenciaKw?: number;
    frigorias?: number;
    claseEnergetica?: string;
    refrigerante?: string;
    wifi?: boolean;
    garantiaAnos?: number;
    // Eficiencia energética
    seer?: number;
    scop?: number;
    // Nivel sonoro
    nivelSonoroInterior?: number;
    nivelSonoroExterior?: number;
    // Dimensiones
    superficieRecomendada?: string;
    dimensionesInterior?: string;
    dimensionesExterior?: string;
    pesoUnidadInterior?: number;
    pesoUnidadExterior?: number;
    // Instalación
    alimentacion?: string;
    cargaRefrigerante?: number;
    longitudMaximaTuberia?: number;
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
    source: string;
}

/**
 * Producto completo de Vendure
 */
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset?: ProductAsset;
    assets: ProductAsset[];
    variants: ProductVariant[];
    customFields: ProductCustomFields;
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
