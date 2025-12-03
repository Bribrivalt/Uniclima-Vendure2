'use client';

import React, { useState } from 'react';
import styles from './Rating.module.css';

/**
 * Props para el componente Rating
 * @interface RatingProps
 */
export interface RatingProps {
    /** Valor actual (0-5) */
    value: number;
    /** Callback cuando cambia el valor (hace el componente editable) */
    onChange?: (value: number) => void;
    /** Número máximo de estrellas */
    max?: number;
    /** Tamaño de las estrellas */
    size?: 'sm' | 'md' | 'lg';
    /** Permitir medias estrellas */
    allowHalf?: boolean;
    /** Solo lectura (no editable) */
    readOnly?: boolean;
    /** Mostrar el valor numérico */
    showValue?: boolean;
    /** Mostrar el contador de reseñas */
    count?: number;
    /** Color de las estrellas activas */
    color?: string;
    /** Deshabilitado */
    disabled?: boolean;
    /** Clase CSS adicional */
    className?: string;
    /** Label para accesibilidad */
    ariaLabel?: string;
}

/**
 * Icono de estrella vacía
 */
const StarEmpty = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

/**
 * Icono de estrella llena
 */
const StarFilled = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

/**
 * Icono de media estrella
 */
const StarHalf = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
            </linearGradient>
        </defs>
        <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill="url(#halfGradient)"
            stroke="currentColor"
            strokeWidth="2"
        />
    </svg>
);

/**
 * Rating - Componente de valoración con estrellas
 * 
 * Características:
 * - Read-only y editable
 * - Soporte para medias estrellas
 * - Tamaños: sm, md, lg
 * - Mostrar valor numérico y contador de reseñas
 * - Accesible con ARIA
 * 
 * @example
 * ```tsx
 * // Solo lectura
 * <Rating value={4.5} readOnly />
 * 
 * // Editable
 * <Rating 
 *   value={rating} 
 *   onChange={setRating}
 * />
 * 
 * // Con medias estrellas
 * <Rating 
 *   value={3.5} 
 *   allowHalf 
 *   onChange={setRating}
 * />
 * 
 * // Con contador de reseñas
 * <Rating 
 *   value={4.2} 
 *   showValue 
 *   count={125}
 *   readOnly
 * />
 * ```
 */
export function Rating({
    value,
    onChange,
    max = 5,
    size = 'md',
    allowHalf = false,
    readOnly = false,
    showValue = false,
    count,
    color,
    disabled = false,
    className,
    ariaLabel,
}: RatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Valor a mostrar (hover o actual)
    const displayValue = hoverValue !== null ? hoverValue : value;

    // Determinar si es interactivo
    const isInteractive = !readOnly && !disabled && onChange;

    // Handler de click
    const handleClick = (starValue: number) => {
        if (isInteractive) {
            onChange?.(starValue);
        }
    };

    // Handler de hover
    const handleMouseEnter = (starValue: number) => {
        if (isInteractive) {
            setHoverValue(starValue);
        }
    };

    // Handler de salir del hover
    const handleMouseLeave = () => {
        if (isInteractive) {
            setHoverValue(null);
        }
    };

    // Handler de teclado
    const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
        if (!isInteractive) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange?.(starValue);
        } else if (e.key === 'ArrowRight' && value < max) {
            e.preventDefault();
            onChange?.(Math.min(max, value + (allowHalf ? 0.5 : 1)));
        } else if (e.key === 'ArrowLeft' && value > 0) {
            e.preventDefault();
            onChange?.(Math.max(0, value - (allowHalf ? 0.5 : 1)));
        }
    };

    // Generar array de estrellas
    const stars = Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const halfValue = index + 0.5;

        // Determinar el estado de la estrella
        let starState: 'empty' | 'half' | 'full' = 'empty';
        if (displayValue >= starValue) {
            starState = 'full';
        } else if (allowHalf && displayValue >= halfValue) {
            starState = 'half';
        }

        return { index, starValue, halfValue, starState };
    });

    // Clases CSS
    const ratingClasses = [
        styles.rating,
        styles[size],
        isInteractive && styles.interactive,
        disabled && styles.disabled,
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            className={ratingClasses}
            role="group"
            aria-label={ariaLabel || `Valoración: ${value} de ${max} estrellas`}
        >
            {/* Estrellas */}
            <div className={styles.stars}>
                {stars.map(({ index, starValue, halfValue, starState }) => (
                    <span
                        key={index}
                        className={`${styles.star} ${styles[starState]}`}
                        style={color ? { color } : undefined}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(allowHalf ? halfValue : starValue)}
                        onMouseMove={(e) => {
                            if (allowHalf && isInteractive) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                                setHoverValue(isLeftHalf ? halfValue : starValue);
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                        onKeyDown={(e) => handleKeyDown(e, starValue)}
                        tabIndex={isInteractive ? 0 : -1}
                        role={isInteractive ? 'button' : 'presentation'}
                        aria-label={isInteractive ? `${starValue} estrellas` : undefined}
                    >
                        {starState === 'full' && <StarFilled />}
                        {starState === 'half' && <StarHalf />}
                        {starState === 'empty' && <StarEmpty />}
                    </span>
                ))}
            </div>

            {/* Valor numérico */}
            {showValue && (
                <span className={styles.value}>
                    {value.toFixed(1)}
                </span>
            )}

            {/* Contador de reseñas */}
            {count !== undefined && (
                <span className={styles.count}>
                    ({count} {count === 1 ? 'reseña' : 'reseñas'})
                </span>
            )}
        </div>
    );
}

export default Rating;