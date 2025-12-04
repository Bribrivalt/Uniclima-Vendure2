/**
 * Pagina de Busqueda - /buscar
 *
 * Permite buscar productos con:
 * - Busqueda por termino con sugerencias
 * - Filtros por facets de Vendure
 * - Ordenacion por precio, nombre, relevancia
 * - Paginacion de resultados
 * - Integracion real con Vendure GraphQL
 *
 * @module BuscarPage
 * @version 2.0.0 - Integrado con Vendure
 */
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import { ProductGrid, ProductSort, ProductPagination, ProductSearch } from '@/components/product';
import { Breadcrumb, Skeleton } from '@/components/core';
import { Product } from '@/lib/types/product';
import styles from './page.module.css';

/** Numero de productos por pagina */
const PRODUCTS_PER_PAGE = 12;

/**
 * Query GraphQL para buscar productos en Vendure
 * Busca por nombre y devuelve productos con paginacion
 */
const SEARCH_PRODUCTS_QUERY = gql`
    query SearchProducts($term: String!, $take: Int, $skip: Int, $sort: ProductSortParameter) {
        products(
            options: {
                take: $take,
                skip: $skip,
                sort: $sort,
                filter: { name: { contains: $term } }
            }
        ) {
            items {
                id
                name
                slug
                description
                featuredAsset {
                    id
                    preview
                }
                variants {
                    id
                    priceWithTax
                    stockLevel
                }
                customFields {
                    potenciaKw
                    frigorias
                    claseEnergetica
                    wifi
                    modoVenta
                }
                facetValues {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
            totalItems
        }
    }
`;

/**
 * Interface para respuesta de busqueda
 */
interface SearchResponse {
    products: {
        items: Product[];
        totalItems: number;
    };
}

/**
 * Componente interno que usa useSearchParams
 * Maneja la logica de busqueda y filtrado
 */
function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    /** Obtener parametros de URL */
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sort') || 'relevance';

    /**
     * Construir parametro de ordenacion para GraphQL
     * Convierte valor de UI a formato Vendure
     */
    const getSortParameter = () => {
        switch (sortBy) {
            case 'price-asc':
                return { price: 'ASC' };
            case 'price-desc':
                return { price: 'DESC' };
            case 'name-asc':
                return { name: 'ASC' };
            case 'name-desc':
                return { name: 'DESC' };
            case 'newest':
                return { createdAt: 'DESC' };
            default:
                return undefined;
        }
    };

    /** Query de busqueda con Vendure */
    const { data, loading, error } = useQuery<SearchResponse>(SEARCH_PRODUCTS_QUERY, {
        variables: {
            term: query,
            take: PRODUCTS_PER_PAGE,
            skip: (page - 1) * PRODUCTS_PER_PAGE,
            sort: getSortParameter(),
        },
        skip: !query,
        fetchPolicy: 'cache-and-network',
    });

    /** Extraer resultados */
    const products = data?.products?.items || [];
    const totalResults = data?.products?.totalItems || 0;
    const totalPages = Math.ceil(totalResults / PRODUCTS_PER_PAGE);

    /** Opciones de ordenacion disponibles */
    const sortOptions = [
        { value: 'relevance', label: 'Mas relevantes' },
        { value: 'price-asc', label: 'Precio: menor a mayor' },
        { value: 'price-desc', label: 'Precio: mayor a menor' },
        { value: 'name-asc', label: 'Nombre: A-Z' },
        { value: 'name-desc', label: 'Nombre: Z-A' },
        { value: 'newest', label: 'Mas recientes' },
    ];

    /**
     * Handler de busqueda
     * Actualiza URL con nuevo termino y resetea paginacion
     */
    const handleSearch = (newQuery: string) => {
        const params = new URLSearchParams();
        if (newQuery) params.set('q', newQuery);
        params.set('page', '1');
        if (sortBy !== 'relevance') params.set('sort', sortBy);
        router.push(`/buscar?${params.toString()}`);
    };

    /**
     * Handler de ordenacion
     * Actualiza URL con nueva ordenacion y resetea paginacion
     */
    const handleSortChange = (newSort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        params.set('page', '1');
        router.push(`/buscar?${params.toString()}`);
    };

    /**
     * Handler de paginacion
     * Actualiza URL con nueva pagina
     */
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/buscar?${params.toString()}`);
    };

    /** Items del breadcrumb */
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Busqueda', href: '/buscar' },
        ...(query ? [{ label: `"${query}"` }] : []),
    ];

    return (
        <div className={styles.container}>
            {/* Breadcrumb para navegacion */}
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            {/* Header con titulo y contador */}
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

            {/* Barra de busqueda con sugerencias */}
            <div className={styles.searchBar}>
                <ProductSearch
                    initialValue={query}
                    onSearch={handleSearch}
                    placeholder="Que estas buscando?"
                    showButton
                    showSuggestions
                />
            </div>

            {/* Contenido principal */}
            <div className={styles.content}>
                {/* Area de resultados */}
                <main className={styles.results}>
                    {/* Toolbar con ordenacion */}
                    {query && (
                        <div className={styles.toolbar}>
                            <ProductSort
                                value={sortBy}
                                options={sortOptions}
                                onChange={handleSortChange}
                            />
                        </div>
                    )}

                    {/* Estado de error */}
                    {error && (
                        <div className={styles.errorState}>
                            <div className={styles.errorIcon}>⚠️</div>
                            <h2>Error en la busqueda</h2>
                            <p>Ha ocurrido un error al buscar. Por favor, intentalo de nuevo.</p>
                        </div>
                    )}

                    {/* Estado de carga */}
                    {loading && !error ? (
                        <div className={styles.loadingGrid}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} height={320} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            {/* Grid de productos */}
                            <ProductGrid products={products} columns={3} />

                            {/* Paginacion */}
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
                    ) : query && !loading ? (
                        /* Sin resultados */
                        <div className={styles.noResults}>
                            <div className={styles.noResultsIcon}>🔍</div>
                            <h2>No se encontraron resultados</h2>
                            <p>No hemos encontrado productos que coincidan con "{query}"</p>
                            <ul className={styles.suggestions}>
                                <li>Revisa la ortografia de tu busqueda</li>
                                <li>Intenta con terminos mas generales</li>
                                <li>Prueba con sinonimos o palabras relacionadas</li>
                            </ul>
                        </div>
                    ) : !query ? (
                        /* Estado inicial sin query */
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🔎</div>
                            <h2>Busca productos</h2>
                            <p>Introduce un termino de busqueda para encontrar productos</p>
                        </div>
                    ) : null}
                </main>
            </div>
        </div>
    );
}

/**
 * BuscarPage - Pagina de busqueda de productos
 *
 * Permite a los usuarios buscar productos por termino,
 * ver sugerencias mientras escriben, y ordenar resultados.
 * Integrado con Vendure GraphQL para busquedas reales.
 */
export default function BuscarPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <Skeleton height={40} width={300} />
                <Skeleton height={60} className={styles.searchBar} />
                <div className={styles.content}>
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