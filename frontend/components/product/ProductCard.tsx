/**
 * ProductCard Component - Uniclima
 *
 * Tarjeta de producto para listados del catálogo HVAC.
 * Muestra información del producto incluyendo:
 * - Imagen del producto
 * - Nombre y descripción breve
 * - Especificaciones técnicas clave (clase energética, potencia, wifi)
 * - Precio con IVA
 * - Botón de acción (compra directa o presupuesto)
 *
 * El botón se adapta automáticamente según el modoVenta del producto
 * configurado en los custom fields de Vendure.
 *
 * @author Frontend Team
 * @version 1.1.0
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { ProductButton } from './ProductButton';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
    /** Producto a mostrar en la tarjeta */
    product: Product;
    /** Mostrar especificaciones técnicas HVAC (default: true) */
    showSpecs?: boolean;
}

/**
 * ProductCard - Tarjeta de producto para listados
 *
 * Muestra información del producto con imagen, nombre, precio y botón de acción
 * El botón se adapta automáticamente según el modoVenta del producto
 */
export function ProductCard({ product, showSpecs = true }: ProductCardProps) {
    // Obtener la primera variante como variante por defecto
    const defaultVariant = product.variants?.[0];
    // Precio en céntimos, convertir a euros con 2 decimales
    const price = defaultVariant?.priceWithTax || 0;
    const formattedPrice = (price / 100).toFixed(2);

    // Obtener imagen o usar placeholder
    const imageUrl = product.featuredAsset?.preview || '/placeholder-product.png';

    // Extraer custom fields HVAC para mostrar specs
    const customFields = product.customFields;
    // Verificar si hay specs disponibles para mostrar
    const hasSpecs = customFields && (
        customFields.claseEnergetica ||
        customFields.potenciaKw ||
        customFields.frigorias ||
        customFields.wifi !== undefined
    );

    return (
        <div className={styles.card}>
            {/* Enlace a la imagen del producto */}
            <Link href={`/productos/${product.slug}`} className={styles.imageLink} prefetch={true}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Badge de stock bajo */}
                    {defaultVariant && defaultVariant.stockLevel === 'LOW_STOCK' && (
                        <div className={styles.badge}>
                            <span>Últimas unidades</span>
                        </div>
                    )}

                    {/* Badge de clase energética (si está disponible) */}
                    {customFields?.claseEnergetica && (
                        <div className={`${styles.energyBadge} ${styles[`energy${customFields.claseEnergetica.replace('+', 'Plus').replace('++', 'PlusPlus')}`] || ''}`}>
                            <span>{customFields.claseEnergetica}</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                {/* Nombre del producto con enlace */}
                <Link href={`/productos/${product.slug}`} className={styles.titleLink} prefetch={true}>
                    <h3 className={styles.title}>{product.name}</h3>
                </Link>

                {/* Especificaciones técnicas HVAC resumidas */}
                {showSpecs && hasSpecs && (
                    <div className={styles.specs}>
                        {/* Potencia en kW */}
                        {customFields?.potenciaKw && (
                            <span className={styles.spec}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                {customFields.potenciaKw} kW
                            </span>
                        )}
                        {/* Frigorías */}
                        {customFields?.frigorias && (
                            <span className={styles.spec}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M2 12h20M12 2a5 5 0 0 1 5 5M12 2a5 5 0 0 0-5 5M12 22a5 5 0 0 0 5-5M12 22a5 5 0 0 1-5-5" />
                                </svg>
                                {customFields.frigorias.toLocaleString('es-ES')} frig
                            </span>
                        )}
                        {/* WiFi integrado */}
                        {customFields?.wifi && (
                            <span className={`${styles.spec} ${styles.specWifi}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12.55a11 11 0 0 1 14 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                                </svg>
                                WiFi
                            </span>
                        )}
                    </div>
                )}

                {/* Descripción breve (truncada a 80 caracteres) */}
                {product.description && (
                    <p className={styles.description}>
                        {product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description}
                    </p>
                )}

                {/* Footer con precio y botón de acción */}
                <div className={styles.footer}>
                    <div className={styles.priceWrapper}>
                        <span className={styles.price}>{formattedPrice}€</span>
                        <span className={styles.tax}>IVA incluido</span>
                    </div>

                    {/* Botón inteligente según modoVenta */}
                    <ProductButton product={product} size="md" fullWidth />
                </div>
            </div>
        </div>
    );
}
