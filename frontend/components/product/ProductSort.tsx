/**
 * ProductSort - Selector de ordenamiento de productos
 *
 * Permite al usuario seleccionar como ordenar los productos.
 * Soporta opciones personalizadas o las opciones por defecto.
 *
 * @module ProductSort
 * @version 2.0.0
 */
'use client';

import styles from './ProductSort.module.css';

/** Tipo de opcion de ordenacion por defecto */
export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'relevance' | 'newest';

/** Interface para opcion personalizada */
export interface SortOptionItem {
    value: string;
    label: string;
}

/** Props del componente ProductSort */
export interface ProductSortProps {
    /** Valor actual de ordenacion */
    value: string;
    /** Callback cuando cambia la ordenacion */
    onChange: (value: string) => void;
    /** Opciones personalizadas (opcional) */
    options?: SortOptionItem[];
    /** Clase CSS adicional */
    className?: string;
}

/** Opciones de ordenacion por defecto */
const DEFAULT_OPTIONS: SortOptionItem[] = [
    { value: 'name-asc', label: 'Nombre (A-Z)' },
    { value: 'name-desc', label: 'Nombre (Z-A)' },
    { value: 'price-asc', label: 'Precio (menor a mayor)' },
    { value: 'price-desc', label: 'Precio (mayor a menor)' },
];

/**
 * ProductSort - Selector de ordenamiento de productos
 *
 * @example
 * ```tsx
 * <ProductSort
 *   value={sortBy}
 *   onChange={handleSortChange}
 *   options={[
 *     { value: 'relevance', label: 'Mas relevantes' },
 *     { value: 'price-asc', label: 'Precio: menor a mayor' },
 *   ]}
 * />
 * ```
 */
export function ProductSort({
    value,
    onChange,
    options = DEFAULT_OPTIONS,
    className,
}: ProductSortProps) {
    const containerClasses = [styles.sortContainer, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <label htmlFor="product-sort" className={styles.label}>
                Ordenar por:
            </label>
            <select
                id="product-sort"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.select}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ProductSort;
