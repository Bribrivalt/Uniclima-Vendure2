'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/vendure/queries/products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductSort, SortOption } from '@/components/product/ProductSort';
import { ProductPagination } from '@/components/product/ProductPagination';
import { Product } from '@/lib/types/product';
import styles from './page.module.css';

interface ProductsData {
    products: {
        items: Product[];
        totalItems: number;
    };
}

const ITEMS_PER_PAGE = 12;

export default function RepuestosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Convertir sortOption a formato Vendure
    const getSortVariables = useCallback(() => {
        switch (sortOption) {
            case 'name-asc':
                return { name: 'ASC' as const };
            case 'name-desc':
                return { name: 'DESC' as const };
            case 'price-asc':
                return { price: 'ASC' as const };
            case 'price-desc':
                return { price: 'DESC' as const };
            default:
                return { name: 'ASC' as const };
        }
    }, [sortOption]);

    // Resetear página cuando cambia la búsqueda o el ordenamiento
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortOption]);

    // Query de productos con Apollo Client
    const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS, {
        variables: {
            options: {
                take: ITEMS_PER_PAGE,
                skip: (currentPage - 1) * ITEMS_PER_PAGE,
                filter: searchQuery
                    ? {
                        name: {
                            contains: searchQuery,
                        },
                    }
                    : undefined,
                sort: getSortVariables(),
            },
        },
        fetchPolicy: 'cache-and-network',
    });

    const products = data?.products.items || [];
    const totalItems = data?.products.totalItems || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Repuestos Reacondicionados</h1>
                <p className={styles.subtitle}>
                    Repuestos de climatización de alta calidad a precios competitivos
                </p>
            </div>

            {/* Search and Sort */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <ProductSearch onSearch={setSearchQuery} />
                </div>
                <ProductSort value={sortOption} onChange={setSortOption} />
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <span className={styles.count}>
                    {loading ? (
                        'Cargando...'
                    ) : (
                        <>
                            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                            {searchQuery && ` encontrado${totalItems === 1 ? '' : 's'} para "${searchQuery}"`}
                        </>
                    )}
                </span>
            </div>

            {/* Loading State */}
            {loading && products.length === 0 && (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Cargando productos...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className={styles.error}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h2>Error al cargar productos</h2>
                    <p>Por favor, verifica que el backend esté corriendo.</p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
                <>
                    <div className={styles.grid}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <ProductPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
                <div className={styles.empty}>
                    <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={styles.emptyIcon}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                    <h2 className={styles.emptyTitle}>
                        {searchQuery ? 'No se encontraron productos' : 'No hay productos disponibles'}
                    </h2>
                    <p className={styles.emptyText}>
                        {searchQuery
                            ? `No hay resultados para "${searchQuery}". Intenta con otra búsqueda.`
                            : 'Estamos trabajando en añadir más productos. Vuelve pronto.'}
                    </p>
                </div>
            )}
        </div>
    );
}
