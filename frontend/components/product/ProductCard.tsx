/**
 * ProductCard Component - Uniclima
 *
 * Tarjeta de producto profesional para listados del catálogo HVAC.
 * Incluye badges de estado, diseño responsive y botón prominente.
 *
 * @author Frontend Team
 * @version 2.0.0
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
    /** Condición del producto: nuevo, reacondicionado, outlet */
    condition?: 'new' | 'refurbished' | 'outlet';
}

/**
 * ProductCard - Tarjeta de producto profesional
 */
export function ProductCard({ product, showSpecs = true, condition }: ProductCardProps) {
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.priceWithTax || 0;
    const formattedPrice = (price / 100).toFixed(2);
    const imageUrl = product.featuredAsset?.preview || '/placeholder-product.png';
    const customFields = product.customFields;

    // Determinar si es nuevo (creado en los últimos 30 días)
    const isNew = !condition && product.createdAt && 
        (new Date().getTime() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000;

    // Determinar condición del producto
    const productCondition = condition || (isNew ? 'new' : undefined);

    // Verificar stock bajo
    const isLowStock = defaultVariant?.stockLevel === 'LOW_STOCK';

    return (
        <article className={styles.card} itemScope itemType="https://schema.org/Product">
            <Link href={`/productos/${product.slug}`} className={styles.imageLink} prefetch={false}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={imageUrl}
                        alt={`${product.name} - Producto de climatización HVAC`}
                        fill
                        className={styles.image}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSITFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AqbZ3he6lt7e9tHt5YwVKq4ZW+EEUpSlIbG3dgAHyRXZ//9k="
                        quality={75}
                    />

                    {/* Badge de condición (Nuevo/Reacondicionado) */}
                    {productCondition && (
                        <div className={`${styles.conditionBadge} ${styles[`condition${productCondition.charAt(0).toUpperCase() + productCondition.slice(1)}`]}`}>
                            {productCondition === 'new' && 'Nuevo'}
                            {productCondition === 'refurbished' && 'Reacondicionado'}
                            {productCondition === 'outlet' && 'Outlet'}
                        </div>
                    )}

                    {/* Badge de stock bajo */}
                    {isLowStock && (
                        <div className={styles.stockBadge}>
                            Últimas unidades
                        </div>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                {/* Nombre del producto */}
                <Link href={`/productos/${product.slug}`} className={styles.titleLink} prefetch={false}>
                    <h3 className={styles.title} itemProp="name">{product.name}</h3>
                </Link>

                {/* Información de compatibilidades */}
                {customFields?.compatibilidades && (
                    <p className={styles.compatibility}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {customFields.compatibilidades.substring(0, 60)}...
                    </p>
                )}

                {/* Footer con precio y botón */}
                <div className={styles.footer}>
                    <div className={styles.priceWrapper} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <span className={styles.price} itemProp="price" content={formattedPrice}>{formattedPrice}€</span>
                        <meta itemProp="priceCurrency" content="EUR" />
                        <meta itemProp="availability" content={defaultVariant?.stockLevel === 'IN_STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
                        <span className={styles.tax}>IVA incluido</span>
                    </div>

                    {/* Botón prominente de añadir al carrito */}
                    <button className={styles.addToCartButton} aria-label={`Añadir ${product.name} al carrito`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Añadir al carrito
                    </button>
                </div>
            </div>
        </article>
    );
}
