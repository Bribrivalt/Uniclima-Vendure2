/**
 * RecentlyViewed - Componente para mostrar productos vistos recientemente
 * 
 * @description Muestra un carrusel/grid de productos que el usuario ha visto.
 * Los datos se obtienen desde localStorage mediante el hook useRecentlyViewed.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentlyViewed, RecentlyViewedProduct } from '@/lib/hooks/useRecentlyViewed';
import styles from './RecentlyViewed.module.css';

// ========================================
// INTERFACES
// ========================================

interface RecentlyViewedProps {
    /** Título de la sección */
    title?: string;
    /** Subtítulo opcional */
    subtitle?: string;
    /** Número máximo de productos a mostrar */
    maxItems?: number;
    /** Excluir un producto específico (útil en página de detalle) */
    excludeProductId?: string;
    /** Clase CSS adicional */
    className?: string;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export function RecentlyViewed({
    title = 'Vistos recientemente',
    subtitle,
    maxItems = 6,
    excludeProductId,
    className,
}: RecentlyViewedProps) {
    const { recentProducts, isLoading } = useRecentlyViewed();

    // Filtrar el producto actual si se proporciona
    const filteredProducts = excludeProductId
        ? recentProducts.filter(p => p.id !== excludeProductId)
        : recentProducts;

    // Limitar al número máximo
    const productsToShow = filteredProducts.slice(0, maxItems);

    // No mostrar nada si está cargando o no hay productos
    if (isLoading || productsToShow.length === 0) {
        return null;
    }

    /**
     * Formatea precio en céntimos a EUR
     */
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(price / 100);
    };

    /**
     * Formatea el tiempo desde que se vio
     */
    const formatTimeAgo = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return 'Ahora mismo';
    };

    return (
        <section className={`${styles.container} ${className || ''}`}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titles}>
                    <h2 className={styles.title}>{title}</h2>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
            </div>

            {/* Grid de productos */}
            <div className={styles.grid}>
                {productsToShow.map((product) => (
                    <RecentlyViewedCard
                        key={product.id}
                        product={product}
                        formatPrice={formatPrice}
                        formatTimeAgo={formatTimeAgo}
                    />
                ))}
            </div>
        </section>
    );
}

// ========================================
// CARD DE PRODUCTO
// ========================================

interface RecentlyViewedCardProps {
    product: RecentlyViewedProduct;
    formatPrice: (price: number) => string;
    formatTimeAgo: (timestamp: number) => string;
}

function RecentlyViewedCard({ product, formatPrice, formatTimeAgo }: RecentlyViewedCardProps) {
    return (
        <Link href={`/productos/${product.slug}`} className={styles.card}>
            {/* Imagen */}
            <div className={styles.imageContainer}>
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <PlaceholderIcon />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                <span className={styles.viewedAt}>{formatTimeAgo(product.viewedAt)}</span>
            </div>
        </Link>
    );
}

// ========================================
// ICONOS
// ========================================

function PlaceholderIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={styles.placeholderIcon}
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
        </svg>
    );
}

// ========================================
// SKELETON
// ========================================

export function RecentlyViewedSkeleton({ itemCount = 4 }: { itemCount?: number }) {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titles}>
                    <div className={styles.skeletonTitle} />
                </div>
            </div>
            <div className={styles.grid}>
                {Array.from({ length: itemCount }).map((_, index) => (
                    <div key={index} className={styles.skeletonCard}>
                        <div className={styles.skeletonImage} />
                        <div className={styles.skeletonInfo}>
                            <div className={styles.skeletonName} />
                            <div className={styles.skeletonPrice} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RecentlyViewed;