'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { RangeSlider } from '@/components/core/RangeSlider';
import styles from './ProductFilters.module.css';

/**
 * Interfaz para una opción de filtro
 */
export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

/**
 * Interfaz para un grupo de filtros (facet)
 */
export interface FilterGroup {
    id: string;
    name: string;
    type: 'checkbox' | 'radio' | 'range';
    options?: FilterOption[];
    min?: number;
    max?: number;
}

/**
 * Interfaz para los filtros activos
 */
export interface ActiveFilters {
    [key: string]: string[] | { min: number; max: number };
}

/**
 * Props para el componente ProductFilters
 * @interface ProductFiltersProps
 */
export interface ProductFiltersProps {
    /** Grupos de filtros disponibles */
    filterGroups: FilterGroup[];
    /** Filtros activos actualmente */
    activeFilters?: ActiveFilters;
    /** Callback cuando cambian los filtros */
    onFilterChange?: (filters: ActiveFilters) => void;
    /** Callback para limpiar todos los filtros */
    onClearFilters?: () => void;
    /** Mostrar en modo drawer para mobile */
    asDrawer?: boolean;
    /** Estado del drawer (solo si asDrawer=true) */
    isOpen?: boolean;
    /** Callback para cerrar el drawer */
    onClose?: () => void;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de chevron para colapsar grupos
 */
const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`${styles.chevron} ${expanded ? styles.expanded : ''}`}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

/**
 * Icono de X para cerrar drawer
 */
const CloseIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

/**
 * ProductFilters - Panel de filtros para productos
 * 
 * Características:
 * - Filtros por facets (checkbox, radio)
 * - Rango de precio
 * - Filtros activos con pills
 * - Limpiar filtros
 * - Grupos colapsables
 * - Modo drawer para mobile
 * 
 * @example
 * ```tsx
 * <ProductFilters
 *   filterGroups={[
 *     {
 *       id: 'brand',
 *       name: 'Marca',
 *       type: 'checkbox',
 *       options: [
 *         { value: 'daikin', label: 'Daikin', count: 15 },
 *         { value: 'mitsubishi', label: 'Mitsubishi', count: 12 },
 *       ]
 *     },
 *     {
 *       id: 'price',
 *       name: 'Precio',
 *       type: 'range',
 *       min: 0,
 *       max: 5000
 *     }
 *   ]}
 *   activeFilters={filters}
 *   onFilterChange={setFilters}
 * />
 * ```
 */
export function ProductFilters({
    filterGroups,
    activeFilters = {},
    onFilterChange,
    onClearFilters,
    asDrawer = false,
    isOpen = false,
    onClose,
    className,
}: ProductFiltersProps) {
    // Estado para grupos colapsados - TODOS CERRADOS POR DEFECTO
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

    // Actualizar grupos colapsados cuando cambian los filterGroups (por ejemplo, al cargar datos)
    useEffect(() => {
        if (filterGroups.length > 0) {
            setCollapsedGroups(prev => {
                const newSet = new Set(prev);
                // Añadir nuevos grupos como colapsados
                filterGroups.forEach(g => {
                    if (!prev.has(g.id)) {
                        newSet.add(g.id);
                    }
                });
                return newSet;
            });
        }
    }, [filterGroups]);

    // Toggle de colapso de grupo
    const toggleGroup = (groupId: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    // Handler para cambio de checkbox
    const handleCheckboxChange = (groupId: string, value: string, checked: boolean) => {
        const currentValues = (activeFilters[groupId] as string[]) || [];
        let newValues: string[];

        if (checked) {
            newValues = [...currentValues, value];
        } else {
            newValues = currentValues.filter(v => v !== value);
        }

        onFilterChange?.({
            ...activeFilters,
            [groupId]: newValues,
        });
    };

    // Handler para cambio de radio
    const handleRadioChange = (groupId: string, value: string) => {
        onFilterChange?.({
            ...activeFilters,
            [groupId]: [value],
        });
    };

    // Handler para cambio de rango
    const handleRangeChange = (groupId: string, type: 'min' | 'max', value: number) => {
        const currentRange = (activeFilters[groupId] as { min: number; max: number }) || { min: 0, max: 10000 };

        onFilterChange?.({
            ...activeFilters,
            [groupId]: {
                ...currentRange,
                [type]: value,
            },
        });
    };

    // Contar filtros activos
    const activeFilterCount = Object.values(activeFilters).reduce((count, value) => {
        if (Array.isArray(value)) {
            return count + value.length;
        }
        return count + 1;
    }, 0);

    // Obtener lista de filtros activos para pills
    const activeFilterPills = Object.entries(activeFilters).flatMap(([groupId, value]) => {
        const group = filterGroups.find(g => g.id === groupId);
        if (!group) return [];

        if (Array.isArray(value)) {
            return value.map(v => {
                const option = group.options?.find(o => o.value === v);
                return {
                    groupId,
                    value: v,
                    label: option?.label || v,
                    groupName: group.name,
                };
            });
        }
        return [];
    });

    // Contenido de los filtros
    const filtersContent = (
        <>
            {/* Header con título y limpiar */}
            <div className={styles.header}>
                <h3 className={styles.title}>Filtros</h3>
                {activeFilterCount > 0 && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={onClearFilters}
                    >
                        Limpiar todo ({activeFilterCount})
                    </button>
                )}
                {asDrawer && onClose && (
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    >
                        <CloseIcon />
                    </button>
                )}
            </div>

            {/* Pills de filtros activos */}
            {activeFilterPills.length > 0 && (
                <div className={styles.activePills}>
                    {activeFilterPills.map(pill => (
                        <button
                            key={`${pill.groupId}-${pill.value}`}
                            type="button"
                            className={styles.pill}
                            onClick={() => handleCheckboxChange(pill.groupId, pill.value, false)}
                            aria-label={`Eliminar filtro ${pill.label}`}
                        >
                            <span className={styles.pillText}>{pill.label}</span>
                            <svg className={styles.pillClose} viewBox="0 0 16 16" fill="currentColor">
                                <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    ))}
                </div>
            )}

            {/* Grupos de filtros */}
            <div className={styles.groups}>
                {filterGroups.map(group => {
                    const isCollapsed = collapsedGroups.has(group.id);

                    return (
                        <div key={group.id} className={styles.group}>
                            {/* Header del grupo */}
                            <button
                                type="button"
                                className={styles.groupHeader}
                                onClick={() => toggleGroup(group.id)}
                                aria-expanded={!isCollapsed}
                            >
                                <span className={styles.groupName}>{group.name}</span>
                                <ChevronIcon expanded={!isCollapsed} />
                            </button>

                            {/* Contenido del grupo */}
                            {!isCollapsed && (
                                <div className={styles.groupContent}>
                                    {/* Opciones de checkbox */}
                                    {group.type === 'checkbox' && group.options && (
                                        <div className={styles.options}>
                                            {group.options.map(option => {
                                                const isChecked = ((activeFilters[group.id] as string[]) || []).includes(option.value);

                                                return (
                                                    <label key={option.value} className={styles.option}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={e => handleCheckboxChange(group.id, option.value, e.target.checked)}
                                                            className={styles.checkbox}
                                                        />
                                                        <span className={styles.optionLabel}>{option.label}</span>
                                                        {option.count !== undefined && (
                                                            <span className={styles.optionCount}>({option.count})</span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Opciones de radio */}
                                    {group.type === 'radio' && group.options && (
                                        <div className={styles.options}>
                                            {group.options.map(option => {
                                                const isSelected = ((activeFilters[group.id] as string[]) || [])[0] === option.value;

                                                return (
                                                    <label key={option.value} className={styles.option}>
                                                        <input
                                                            type="radio"
                                                            name={group.id}
                                                            checked={isSelected}
                                                            onChange={() => handleRadioChange(group.id, option.value)}
                                                            className={styles.radio}
                                                        />
                                                        <span className={styles.optionLabel}>{option.label}</span>
                                                        {option.count !== undefined && (
                                                            <span className={styles.optionCount}>({option.count})</span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Rango de precio con slider visual */}
                                    {group.type === 'range' && (
                                        <div className={styles.rangeFilter}>
                                            <RangeSlider
                                                min={group.min || 0}
                                                max={group.max || 10000}
                                                minValue={(activeFilters[group.id] as { min: number; max: number })?.min || group.min || 0}
                                                maxValue={(activeFilters[group.id] as { min: number; max: number })?.max || group.max || 10000}
                                                step={10}
                                                prefix=""
                                                suffix="€"
                                                label={group.name}
                                                onChange={(min, max) => {
                                                    onFilterChange?.({
                                                        ...activeFilters,
                                                        [group.id]: { min, max },
                                                    });
                                                }}
                                                showInputs={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );

    // Clases CSS
    const containerClasses = [
        styles.container,
        asDrawer && styles.drawer,
        asDrawer && isOpen && styles.drawerOpen,
        className,
    ].filter(Boolean).join(' ');

    // Si es drawer, añadir overlay
    if (asDrawer) {
        return (
            <>
                {/* Overlay */}
                {isOpen && (
                    <div
                        className={styles.overlay}
                        onClick={onClose}
                        aria-hidden="true"
                    />
                )}

                {/* Drawer */}
                <aside className={containerClasses} aria-label="Filtros de productos">
                    {filtersContent}
                </aside>
            </>
        );
    }

    return (
        <aside className={containerClasses} aria-label="Filtros de productos">
            {filtersContent}
        </aside>
    );
}

export default ProductFilters;