/**
 * ProductSearch - Componente de busqueda con sugerencias en tiempo real
 *
 * Caracteristicas:
 * - Busqueda con debounce para evitar llamadas excesivas
 * - Sugerencias de productos mientras escribes (dropdown)
 * - Integracion con Vendure GraphQL para obtener resultados reales
 * - Navegacion por teclado en sugerencias
 * - Click fuera para cerrar sugerencias
 *
 * @module ProductSearch
 * @version 2.0.0 - Anadidas sugerencias en tiempo real
 */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyQuery, gql } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
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
    featuredAsset?: {
        id: string;
        preview: string;
    };
    variants: Array<{
        id: string;
        priceWithTax: number;
    }>;
}

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
    /** Numero maximo de sugerencias a mostrar */
    maxSuggestions?: number;
    /** Clase CSS adicional */
    className?: string;
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
export function ProductSearch({
    onSearch,
    placeholder = 'Buscar productos...',
    initialValue = '',
    showButton = false,
    showSuggestions = true,
    maxSuggestions = 5,
    className,
}: ProductSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /** Query lazy para obtener sugerencias de Vendure */
    const [getSuggestions, { data: suggestionsData, loading: loadingSuggestions }] = useLazyQuery(
        SEARCH_SUGGESTIONS_QUERY,
        { fetchPolicy: 'cache-first' }
    );

    /** Productos sugeridos del resultado de la query */
    const suggestions: SuggestionProduct[] = suggestionsData?.products?.items || [];

    /** Determinar si mostrar el dropdown de sugerencias */
    const showDropdown = showSuggestions && isFocused && query.length >= 2 && (suggestions.length > 0 || loadingSuggestions);

    /**
     * Efecto debounce para buscar sugerencias
     * Espera 300ms despues de que el usuario deje de escribir
     */
    useEffect(() => {
        if (!showSuggestions || query.length < 2) return;

        const timer = setTimeout(() => {
            getSuggestions({ variables: { term: query, take: maxSuggestions } });
        }, 300);

        return () => clearTimeout(timer);
    }, [query, getSuggestions, showSuggestions, maxSuggestions]);

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
    const executeSearch = useCallback(() => {
        if (query.trim()) {
            setIsFocused(false);
            if (onSearch) {
                onSearch(query);
            } else {
                router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
            }
        }
    }, [query, onSearch, router]);

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
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    navigateToProduct(suggestions[selectedIndex].slug);
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
    const wrapperClasses = [styles.searchWrapper, className].filter(Boolean).join(' ');

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
                        onClick={executeSearch}
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
                    {loadingSuggestions ? (
                        <div className={styles.suggestionsLoading}>
                            <span className={styles.loadingSpinner} />
                            <span>Buscando...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            {suggestions.map((product, index) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    className={`${styles.suggestionItem} ${index === selectedIndex ? styles.suggestionSelected : ''}`}
                                    onClick={() => navigateToProduct(product.slug)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                >
                                    {/* Imagen del producto */}
                                    <div className={styles.suggestionImage}>
                                        {product.featuredAsset ? (
                                            <Image
                                                src={product.featuredAsset.preview}
                                                alt=""
                                                width={40}
                                                height={40}
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
                                        <span className={styles.suggestionName}>{product.name}</span>
                                        {product.variants[0] && (
                                            <span className={styles.suggestionPrice}>
                                                {formatPrice(product.variants[0].priceWithTax)}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}

                            {/* Link ver todos los resultados */}
                            <button
                                type="button"
                                className={styles.viewAllResults}
                                onClick={executeSearch}
                            >
                                Ver todos los resultados para "{query}"
                            </button>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default ProductSearch;
