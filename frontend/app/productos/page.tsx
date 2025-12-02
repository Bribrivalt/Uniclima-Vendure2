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

// Categorías de productos HVAC
const CATEGORIES = [
    { id: 'all', name: 'Todos' },
    { id: 'split', name: 'Split Pared' },
    { id: 'multisplit', name: 'Multisplit' },
    { id: 'conductos', name: 'Conductos' },
    { id: 'cassette', name: 'Cassette' },
    { id: 'suelo-techo', name: 'Suelo/Techo' },
    { id: 'calderas', name: 'Calderas' },
];

// Marcas de climatización
const BRANDS = [
    { id: 'all', name: 'Todas las marcas' },
    { id: 'daikin', name: 'Daikin' },
    { id: 'mitsubishi', name: 'Mitsubishi Electric' },
    { id: 'lg', name: 'LG' },
    { id: 'fujitsu', name: 'Fujitsu' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'panasonic', name: 'Panasonic' },
];

export default function ProductosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');

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
    }, [searchQuery, sortOption, selectedCategory, selectedBrand]);

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
            {/* Hero Banner */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Equipos de Climatización</h1>
                    <p className={styles.heroSubtitle}>
                        Las mejores marcas en aire acondicionado y calderas con garantía profesional
                    </p>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Sidebar con filtros */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Categorías</h3>
                        <ul className={styles.filterList}>
                            {CATEGORIES.map((category) => (
                                <li key={category.id}>
                                    <button
                                        className={`${styles.filterButton} ${selectedCategory === category.id ? styles.filterButtonActive : ''
                                            }`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Marcas</h3>
                        <ul className={styles.filterList}>
                            {BRANDS.map((brand) => (
                                <li key={brand.id}>
                                    <button
                                        className={`${styles.filterButton} ${selectedBrand === brand.id ? styles.filterButtonActive : ''
                                            }`}
                                        onClick={() => setSelectedBrand(brand.id)}
                                    >
                                        {brand.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Banner de oferta */}
                    <div className={styles.offerBanner}>
                        <span className={styles.offerBadge}>Oferta</span>
                        <h4 className={styles.offerTitle}>Instalación incluida</h4>
                        <p className={styles.offerText}>
                            En equipos seleccionados. Consulta condiciones.
                        </p>
                    </div>
                </aside>

                {/* Contenido principal */}
                <main className={styles.content}>
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
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                </main>
            </div>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className={styles.featureTitle}>Garantía Oficial</h3>
                    <p className={styles.featureText}>Todos nuestros equipos incluyen garantía del fabricante</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className={styles.featureTitle}>Instalación Rápida</h3>
                    <p className={styles.featureText}>Servicio de instalación profesional en 24-48h</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <h3 className={styles.featureTitle}>Asesoramiento Experto</h3>
                    <p className={styles.featureText}>Te ayudamos a elegir el equipo ideal para tu espacio</p>
                </div>
            </section>
        </div>
    );
}