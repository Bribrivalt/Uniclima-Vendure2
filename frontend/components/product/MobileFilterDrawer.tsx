'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/core';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import styles from './MobileFilterDrawer.module.css';

/**
 * Opción de filtro
 */
export interface FilterOption {
    /** Identificador único */
    id: string;
    /** Etiqueta visible */
    label: string;
    /** Número de productos con este filtro */
    count?: number;
    /** Si la opción está seleccionada */
    selected?: boolean;
}

/**
 * Grupo de filtros
 */
export interface FilterGroup {
    /** Identificador único del grupo */
    id: string;
    /** Título del grupo */
    title: string;
    /** Opciones de filtro */
    options: FilterOption[];
    /** Tipo de filtro (checkbox, radio, range) */
    type?: 'checkbox' | 'radio' | 'range';
}

/**
 * Props del componente MobileFilterDrawer
 */
export interface MobileFilterDrawerProps {
    /** Si el drawer está abierto */
    isOpen: boolean;
    /** Callback para cerrar el drawer */
    onClose: () => void;
    /** Grupos de filtros disponibles */
    filters: FilterGroup[];
    /** Callback cuando cambia una selección */
    onFilterChange: (groupId: string, optionId: string, selected: boolean) => void;
    /** Callback para aplicar filtros */
    onApply: () => void;
    /** Callback para limpiar todos los filtros */
    onClear: () => void;
    /** Número de resultados actuales */
    resultCount?: number;
    /** Clases CSS adicionales */
    className?: string;
}

/**
 * MobileFilterDrawer - Drawer lateral de filtros para móvil
 * 
 * Componente que muestra los filtros de productos en un drawer
 * lateral optimizado para dispositivos móviles.
 * 
 * @example
 * ```tsx
 * <MobileFilterDrawer
 *   isOpen={isFilterOpen}
 *   onClose={() => setIsFilterOpen(false)}
 *   filters={productFilters}
 *   onFilterChange={handleFilterChange}
 *   onApply={handleApplyFilters}
 *   onClear={handleClearFilters}
 *   resultCount={totalProducts}
 * />
 * ```
 */
export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onApply,
    onClear,
    resultCount,
    className,
}) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Activar focus trap cuando el drawer está abierto
    useFocusTrap(drawerRef, isOpen);

    /**
     * Cerrar el drawer con la tecla Escape
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            closeButtonRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    /**
     * Cuenta el número total de filtros seleccionados
     */
    const selectedCount = filters.reduce((total, group) => {
        return total + group.options.filter(opt => opt.selected).length;
    }, 0);

    /**
     * Maneja el clic en aplicar filtros
     */
    const handleApply = () => {
        onApply();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={styles.overlay}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`${styles.drawer} ${className || ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Filtros de productos"
            >
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Filtros
                        {selectedCount > 0 && (
                            <span className={styles.badge}>{selectedCount}</span>
                        )}
                    </h2>
                    <button
                        ref={closeButtonRef}
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={styles.closeIcon}
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido de filtros */}
                <div className={styles.content}>
                    {filters.map((group) => (
                        <div key={group.id} className={styles.filterGroup}>
                            <h3 className={styles.groupTitle}>{group.title}</h3>
                            <div className={styles.options}>
                                {group.options.map((option) => (
                                    <label
                                        key={option.id}
                                        className={styles.option}
                                    >
                                        <input
                                            type={group.type === 'radio' ? 'radio' : 'checkbox'}
                                            name={group.type === 'radio' ? group.id : undefined}
                                            checked={option.selected || false}
                                            onChange={(e) => onFilterChange(group.id, option.id, e.target.checked)}
                                            className={styles.checkbox}
                                        />
                                        <span className={styles.optionLabel}>
                                            {option.label}
                                            {option.count !== undefined && (
                                                <span className={styles.optionCount}>({option.count})</span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer con acciones */}
                <div className={styles.footer}>
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClear}
                        disabled={selectedCount === 0}
                        className={styles.clearButton}
                    >
                        Limpiar filtros
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleApply}
                        className={styles.applyButton}
                    >
                        Ver resultados
                        {resultCount !== undefined && ` (${resultCount})`}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default MobileFilterDrawer;