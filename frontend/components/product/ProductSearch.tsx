/**
 * ProductSearch - Componente de busqueda con sugerencias en tiempo real
 *
 * Caracteristicas:
 * - Busqueda con debounce para evitar llamadas excesivas
 * - Sugerencias de productos mientras escribes (dropdown)
 * - Historial de busquedas recientes con localStorage
 * - Busquedas populares/trending
 * - Integracion con Vendure GraphQL para obtener resultados reales
 * - Navegacion por teclado en sugerencias
 * - Click fuera para cerrar sugerencias
 * - Resaltado de texto coincidente
 *
 * @module ProductSearch
 * @version 3.0.0 - Añadido historial de búsquedas y mejoras UX
 */
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyQuery, gql } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchHistory } from '@/lib/hooks/useSearchHistory';
import styles from './ProductSearch.module.css';

/**
 * Query GraphQL para obtener sugerencias de busqueda
 * Busca productos por nombre y devuelve los primeros 5 resultados
 */
const SEARCH_SUGGESTIONS_QUERY = gql`
    query SearchSuggestions($term: String!, $take: Int) {
        products(options: { take: $take, filter: { name: { contains: $term } } }) {
            items {
                id
                name
                slug
                createdAt
                featuredAsset {
                    id
                    preview
                }
                variants {
                    id
                    priceWithTax
                }
            }
        }
    }
`;

/**
 * Interface para producto en sugerencias
 */
interface SuggestionProduct {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    featuredAsset?: {
        id: string;
        preview: string;
    };
    variants: Array<{
        id: string;
        priceWithTax: number;
    }>;
}

/** Búsquedas populares predefinidas (pueden venir de analytics en el futuro) */
const POPULAR_SEARCHES = [
    'Aire acondicionado',
    'Placa electrónica',
    'Caldera gas',
    'Split pared',
    'Repuestos Saunier',
];

/** Categorías rápidas para sugerencias */
const QUICK_CATEGORIES = [
    { name: 'Aires Acondicionados', slug: 'aires-acondicionados', icon: '❄️' },
    { name: 'Calderas', slug: 'calderas', icon: '🔥' },
    { name: 'Repuestos', slug: 'repuestos', icon: '🔧' },
    { name: 'Placas Electrónicas', slug: 'placas-electronicas', icon: '💡' },
];

/**
 * Props para el componente ProductSearch
 */
export interface ProductSearchProps {
    /** Callback cuando se ejecuta busqueda */
    onSearch?: (query: string) => void;
    /** Placeholder del input */
    placeholder?: string;
    /** Valor inicial del campo de busqueda */
    initialValue?: string;
    /** Mostrar boton de buscar */
    showButton?: boolean;
    /** Mostrar sugerencias mientras escribe */
    showSuggestions?: boolean;
    /** Mostrar historial de búsquedas */
    showHistory?: boolean;
    /** Mostrar búsquedas populares */
    showPopular?: boolean;
    /** Mostrar categorías rápidas */
    showCategories?: boolean;
    /** Numero maximo de sugerencias a mostrar */
    maxSuggestions?: number;
    /** Variante visual */
    variant?: 'default' | 'compact' | 'hero';
    /** Clase CSS adicional */
    className?: string;
    /** Autofocus en el input */
    autoFocus?: boolean;
}

/**
 * Formatea precio en centimos a formato EUR
 */
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(price / 100);
};

/**
 * ProductSearch - Componente de busqueda con sugerencias
 *
 * Permite buscar productos en tiempo real con sugerencias
 * que aparecen mientras el usuario escribe
 */
/**
 * Resalta el texto que coincide con el término de búsqueda
 */
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <mark key={index} className={styles.highlight}>{part}</mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
}

export function ProductSearch({
    onSearch,
    placeholder = 'Buscar productos...',
    initialValue = '',
    showButton = false,
    showSuggestions = true,
    showHistory = true,
    showPopular = true,
    showCategories = false,
    maxSuggestions = 5,
    variant = 'default',
    className,
    autoFocus = false,
}: ProductSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [activeSection, setActiveSection] = useState<'history' | 'popular' | 'products' | 'categories'>('history');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /** Hook de historial de búsquedas */
    const { history, addSearch, removeSearch, clearHistory, getSuggestions: getHistorySuggestions } = useSearchHistory();

    /** Query lazy para obtener sugerencias de Vendure */
    const [getProductSuggestions, { data: suggestionsData, loading: loadingSuggestions }] = useLazyQuery(
        SEARCH_SUGGESTIONS_QUERY,
        { fetchPolicy: 'cache-first' }
    );

    /** Productos sugeridos del resultado de la query */
    const productSuggestions: SuggestionProduct[] = suggestionsData?.products?.items || [];

    /** Sugerencias del historial basadas en el query actual */
    const historySuggestions = useMemo(() => {
        return getHistorySuggestions(query).slice(0, 3);
    }, [getHistorySuggestions, query]);

    /** Determinar qué mostrar en el dropdown */
    const hasQuery = query.length >= 2;
    const showProductResults = hasQuery && (productSuggestions.length > 0 || loadingSuggestions);
    const showHistorySection = showHistory && !hasQuery && history.length > 0;
    const showPopularSection = showPopular && !hasQuery;
    const showCategoriesSection = showCategories && !hasQuery;
    const showHistorySuggestions = showHistory && hasQuery && historySuggestions.length > 0;

    /** Determinar si mostrar el dropdown */
    const showDropdown = showSuggestions && isFocused && (
        showProductResults ||
        showHistorySection ||
        showPopularSection ||
        showCategoriesSection ||
        showHistorySuggestions
    );

    /** Total de items navegables para teclado */
    const totalNavigableItems = useMemo(() => {
        if (hasQuery) {
            return historySuggestions.length + productSuggestions.length;
        }
        return history.slice(0, 5).length + POPULAR_SEARCHES.length + (showCategories ? QUICK_CATEGORIES.length : 0);
    }, [hasQuery, historySuggestions.length, productSuggestions.length, history, showCategories]);

    /**
     * Efecto debounce para buscar sugerencias de productos
     * Espera 300ms despues de que el usuario deje de escribir
     */
    useEffect(() => {
        if (!showSuggestions || query.length < 2) return;

        const timer = setTimeout(() => {
            getProductSuggestions({ variables: { term: query, take: maxSuggestions } });
        }, 300);

        return () => clearTimeout(timer);
    }, [query, getProductSuggestions, showSuggestions, maxSuggestions]);

    /**
     * Autofocus si está habilitado
     */
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    /**
     * Efecto para cerrar dropdown al hacer click fuera
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Ejecutar busqueda completa
     * Navega a /buscar con el termino de busqueda
     */
    const executeSearch = useCallback((searchQuery?: string) => {
        const finalQuery = searchQuery || query;
        if (finalQuery.trim()) {
            setIsFocused(false);
            addSearch(finalQuery.trim());
            if (onSearch) {
                onSearch(finalQuery);
            } else {
                router.push(`/buscar?q=${encodeURIComponent(finalQuery.trim())}`);
            }
        }
    }, [query, onSearch, router, addSearch]);

    /**
     * Ejecutar búsqueda desde el historial
     */
    const executeHistorySearch = useCallback((historyQuery: string) => {
        setQuery(historyQuery);
        setIsFocused(false);
        addSearch(historyQuery);
        if (onSearch) {
            onSearch(historyQuery);
        } else {
            router.push(`/buscar?q=${encodeURIComponent(historyQuery)}`);
        }
    }, [onSearch, router, addSearch]);

    /**
     * Navegar a una categoría
     */
    const navigateToCategory = useCallback((slug: string) => {
        setIsFocused(false);
        router.push(`/productos?categoria=${slug}`);
    }, [router]);

    /**
     * Navegar a producto seleccionado de sugerencias
     */
    const navigateToProduct = useCallback((slug: string) => {
        setIsFocused(false);
        router.push(`/productos/${slug}`);
    }, [router]);

    /**
     * Limpiar campo de busqueda
     */
    const handleClear = () => {
        setQuery('');
        setSelectedIndex(-1);
        if (onSearch) onSearch('');
        inputRef.current?.focus();
    };

    /**
     * Manejar navegacion por teclado en sugerencias
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown) {
            if (e.key === 'Enter') {
                executeSearch();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < totalNavigableItems - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : totalNavigableItems - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (hasQuery && selectedIndex >= historySuggestions.length && productSuggestions[selectedIndex - historySuggestions.length]) {
                    navigateToProduct(productSuggestions[selectedIndex - historySuggestions.length].slug);
                } else if (hasQuery && selectedIndex >= 0 && selectedIndex < historySuggestions.length && historySuggestions[selectedIndex]) {
                    executeHistorySearch(historySuggestions[selectedIndex].query);
                } else {
                    executeSearch();
                }
                break;
            case 'Escape':
                setIsFocused(false);
                setSelectedIndex(-1);
                break;
        }
    };

    /** Clases del contenedor */
    const wrapperClasses = [
        styles.searchWrapper,
        styles[variant],
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses} ref={wrapperRef}>
            <div className={styles.searchContainer}>
                {/* Icono de busqueda */}
                <svg
                    className={styles.searchIcon}
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                {/* Campo de busqueda */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={styles.searchInput}
                    aria-label="Buscar productos"
                    aria-autocomplete="list"
                    aria-controls="search-suggestions"
                    aria-expanded={showDropdown}
                    role="combobox"
                />

                {/* Boton limpiar */}
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className={styles.clearButton}
                        aria-label="Limpiar busqueda"
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}

                {/* Boton buscar (opcional) */}
                {showButton && (
                    <button
                        type="button"
                        onClick={() => executeSearch()}
                        className={styles.searchButton}
                        aria-label="Buscar"
                    >
                        Buscar
                    </button>
                )}
            </div>

            {/* Dropdown de sugerencias */}
            {showDropdown && (
                <div
                    id="search-suggestions"
                    className={styles.suggestionsDropdown}
                    role="listbox"
                    aria-label="Sugerencias de busqueda"
                >
                    {/* Sección de historial (cuando no hay query) */}
                    {showHistorySection && (
                        <div className={styles.suggestionSection}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                    Búsquedas recientes
                                </span>
                                <button
                                    type="button"
                                    className={styles.clearHistoryBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearHistory();
                                    }}
                                >
                                    Borrar todo
                                </button>
                            </div>
                            {history.slice(0, 5).map((item, index) => (
                                <button
                                    key={item.query}
                                    type="button"
                                    className={`${styles.historyItem} ${index === selectedIndex ? styles.suggestionSelected : ''}`}
                                    onClick={() => executeHistorySearch(item.query)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                    <span className={styles.historyQuery}>{item.query}</span>
                                    {item.resultCount !== undefined && (
                                        <span className={styles.historyCount}>{item.resultCount} resultados</span>
                                    )}
                                    <button
                                        type="button"
                                        className={styles.removeHistoryBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSearch(item.query);
                                        }}
                                        aria-label={`Eliminar "${item.query}" del historial`}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sección de búsquedas populares (cuando no hay query) */}
                    {showPopularSection && (
                        <div className={styles.suggestionSection}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                                    </svg>
                                    Búsquedas populares
                                </span>
                            </div>
                            <div className={styles.popularTags}>
                                {POPULAR_SEARCHES.map((term) => (
                                    <button
                                        key={term}
                                        type="button"
                                        className={styles.popularTag}
                                        onClick={() => executeHistorySearch(term)}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sección de categorías rápidas (cuando no hay query) */}
                    {showCategoriesSection && (
                        <div className={styles.suggestionSection}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                    Categorías
                                </span>
                            </div>
                            <div className={styles.categoryGrid}>
                                {QUICK_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        type="button"
                                        className={styles.categoryItem}
                                        onClick={() => navigateToCategory(cat.slug)}
                                    >
                                        <span className={styles.categoryIcon}>{cat.icon}</span>
                                        <span className={styles.categoryName}>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sugerencias del historial que coinciden (cuando hay query) */}
                    {showHistorySuggestions && (
                        <div className={styles.suggestionSection}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionTitle}>Búsquedas anteriores</span>
                            </div>
                            {historySuggestions.map((item, index) => (
                                <button
                                    key={item.query}
                                    type="button"
                                    className={`${styles.historyItem} ${index === selectedIndex ? styles.suggestionSelected : ''}`}
                                    onClick={() => executeHistorySearch(item.query)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                    <span className={styles.historyQuery}>
                                        <HighlightedText text={item.query} highlight={query} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Productos sugeridos (cuando hay query) */}
                    {hasQuery && (
                        <>
                            {loadingSuggestions ? (
                                <div className={styles.suggestionsLoading}>
                                    <span className={styles.loadingSpinner} />
                                    <span>Buscando productos...</span>
                                </div>
                            ) : productSuggestions.length > 0 ? (
                                <div className={styles.suggestionSection}>
                                    <div className={styles.sectionHeader}>
                                        <span className={styles.sectionTitle}>Productos</span>
                                    </div>
                                    {productSuggestions.map((product, index) => {
                                        const adjustedIndex = historySuggestions.length + index;
                                        const isRefurbished = product.name.toLowerCase().includes('reacondicionado');
                                        const isNew = !isRefurbished && product.createdAt && (new Date().getTime() - new Date(product.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 60;

                                        return (
                                            <button
                                                key={product.id}
                                                type="button"
                                                className={`${styles.suggestionItem} ${adjustedIndex === selectedIndex ? styles.suggestionSelected : ''}`}
                                                onClick={() => navigateToProduct(product.slug)}
                                                onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                                                role="option"
                                                aria-selected={adjustedIndex === selectedIndex}
                                            >
                                                {/* Imagen del producto */}
                                                <div className={styles.suggestionImage}>
                                                    {product.featuredAsset ? (
                                                        <Image
                                                            src={product.featuredAsset.preview}
                                                            alt=""
                                                            width={60}
                                                            height={60}
                                                        />
                                                    ) : (
                                                        <div className={styles.suggestionNoImage}>
                                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Nombre y precio */}
                                                <div className={styles.suggestionInfo}>
                                                    <div className={styles.suggestionHeader}>
                                                        <span className={styles.suggestionName}>
                                                            <HighlightedText text={product.name} highlight={query} />
                                                        </span>
                                                        {isNew && <span className={`${styles.suggestionBadge} ${styles.badgeNew}`}>NUEVO</span>}
                                                        {isRefurbished && <span className={`${styles.suggestionBadge} ${styles.badgeRefurbished}`}>REAC.</span>}
                                                    </div>
                                                    {product.variants[0] && (
                                                        <span className={styles.suggestionPrice}>
                                                            {formatPrice(product.variants[0].priceWithTax)}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : !loadingSuggestions && query.length >= 2 ? (
                                <div className={styles.noSuggestions}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <span>No se encontraron productos para "{query}"</span>
                                </div>
                            ) : null}

                            {/* Link ver todos los resultados */}
                            {query.length >= 2 && (
                                <button
                                    type="button"
                                    className={styles.viewAllResults}
                                    onClick={() => executeSearch()}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    Ver todos los resultados para "{query}"
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProductSearch;
