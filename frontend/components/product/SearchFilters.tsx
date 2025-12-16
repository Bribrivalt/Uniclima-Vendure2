/**
 * SearchFilters - Componente de filtros avanzados para búsqueda
 * 
 * Funcionalidades:
 * - Filtro por rango de precios
 * - Filtro por categorías/colecciones
 * - Filtro por marcas
 * - Filtro por características (WiFi, clase energética, etc.)
 * - Filtros rápidos predefinidos
 * 
 * @module SearchFilters
 * @version 1.0.0
 */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import styles from './SearchFilters.module.css';

/**
 * Query para obtener facets disponibles
 */
const GET_FACETS_QUERY = gql`
    query GetFacets {
        facets {
            items {
                id
                code
                name
                values {
                    id
                    code
                    name
                }
            }
        }
    }
`;

/**
 * Query para obtener facets con contadores de productos
 */
const SEARCH_FACET_VALUES_QUERY = gql`
    query SearchFacetValues($term: String, $facetValueIds: [ID!]) {
        search(
            input: {
                term: $term
                facetValueIds: $facetValueIds
                groupByProduct: true
                take: 0
            }
        ) {
            totalItems
            facetValues {
                facetValue {
                    id
                    code
                    name
                    facet {
                        id
                        code
                        name
                    }
                }
                count
            }
        }
    }
`;

/** Interface para un facet value */
interface FacetValue {
    id: string;
    code: string;
    name: string;
    count?: number;
    facet?: {
        id: string;
        code: string;
        name: string;
    };
}

/** Interface para un facet */
interface Facet {
    id: string;
    code: string;
    name: string;
    values: FacetValue[];
}

/** Interface para los filtros seleccionados */
export interface SelectedFilters {
    priceMin?: number;
    priceMax?: number;
    facetValueIds: string[];
    categories: string[];
    brands: string[];
}

/** Props del componente */
export interface SearchFiltersProps {
    /** Término de búsqueda actual */
    searchTerm?: string;
    /** Filtros actualmente seleccionados */
    selectedFilters: SelectedFilters;
    /** Callback cuando cambian los filtros */
    onFiltersChange: (filters: SelectedFilters) => void;
    /** Callback para limpiar todos los filtros */
    onClearFilters: () => void;
    /** Mostrar como drawer en móvil */
    isMobileDrawer?: boolean;
    /** Callback para cerrar drawer */
    onClose?: () => void;
}

/** Rangos de precio predefinidos */
const PRICE_RANGES = [
    { label: 'Todos los precios', min: 0, max: Infinity },
    { label: 'Menos de 100€', min: 0, max: 10000 },
    { label: '100€ - 300€', min: 10000, max: 30000 },
    { label: '300€ - 500€', min: 30000, max: 50000 },
    { label: '500€ - 1000€', min: 50000, max: 100000 },
    { label: 'Más de 1000€', min: 100000, max: Infinity },
];

/** Filtros rápidos predefinidos */
const QUICK_FILTERS = [
    { id: 'con-wifi', label: 'Con WiFi', icon: '📶' },
    { id: 'clase-a', label: 'Clase A+', icon: '⚡' },
    { id: 'envio-gratis', label: 'Envío gratis', icon: '🚚' },
    { id: 'oferta', label: 'En oferta', icon: '🏷️' },
];

/**
 * Formatea precio en céntimos a EUR
 */
const formatPrice = (cents: number): string => {
    if (cents === Infinity) return '∞';
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(cents / 100);
};

/**
 * SearchFilters Component
 */
export function SearchFilters({
    searchTerm = '',
    selectedFilters,
    onFiltersChange,
    onClearFilters,
    isMobileDrawer = false,
    onClose,
}: SearchFiltersProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'categories']));
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
        min: selectedFilters.priceMin || 0,
        max: selectedFilters.priceMax || Infinity,
    });
    const [customPriceMin, setCustomPriceMin] = useState('');
    const [customPriceMax, setCustomPriceMax] = useState('');

    /** Obtener facets disponibles */
    const { data: facetsData, loading: loadingFacets } = useQuery(GET_FACETS_QUERY);

    /** Obtener facets con contadores */
    const { data: searchFacetsData, loading: loadingSearchFacets } = useQuery(SEARCH_FACET_VALUES_QUERY, {
        variables: {
            term: searchTerm,
            facetValueIds: selectedFilters.facetValueIds,
        },
    });

    /** Procesar facets con contadores */
    const facetsWithCounts = useMemo(() => {
        const baseFacets: Facet[] = facetsData?.facets?.items || [];
        const searchFacetValues = searchFacetsData?.search?.facetValues || [];

        // Crear mapa de contadores
        const countsMap = new Map<string, number>();
        searchFacetValues.forEach((item: { facetValue: FacetValue; count: number }) => {
            countsMap.set(item.facetValue.id, item.count);
        });

        // Añadir contadores a facets
        return baseFacets.map(facet => ({
            ...facet,
            values: facet.values.map(value => ({
                ...value,
                count: countsMap.get(value.id) || 0,
            })),
        }));
    }, [facetsData, searchFacetsData]);

    /** Separar facets por tipo */
    const categoryFacets = facetsWithCounts.find(f => f.code === 'categoria' || f.code === 'category');
    const brandFacets = facetsWithCounts.find(f => f.code === 'marca' || f.code === 'brand');
    const otherFacets = facetsWithCounts.filter(f =>
        f.code !== 'categoria' && f.code !== 'category' &&
        f.code !== 'marca' && f.code !== 'brand'
    );

    /** Toggle sección expandida */
    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    }, []);

    /** Manejar cambio de rango de precio predefinido */
    const handlePriceRangeChange = useCallback((min: number, max: number) => {
        setPriceRange({ min, max });
        onFiltersChange({
            ...selectedFilters,
            priceMin: min === 0 ? undefined : min,
            priceMax: max === Infinity ? undefined : max,
        });
    }, [selectedFilters, onFiltersChange]);

    /** Manejar precio personalizado */
    const handleCustomPriceApply = useCallback(() => {
        const min = customPriceMin ? parseFloat(customPriceMin) * 100 : 0;
        const max = customPriceMax ? parseFloat(customPriceMax) * 100 : Infinity;
        handlePriceRangeChange(min, max);
    }, [customPriceMin, customPriceMax, handlePriceRangeChange]);

    /** Manejar cambio de facet value */
    const handleFacetValueChange = useCallback((facetValueId: string, checked: boolean) => {
        const currentIds = selectedFilters.facetValueIds;
        let newIds: string[];

        if (checked) {
            newIds = [...currentIds, facetValueId];
        } else {
            newIds = currentIds.filter(id => id !== facetValueId);
        }

        onFiltersChange({
            ...selectedFilters,
            facetValueIds: newIds,
        });
    }, [selectedFilters, onFiltersChange]);

    /** Contar filtros activos */
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedFilters.priceMin || selectedFilters.priceMax) count++;
        count += selectedFilters.facetValueIds.length;
        return count;
    }, [selectedFilters]);

    /** Clases del contenedor */
    const containerClasses = [
        styles.filtersContainer,
        isMobileDrawer ? styles.mobileDrawer : '',
    ].filter(Boolean).join(' ');

    return (
        <aside className={containerClasses}>
            {/* Header */}
            <div className={styles.filtersHeader}>
                <h2 className={styles.filtersTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                    </svg>
                    Filtros
                    {activeFilterCount > 0 && (
                        <span className={styles.activeCount}>{activeFilterCount}</span>
                    )}
                </h2>
                {isMobileDrawer && onClose && (
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar filtros">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Limpiar filtros */}
            {activeFilterCount > 0 && (
                <button className={styles.clearAllBtn} onClick={onClearFilters}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Limpiar todos los filtros
                </button>
            )}

            {/* Filtros rápidos */}
            <div className={styles.quickFilters}>
                <span className={styles.quickFiltersLabel}>Filtros rápidos:</span>
                <div className={styles.quickFilterTags}>
                    {QUICK_FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            className={styles.quickFilterTag}
                            onClick={() => {
                                // Implementar lógica de filtros rápidos
                            }}
                        >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sección de Precio */}
            <div className={styles.filterSection}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection('price')}
                    aria-expanded={expandedSections.has('price')}
                >
                    <span className={styles.sectionTitle}>💰 Precio</span>
                    <svg
                        className={`${styles.chevron} ${expandedSections.has('price') ? styles.expanded : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6,9 12,15 18,9" />
                    </svg>
                </button>
                {expandedSections.has('price') && (
                    <div className={styles.sectionContent}>
                        {/* Rangos predefinidos */}
                        <div className={styles.priceRanges}>
                            {PRICE_RANGES.map((range, index) => (
                                <label key={index} className={styles.priceRangeOption}>
                                    <input
                                        type="radio"
                                        name="priceRange"
                                        checked={priceRange.min === range.min && priceRange.max === range.max}
                                        onChange={() => handlePriceRangeChange(range.min, range.max)}
                                    />
                                    <span className={styles.radioLabel}>{range.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Rango personalizado */}
                        <div className={styles.customPriceRange}>
                            <span className={styles.customPriceLabel}>Rango personalizado:</span>
                            <div className={styles.customPriceInputs}>
                                <input
                                    type="number"
                                    placeholder="Min €"
                                    value={customPriceMin}
                                    onChange={(e) => setCustomPriceMin(e.target.value)}
                                    className={styles.priceInput}
                                />
                                <span className={styles.priceSeparator}>-</span>
                                <input
                                    type="number"
                                    placeholder="Max €"
                                    value={customPriceMax}
                                    onChange={(e) => setCustomPriceMax(e.target.value)}
                                    className={styles.priceInput}
                                />
                                <button
                                    className={styles.applyPriceBtn}
                                    onClick={handleCustomPriceApply}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Categorías */}
            {categoryFacets && categoryFacets.values.length > 0 && (
                <div className={styles.filterSection}>
                    <button
                        className={styles.sectionHeader}
                        onClick={() => toggleSection('categories')}
                        aria-expanded={expandedSections.has('categories')}
                    >
                        <span className={styles.sectionTitle}>📂 Categorías</span>
                        <svg
                            className={`${styles.chevron} ${expandedSections.has('categories') ? styles.expanded : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="6,9 12,15 18,9" />
                        </svg>
                    </button>
                    {expandedSections.has('categories') && (
                        <div className={styles.sectionContent}>
                            {categoryFacets.values.map(value => (
                                <label key={value.id} className={styles.checkboxOption}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.facetValueIds.includes(value.id)}
                                        onChange={(e) => handleFacetValueChange(value.id, e.target.checked)}
                                    />
                                    <span className={styles.checkboxLabel}>
                                        {value.name}
                                        {value.count !== undefined && (
                                            <span className={styles.valueCount}>({value.count})</span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Sección de Marcas */}
            {brandFacets && brandFacets.values.length > 0 && (
                <div className={styles.filterSection}>
                    <button
                        className={styles.sectionHeader}
                        onClick={() => toggleSection('brands')}
                        aria-expanded={expandedSections.has('brands')}
                    >
                        <span className={styles.sectionTitle}>🏷️ Marcas</span>
                        <svg
                            className={`${styles.chevron} ${expandedSections.has('brands') ? styles.expanded : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="6,9 12,15 18,9" />
                        </svg>
                    </button>
                    {expandedSections.has('brands') && (
                        <div className={styles.sectionContent}>
                            {brandFacets.values.map(value => (
                                <label key={value.id} className={styles.checkboxOption}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.facetValueIds.includes(value.id)}
                                        onChange={(e) => handleFacetValueChange(value.id, e.target.checked)}
                                    />
                                    <span className={styles.checkboxLabel}>
                                        {value.name}
                                        {value.count !== undefined && (
                                            <span className={styles.valueCount}>({value.count})</span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Otras facetas dinámicas */}
            {otherFacets.map(facet => (
                <div key={facet.id} className={styles.filterSection}>
                    <button
                        className={styles.sectionHeader}
                        onClick={() => toggleSection(facet.code)}
                        aria-expanded={expandedSections.has(facet.code)}
                    >
                        <span className={styles.sectionTitle}>{facet.name}</span>
                        <svg
                            className={`${styles.chevron} ${expandedSections.has(facet.code) ? styles.expanded : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="6,9 12,15 18,9" />
                        </svg>
                    </button>
                    {expandedSections.has(facet.code) && (
                        <div className={styles.sectionContent}>
                            {facet.values.map(value => (
                                <label key={value.id} className={styles.checkboxOption}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.facetValueIds.includes(value.id)}
                                        onChange={(e) => handleFacetValueChange(value.id, e.target.checked)}
                                    />
                                    <span className={styles.checkboxLabel}>
                                        {value.name}
                                        {value.count !== undefined && (
                                            <span className={styles.valueCount}>({value.count})</span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Botón aplicar en móvil */}
            {isMobileDrawer && (
                <div className={styles.mobileActions}>
                    <button className={styles.applyFiltersBtn} onClick={onClose}>
                        Ver {searchFacetsData?.search?.totalItems || 0} resultados
                    </button>
                </div>
            )}
        </aside>
    );
}

export default SearchFilters;