'use client';

import React, { useState } from 'react';
import styles from './ProductGrid.module.css';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types/product';

/**
 * Props para el componente ProductGrid
 * @interface ProductGridProps
 */
export interface ProductGridProps {
    /** Lista de productos a mostrar (usando tipo Product de Vendure) */
    products: Product[];
    /** Modo de visualización */
    viewMode?: 'grid' | 'list';
    /** Número de columnas (en modo grid) */
    columns?: 2 | 3 | 4;
    /** Mostrar toggle de modo de vista */
    showViewToggle?: boolean;
    /** Estado de carga */
    loading?: boolean;
    /** Número de skeletons a mostrar mientras carga */
    skeletonCount?: number;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de grid
 */
const GridIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

/**
 * Icono de lista
 */
const ListIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

/**
 * Skeleton para el ProductCard mientras carga
 */
const ProductSkeleton = () => (
    <div className={styles.skeleton}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonPrice} />
            <div className={styles.skeletonButton} />
        </div>
    </div>
);

/**
 * ProductGrid - Grid de productos con opciones de visualización
 * 
 * Características:
 * - Responsive 1-4 columnas
 * - Modo lista/grid toggle
 * - Animación de entrada
 * - Estado de carga con skeletons
 * 
 * @example
 * ```tsx
 * <ProductGrid 
 *   products={products}
 *   columns={3}
 *   showViewToggle
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */
export function ProductGrid({
    products,
    viewMode: initialViewMode = 'grid',
    columns = 3,
    showViewToggle = false,
    loading = false,
    skeletonCount = 6,
    className,
}: ProductGridProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

    // Clases CSS
    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ');

    const gridClasses = [
        styles.grid,
        styles[viewMode],
        styles[`cols${columns}`],
    ].filter(Boolean).join(' ');

    // Renderizar skeletons mientras carga
    if (loading) {
        return (
            <div className={containerClasses}>
                {showViewToggle && (
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
                            disabled
                            aria-label="Vista en cuadrícula"
                        >
                            <GridIcon />
                        </button>
                        <button
                            className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
                            disabled
                            aria-label="Vista en lista"
                        >
                            <ListIcon />
                        </button>
                    </div>
                )}
                <div className={gridClasses}>
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                        <ProductSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Estado vacío
    if (products.length === 0) {
        return (
            <div className={containerClasses}>
                <div className={styles.empty}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className={styles.emptyIcon}
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <p className={styles.emptyText}>No se encontraron productos</p>
                    <p className={styles.emptySubtext}>Prueba a modificar los filtros o buscar otra cosa</p>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            {/* Toggle de vista */}
            {showViewToggle && (
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.toggleButton} ${viewMode === 'grid' ? styles.active : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Vista en cuadrícula"
                        aria-pressed={viewMode === 'grid'}
                    >
                        <GridIcon />
                    </button>
                    <button
                        className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="Vista en lista"
                        aria-pressed={viewMode === 'list'}
                    >
                        <ListIcon />
                    </button>
                </div>
            )}

            {/* Grid de productos */}
            <div className={gridClasses} role="list">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className={`${styles.gridItem} ${viewMode === 'list' ? styles.listItem : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        role="listitem"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductGrid;