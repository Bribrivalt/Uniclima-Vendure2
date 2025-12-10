/**
 * Repuestos Page - Uniclima Solutions
 *
 * Página de repuestos con diseño profesional
 * Similar a openclima.es
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
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

// Categorías de repuestos
const categories = [
    { name: 'Compresores', slug: 'compresores', icon: '🔧' },
    { name: 'Placas Electrónicas', slug: 'placas-electronicas', icon: '💻' },
    { name: 'Motores', slug: 'motores', icon: '⚙️' },
    { name: 'Válvulas', slug: 'valvulas', icon: '🔩' },
    { name: 'Filtros', slug: 'filtros', icon: '🔍' },
    { name: 'Termostatos', slug: 'termostatos', icon: '🌡️' },
];

// Iconos SVG
const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

export default function RepuestosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [showCategories, setShowCategories] = useState(false);

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
        <div className={styles.repuestosPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroPattern} />
                <div className={styles.container}>
                    <h1 className={styles.heroTitle}>Tu Tienda de Repuestos de Climatización</h1>
                    <p className={styles.heroSubtitle}>
                        Repuestos originales y de alta calidad para calderas, aire acondicionado y aerotermia
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    {/* Categories Toggle for Mobile */}
                    <button
                        className={styles.categoriesToggle}
                        onClick={() => setShowCategories(!showCategories)}
                    >
                        <MenuIcon />
                        <span>Todas las categorías</span>
                    </button>

                    {/* Categories Sidebar (Desktop) / Dropdown (Mobile) */}
                    <div className={`${styles.categoriesSidebar} ${showCategories ? styles.open : ''}`}>
                        <h3 className={styles.categoriesTitle}>Categorías</h3>
                        <ul className={styles.categoriesList}>
                            {categories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={`/repuestos?categoria=${cat.slug}`}
                                        className={styles.categoryLink}
                                    >
                                        <span className={styles.categoryIcon}>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products Area */}
                    <div className={styles.productsArea}>
                        {/* Search and Sort */}
                        <div className={styles.controls}>
                            <div className={styles.searchWrapper}>
                                <ProductSearch onSearch={setSearchQuery} />
                            </div>
                            <ProductSort
                                value={sortOption}
                                onChange={(value) => setSortOption(value as SortOption)}
                            />
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

                        {/* Search and Sort */}
                        <div className={styles.controls}>
                            <div className={styles.searchWrapper}>
                                <ProductSearch onSearch={setSearchQuery} />
                            </div>
                            <ProductSort
                                value={sortOption}
                                onChange={(value) => setSortOption(value as SortOption)}
                            />
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
                </div>
            </section>

            {/* Benefits Section */}
            <section className={styles.benefitsSection}>
                <div className={styles.container}>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitItem}>
                            <span className={styles.benefitIcon}>🚚</span>
                            <div className={styles.benefitContent}>
                                <h4>Envío Rápido</h4>
                                <p>Entrega en 24-48h</p>
                            </div>
                        </div>
                        <div className={styles.benefitItem}>
                            <span className={styles.benefitIcon}>✅</span>
                            <div className={styles.benefitContent}>
                                <h4>Garantía Original</h4>
                                <p>2 años de garantía</p>
                            </div>
                        </div>
                        <div className={styles.benefitItem}>
                            <span className={styles.benefitIcon}>🔒</span>
                            <div className={styles.benefitContent}>
                                <h4>Pago Seguro</h4>
                                <p>100% protegido</p>
                            </div>
                        </div>
                        <div className={styles.benefitItem}>
                            <span className={styles.benefitIcon}>📞</span>
                            <div className={styles.benefitContent}>
                                <h4>Soporte Técnico</h4>
                                <p>Asesoramiento experto</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
