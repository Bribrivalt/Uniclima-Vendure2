'use client';

import React, { useRef, useState, useCallback } from 'react';
import styles from './RelatedProducts.module.css';
import { Product } from '@/lib/types/product';
import { ProductCard } from './ProductCard';

/**
 * Props para el componente RelatedProducts
 * @interface RelatedProductsProps
 */
export interface RelatedProductsProps {
    /** Lista de productos relacionados */
    products: Product[];
    /** Título de la sección */
    title?: string;
    /** Subtítulo o descripción */
    subtitle?: string;
    /** Número máximo de productos a mostrar */
    maxItems?: number;
    /** Mostrar controles de navegación del carousel */
    showNavigation?: boolean;
    /** Mostrar indicadores de paginación */
    showDots?: boolean;
    /** Auto-scroll del carousel */
    autoScroll?: boolean;
    /** Intervalo de auto-scroll en ms */
    autoScrollInterval?: number;
    /** Variante de visualización */
    variant?: 'carousel' | 'grid';
    /** Columnas en modo grid */
    gridColumns?: 2 | 3 | 4 | 5;
    /** Callback al hacer clic en un producto */
    onProductClick?: (product: Product) => void;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de flecha izquierda
 */
const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

/**
 * Icono de flecha derecha
 */
const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 6 15 12 9 18" />
    </svg>
);

/**
 * RelatedProducts - Sección de productos relacionados
 * 
 * Muestra productos relacionados, complementarios o recomendados
 * en formato carousel o grid. Incluye navegación opcional y
 * scroll táctil en móvil.
 * 
 * @example
 * ```tsx
 * // Carousel de productos relacionados
 * <RelatedProducts
 *   title="También te puede interesar"
 *   products={relatedProducts}
 *   showNavigation
 *   showDots
 * />
 * 
 * // Grid de productos relacionados
 * <RelatedProducts
 *   title="Productos complementarios"
 *   products={accessories}
 *   variant="grid"
 *   gridColumns={4}
 * />
 * ```
 */
export function RelatedProducts({
    products,
    title = 'Productos relacionados',
    subtitle,
    maxItems = 12,
    showNavigation = true,
    showDots = false,
    autoScroll = false,
    autoScrollInterval = 5000,
    variant = 'carousel',
    gridColumns = 4,
    onProductClick,
    className,
}: RelatedProductsProps) {
    // Ref para el contenedor del carousel
    const carouselRef = useRef<HTMLDivElement>(null);

    // Estado para el índice actual (para dots)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Estado para controlar si se puede navegar
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Limitar productos según maxItems
    const displayProducts = products.slice(0, maxItems);

    // Calcular número de "páginas" para dots
    const itemsPerView = variant === 'carousel' ? 4 : gridColumns;
    const totalPages = Math.ceil(displayProducts.length / itemsPerView);

    // Actualizar estado de navegación
    const updateScrollState = useCallback(() => {
        if (!carouselRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        // Actualizar índice actual para dots
        const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
        const newIndex = Math.round(scrollPercentage * (totalPages - 1));
        setCurrentIndex(Math.max(0, Math.min(newIndex, totalPages - 1)));
    }, [totalPages]);

    // Scroll suave a una posición
    const scrollTo = useCallback((direction: 'left' | 'right') => {
        if (!carouselRef.current) return;

        const { clientWidth } = carouselRef.current;
        const scrollAmount = clientWidth * 0.8; // Scroll 80% del ancho visible

        carouselRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }, []);

    // Ir a una página específica (para dots)
    const goToPage = useCallback((pageIndex: number) => {
        if (!carouselRef.current) return;

        const { scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const scrollPosition = (pageIndex / (totalPages - 1)) * maxScroll;

        carouselRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }, [totalPages]);

    // Auto-scroll effect
    React.useEffect(() => {
        if (!autoScroll || variant !== 'carousel') return;

        const interval = setInterval(() => {
            if (carouselRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;

                if (isAtEnd) {
                    // Volver al inicio
                    carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollTo('right');
                }
            }
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [autoScroll, autoScrollInterval, variant, scrollTo]);

    // Si no hay productos, no renderizar nada
    if (!displayProducts || displayProducts.length === 0) {
        return null;
    }

    const containerClasses = [
        styles.container,
        styles[`variant-${variant}`],
        className
    ].filter(Boolean).join(' ');

    return (
        <section className={containerClasses} aria-labelledby="related-products-title">
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    {title && (
                        <h2 id="related-products-title" className={styles.title}>
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className={styles.subtitle}>{subtitle}</p>
                    )}
                </div>

                {/* Controles de navegación (solo en carousel) */}
                {variant === 'carousel' && showNavigation && (
                    <div className={styles.navigation}>
                        <button
                            type="button"
                            className={`${styles.navButton} ${styles.navPrev}`}
                            onClick={() => scrollTo('left')}
                            disabled={!canScrollLeft}
                            aria-label="Ver productos anteriores"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            type="button"
                            className={`${styles.navButton} ${styles.navNext}`}
                            onClick={() => scrollTo('right')}
                            disabled={!canScrollRight}
                            aria-label="Ver más productos"
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                )}
            </div>

            {/* Carousel view */}
            {variant === 'carousel' && (
                <div className={styles.carouselWrapper}>
                    <div
                        ref={carouselRef}
                        className={styles.carousel}
                        onScroll={updateScrollState}
                    >
                        {displayProducts.map(product => (
                            <div
                                key={product.id}
                                className={styles.carouselItem}
                                onClick={() => onProductClick?.(product)}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Gradient overlays para indicar más contenido */}
                    {canScrollLeft && <div className={`${styles.gradientOverlay} ${styles.gradientLeft}`} />}
                    {canScrollRight && <div className={`${styles.gradientOverlay} ${styles.gradientRight}`} />}
                </div>
            )}

            {/* Grid view */}
            {variant === 'grid' && (
                <div
                    className={styles.grid}
                    style={{ '--grid-columns': gridColumns } as React.CSSProperties}
                >
                    {displayProducts.map(product => (
                        <div
                            key={product.id}
                            className={styles.gridItem}
                            onClick={() => onProductClick?.(product)}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}

            {/* Dots/indicadores de paginación */}
            {variant === 'carousel' && showDots && totalPages > 1 && (
                <div className={styles.dots} role="tablist" aria-label="Navegación de productos">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                            onClick={() => goToPage(index)}
                            role="tab"
                            aria-selected={index === currentIndex}
                            aria-label={`Página ${index + 1} de ${totalPages}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

/**
 * RelatedProductsSkeleton - Skeleton loading para productos relacionados
 */
export function RelatedProductsSkeleton({
    itemCount = 4,
    className,
}: {
    itemCount?: number;
    className?: string;
}) {
    const containerClasses = [styles.container, styles.skeleton, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <div className={styles.header}>
                <div className={styles.skeletonTitle} />
            </div>
            <div className={styles.carouselWrapper}>
                <div className={styles.carousel}>
                    {Array.from({ length: itemCount }).map((_, index) => (
                        <div key={index} className={styles.carouselItem}>
                            <div className={styles.skeletonCard}>
                                <div className={styles.skeletonImage} />
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonText} />
                                    <div className={styles.skeletonTextShort} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RelatedProducts;