'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { ProductButton } from './ProductButton';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
    product: Product;
}

/**
 * ProductCard - Tarjeta de producto para listados
 * 
 * Muestra información del producto con imagen, nombre, precio y botón de acción
 * El botón se adapta automáticamente según el modoVenta del producto
 */
export function ProductCard({ product }: ProductCardProps) {
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.priceWithTax || 0;
    const formattedPrice = (price / 100).toFixed(2);

    // Obtener imagen o usar placeholder
    const imageUrl = product.featuredAsset?.preview || '/placeholder-product.png';

    return (
        <div className={styles.card}>
            <Link href={`/productos/${product.slug}`} className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Badge de stock bajo (opcional) */}
                    {defaultVariant && defaultVariant.stockLevel === 'LOW_STOCK' && (
                        <div className={styles.badge}>
                            <span>Últimas unidades</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                <Link href={`/productos/${product.slug}`} className={styles.titleLink}>
                    <h3 className={styles.title}>{product.name}</h3>
                </Link>

                {product.description && (
                    <p className={styles.description}>
                        {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                    </p>
                )}

                <div className={styles.footer}>
                    <div className={styles.priceWrapper}>
                        <span className={styles.price}>{formattedPrice}€</span>
                        <span className={styles.tax}>IVA incluido</span>
                    </div>

                    <ProductButton product={product} size="md" fullWidth />
                </div>
            </div>
        </div>
    );
}
