'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductGrid, ProductFilters, ProductSort, ProductPagination, ProductSearch } from '@/components/product';
import { Breadcrumb, Skeleton } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para producto de búsqueda
 */
interface SearchProduct {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
    isNew?: boolean;
    discount?: number;
}

/**
 * Interfaz para filtros de búsqueda
 */
interface SearchFilters {
    categories: string[];
    priceRange: [number, number];
    brands: string[];
    inStock: boolean;
}

/**
 * Componente interno que usa useSearchParams
 */
function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Obtener query de URL
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sort') || 'relevance';

    // Estado
    const [products, setProducts] = useState<SearchProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<SearchFilters>({
        categories: [],
        priceRange: [0, 10000],
        brands: [],
        inStock: false,
    });

    // Opciones de ordenación
    const sortOptions = [
        { value: 'relevance', label: 'Más relevantes' },
        { value: 'price-asc', label: 'Precio: menor a mayor' },
        { value: 'price-desc', label: 'Precio: mayor a menor' },
        { value: 'name-asc', label: 'Nombre: A-Z' },
        { value: 'name-desc', label: 'Nombre: Z-A' },
        { value: 'newest', label: 'Más recientes' },
    ];

    // Categorías disponibles para filtrar
    const availableCategories = [
        { id: 'climatizacion', name: 'Climatización', count: 45 },
        { id: 'calefaccion', name: 'Calefacción', count: 32 },
        { id: 'ventilacion', name: 'Ventilación', count: 28 },
        { id: 'repuestos', name: 'Repuestos', count: 156 },
    ];

    // Marcas disponibles
    const availableBrands = [
        { id: 'daikin', name: 'Daikin', count: 25 },
        { id: 'mitsubishi', name: 'Mitsubishi Electric', count: 22 },
        { id: 'fujitsu', name: 'Fujitsu', count: 18 },
        { id: 'lg', name: 'LG', count: 15 },
    ];

    // Simular búsqueda
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);

            // TODO: Reemplazar con llamada real a Vendure GraphQL
            await new Promise(resolve => setTimeout(resolve, 800));

            // Resultados simulados
            if (query) {
                const mockProducts: SearchProduct[] = Array.from({ length: 12 }, (_, i) => ({
                    id: `search-${i + 1}`,
                    name: `${query} - Producto ${i + 1}`,
                    slug: `producto-${i + 1}`,
                    description: `Resultado de búsqueda para "${query}"`,
                    price: Math.floor(Math.random() * 500) + 100,
                    originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 200) + 600 : undefined,
                    image: `/images/products/placeholder-${(i % 4) + 1}.jpg`,
                    category: availableCategories[i % 4].name,
                    rating: 3 + Math.random() * 2,
                    reviewCount: Math.floor(Math.random() * 50),
                    inStock: Math.random() > 0.2,
                    isNew: Math.random() > 0.8,
                    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined,
                }));

                setProducts(mockProducts);
                setTotalResults(47);
                setTotalPages(4);
            } else {
                setProducts([]);
                setTotalResults(0);
                setTotalPages(1);
            }

            setLoading(false);
        };

        fetchResults();
    }, [query, page, sortBy, filters]);

    // Handler de búsqueda
    const handleSearch = (newQuery: string) => {
        const params = new URLSearchParams();
        if (newQuery) params.set('q', newQuery);
        params.set('page', '1');
        if (sortBy !== 'relevance') params.set('sort', sortBy);
        router.push(`/buscar?${params.toString()}`);
    };

    // Handler de ordenación
    const handleSortChange = (newSort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        params.set('page', '1');
        router.push(`/buscar?${params.toString()}`);
    };

    // Handler de paginación
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/buscar?${params.toString()}`);
    };

    // Handler de filtros
    const handleFilterChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
        // Aquí podrías actualizar la URL con los filtros
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Búsqueda', href: '/buscar' },
        ...(query ? [{ label: `"${query}"` }] : []),
    ];

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            {/* Header de búsqueda */}
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {query ? `Resultados para "${query}"` : 'Buscar productos'}
                </h1>
                {query && !loading && (
                    <p className={styles.resultCount}>
                        {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'} encontrados
                    </p>
                )}
            </header>

            {/* Barra de búsqueda */}
            <div className={styles.searchBar}>
                <ProductSearch
                    initialValue={query}
                    onSearch={handleSearch}
                    placeholder="¿Qué estás buscando?"
                    showButton
                />
            </div>

            {/* Contenido principal */}
            <div className={styles.content}>
                {/* Sidebar de filtros */}
                <aside className={styles.sidebar}>
                    <ProductFilters
                        categories={availableCategories}
                        brands={availableBrands}
                        selectedCategories={filters.categories}
                        selectedBrands={filters.brands}
                        priceRange={filters.priceRange}
                        maxPrice={10000}
                        inStockOnly={filters.inStock}
                        onCategoryChange={(cats) => handleFilterChange({ ...filters, categories: cats })}
                        onBrandChange={(brands) => handleFilterChange({ ...filters, brands })}
                        onPriceChange={(range) => handleFilterChange({ ...filters, priceRange: range })}
                        onStockChange={(inStock) => handleFilterChange({ ...filters, inStock })}
                        onClearAll={() => setFilters({ categories: [], priceRange: [0, 10000], brands: [], inStock: false })}
                    />
                </aside>

                {/* Área de resultados */}
                <main className={styles.results}>
                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <ProductSort
                            value={sortBy}
                            options={sortOptions}
                            onChange={handleSortChange}
                        />
                    </div>

                    {/* Estado de carga */}
                    {loading ? (
                        <div className={styles.loadingGrid}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} height={320} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            {/* Grid de productos */}
                            <ProductGrid products={products} columns={3} />

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <ProductPagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : query ? (
                        /* Sin resultados */
                        <div className={styles.noResults}>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h2>No se encontraron resultados</h2>
                            <p>No hemos encontrado productos que coincidan con "{query}"</p>
                            <ul className={styles.suggestions}>
                                <li>Revisa la ortografía de tu búsqueda</li>
                                <li>Intenta con términos más generales</li>
                                <li>Prueba con sinónimos o palabras relacionadas</li>
                            </ul>
                        </div>
                    ) : (
                        /* Estado inicial */
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🔎</div>
                            <h2>Busca productos</h2>
                            <p>Introduce un término de búsqueda para encontrar productos</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

/**
 * BuscarPage - Página de búsqueda de productos
 * 
 * Permite a los usuarios buscar productos por término,
 * filtrar resultados y ordenarlos.
 */
export default function BuscarPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <Skeleton height={40} width={300} />
                <Skeleton height={60} className={styles.searchBar} />
                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <Skeleton height={400} />
                    </div>
                    <div className={styles.results}>
                        <div className={styles.loadingGrid}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} height={320} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}