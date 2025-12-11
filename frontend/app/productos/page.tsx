/**
 * Página de Catálogo de Productos - /productos
 * 
 * Esta página muestra el catálogo completo de productos HVAC conectado
 * con el backend de Vendure. Incluye:
 * - Búsqueda en tiempo real
 * - Filtros por categoría y marca
 * - Ordenamiento (nombre, precio)
 * - Paginación
 * - Estados de carga, error y vacío
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_FACETS } from '@/lib/vendure/queries/products';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductSort, SortOption } from '@/components/product/ProductSort';
import { ProductPagination } from '@/components/product/ProductPagination';
import { ProductFilters, FilterGroup, ActiveFilters } from '@/components/product/ProductFilters';
import { Product } from '@/lib/types/product';
import styles from './page.module.css';

/**
 * Interfaz para la respuesta de la query GET_PRODUCTS
 */
interface ProductsData {
    products: {
        items: Product[];
        totalItems: number;
    };
}

/**
 * Número de productos a mostrar por página
 * @constant
 */
const ITEMS_PER_PAGE = 12;


/**
 * Categorías de productos HVAC
 * TODO: En el futuro, estas categorías se cargarán dinámicamente desde Vendure
 * usando la query GET_COLLECTIONS para obtener las colecciones reales del backend
 * 
 * @constant
 */
const CATEGORIES = [
    { id: 'all', name: 'Todos' },
    { id: 'split', name: 'Split Pared' },
    { id: 'multisplit', name: 'Multisplit' },
    { id: 'conductos', name: 'Conductos' },
    { id: 'cassette', name: 'Cassette' },
    { id: 'suelo-techo', name: 'Suelo/Techo' },
    { id: 'calderas', name: 'Calderas' },
];

/**
 * Marcas de climatización
 * TODO: En el futuro, estas marcas se cargarán dinámicamente desde Vendure
 * usando Facets para obtener las marcas reales disponibles en el catálogo
 * 
 * @constant
 */
const BRANDS = [
    { id: 'all', name: 'Todas las marcas' },
    { id: 'daikin', name: 'Daikin' },
    { id: 'mitsubishi', name: 'Mitsubishi Electric' },
    { id: 'lg', name: 'LG' },
    { id: 'fujitsu', name: 'Fujitsu' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'panasonic', name: 'Panasonic' },
];


/**
 * Componente principal de la página de productos
 * 
 * Maneja:
 * - Estado de búsqueda, ordenamiento y paginación
 * - Filtros por categoría y marca
 * - Conexión con Apollo Client para obtener datos de Vendure
 * - Estados de carga, error y vacío
 * 
 * @returns {JSX.Element} Página de catálogo de productos
 */
export default function ProductosPage() {
    // ========================================
    // ESTADOS DEL COMPONENTE
    // ========================================

    /**
     * Query de búsqueda ingresada por el usuario
     * Se usa para filtrar productos por nombre
     */
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Opción de ordenamiento seleccionada
     * Opciones: 'name-asc', 'name-desc', 'price-asc', 'price-desc'
     */
    const [sortOption, setSortOption] = useState<SortOption>('name-asc');

    /**
     * Página actual de la paginación (1-indexed)
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * Filtros activos seleccionados por el usuario
     * Estructura: { [facetCode]: [facetValueId1, facetValueId2, ...] }
     */
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

    /**
     * Categoría seleccionada para filtrar
     * TODO: Conectar con Collections de Vendure
     */
    const [selectedCategory, setSelectedCategory] = useState('all');

    /**
     * Marca seleccionada para filtrar
     * TODO: Conectar con Facets de Vendure
     */
    const [selectedBrand, setSelectedBrand] = useState('all');

    // ========================================
    // FUNCIONES AUXILIARES
    // ========================================

    /**
     * Convierte la opción de ordenamiento del frontend al formato de Vendure
     * 
     * @returns {Object} Objeto con el campo y dirección de ordenamiento para Vendure
     * @example
     * // Para 'price-asc' retorna { price: 'ASC' }
     * // Para 'name-desc' retorna { name: 'DESC' }
     */
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

    /**
     * Efecto para resetear la página a 1 cuando cambian los filtros o búsqueda
     * Esto asegura que el usuario siempre vea la primera página de resultados
     * cuando hace una nueva búsqueda o cambia filtros
     */
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortOption, selectedCategory, selectedBrand, activeFilters]);


    // ========================================
    // QUERY DE FACETS - CARGAR FILTROS DISPONIBLES
    // ========================================

    /**
     * Query para obtener facets (filtros) disponibles desde Vendure
     * Los facets incluyen: Marca, Tipo de Producto, Clase Energética, etc.
     */
    const { data: facetsData, loading: facetsLoading } = useQuery(GET_FACETS);

    /**
     * Transformar facets de Vendure al formato FilterGroup para ProductFilters
     * 
     * Convierte los facets del backend en grupos de filtros con sus opciones
     * Ejemplo: Facet "Marca" -> FilterGroup con opciones [Daikin, Mitsubishi, etc.]
     */
    const filterGroups = useMemo<FilterGroup[]>(() => {
        if (!facetsData?.facets?.items) return [];

        return facetsData.facets.items.map((facet: any) => ({
            id: facet.code,
            name: facet.name,
            type: 'checkbox' as const,
            options: facet.values.map((value: any) => ({
                value: value.id,
                label: value.name,
                // TODO: Agregar conteo de productos por facet value
                // count: value.productCount
            })),
        }));
    }, [facetsData]);

    /**
     * Extraer IDs de facet values seleccionados para enviar a la query de productos
     * Convierte { marca: ['1', '2'], tipo: ['3'] } -> ['1', '2', '3']
     */
    const selectedFacetValueIds = useMemo(() => {
        return Object.values(activeFilters)
            .filter(value => Array.isArray(value))
            .flat() as string[];
    }, [activeFilters]);


    // ========================================
    // QUERY DE APOLLO CLIENT - CONEXIÓN CON VENDURE
    // ========================================

    /**
     * Query de productos usando Apollo Client
     * 
     * Esta query se conecta con el backend de Vendure para obtener:
     * - Lista paginada de productos
     * - Total de productos disponibles
     * - Datos completos de cada producto (nombre, precio, imagen, custom fields HVAC)
     * 
     * Variables enviadas a Vendure:
     * - take: Número de productos por página
     * - skip: Offset para paginación (calculado desde currentPage)
     * - filter.name.contains: Filtro de búsqueda por nombre (opcional)
     * - filter.facetValueIds: Filtros por facets seleccionados (marca, tipo, etc.)
     * - sort: Ordenamiento (nombre o precio, ASC o DESC)
     * 
     * Política de caché: 'cache-and-network'
     * - Primero muestra datos del caché si existen
     * - Luego hace la petición al servidor para actualizar
     * - Esto mejora la UX mostrando datos inmediatamente
     */
    const { data, loading, error } = useQuery<ProductsData>(GET_PRODUCTS, {
        variables: {
            options: {
                // Paginación: tomar X productos
                take: ITEMS_PER_PAGE,

                // Paginación: saltar los productos de páginas anteriores
                // Ejemplo: Página 2 con 12 items/página = skip 12 productos
                skip: (currentPage - 1) * ITEMS_PER_PAGE,

                // Filtros combinados
                filter: {
                    // Búsqueda por nombre (solo si hay query)
                    ...(searchQuery && {
                        name: {
                            contains: searchQuery,
                        },
                    }),
                    // Filtros por facets seleccionados (marca, tipo, características, etc.)
                    // Vendure usa facetValueId con operador 'in' para filtrar por múltiples facet values
                    ...(selectedFacetValueIds.length > 0 && {
                        facetValueId: {
                            in: selectedFacetValueIds,
                        },
                    }),
                },

                // Ordenamiento convertido al formato de Vendure
                sort: getSortVariables(),
            },
        },
        // Estrategia de caché: mostrar caché primero, luego actualizar desde red
        fetchPolicy: 'cache-and-network',
    });

    // ========================================
    // EXTRACCIÓN DE DATOS DE LA RESPUESTA
    // ========================================

    /**
     * Array de productos obtenidos de Vendure
     * Si no hay datos aún, retorna array vacío para evitar errores
     */
    const products = data?.products.items || [];

    /**
     * Número total de productos que coinciden con los filtros
     * Se usa para calcular el número de páginas en la paginación
     */
    const totalItems = data?.products.totalItems || 0;

    /**
     * Número total de páginas calculado desde el total de items
     * Math.ceil redondea hacia arriba para incluir la última página parcial
     */
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // ========================================
    // ESTADO PARA DRAWER DE FILTROS EN MÓVIL
    // ========================================

    /**
     * Estado para controlar si el drawer de filtros está abierto (solo móvil)
     */
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    /**
     * Contar filtros activos para mostrar en el botón móvil
     */
    const activeFilterCount = Object.values(activeFilters).reduce((count, value) => {
        if (Array.isArray(value)) {
            return count + value.length;
        }
        return count + 1;
    }, 0);

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
                {/* Sidebar con filtros dinámicos (desktop) */}
                <ProductFilters
                    filterGroups={filterGroups}
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                    onClearFilters={() => setActiveFilters({})}
                    className={styles.sidebar}
                />

                {/* Drawer de filtros para móvil */}
                <ProductFilters
                    filterGroups={filterGroups}
                    activeFilters={activeFilters}
                    onFilterChange={setActiveFilters}
                    onClearFilters={() => setActiveFilters({})}
                    asDrawer
                    isOpen={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                />

                {/* Contenido principal */}
                <main className={styles.content}>
                    {/* Barra de controles: Búsqueda, Filtros móvil y Ordenamiento */}
                    <div className={styles.controls}>
                        <div className={styles.searchWrapper}>
                            <ProductSearch onSearch={setSearchQuery} />
                        </div>

                        {/* Botón de filtros para móvil */}
                        <button
                            className={styles.mobileFilterButton}
                            onClick={() => setIsFilterDrawerOpen(true)}
                            aria-label="Abrir filtros"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
                            </svg>
                            <span>Filtros</span>
                            {activeFilterCount > 0 && (
                                <span className={styles.filterBadge}>{activeFilterCount}</span>
                            )}
                        </button>

                        <ProductSort value={sortOption} onChange={(value) => setSortOption(value as SortOption)} />
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