/**
 * QuantitySelector Component - Uniclima
 * 
 * Selector de cantidad mejorado con animaciones y feedback visual.
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './QuantitySelector.module.css';

export interface QuantitySelectorProps {
    /** Valor actual */
    value: number;
    /** Valor mínimo */
    min?: number;
    /** Valor máximo */
    max?: number;
    /** Paso de incremento */
    step?: number;
    /** Callback cuando cambia el valor */
    onChange: (value: number) => void;
    /** Tamaño del selector */
    size?: 'sm' | 'md' | 'lg';
    /** Deshabilitar el selector */
    disabled?: boolean;
    /** Mostrar controles inline o apilados */
    variant?: 'inline' | 'stacked';
    /** Mostrar stock disponible */
    stockLevel?: number;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * QuantitySelector - Selector de cantidad profesional
 */
export function QuantitySelector({
    value,
    min = 1,
    max = 99,
    step = 1,
    onChange,
    size = 'md',
    disabled = false,
    variant = 'inline',
    stockLevel,
    className,
}: QuantitySelectorProps) {
    const [inputValue, setInputValue] = useState(value.toString());
    const [isAnimating, setIsAnimating] = useState<'up' | 'down' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincronizar input con value
    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    /**
     * Incrementar cantidad
     */
    const increment = useCallback(() => {
        if (disabled || value >= max) return;
        const newValue = Math.min(max, value + step);
        onChange(newValue);
        setIsAnimating('up');
        setTimeout(() => setIsAnimating(null), 200);
    }, [disabled, value, max, step, onChange]);

    /**
     * Decrementar cantidad
     */
    const decrement = useCallback(() => {
        if (disabled || value <= min) return;
        const newValue = Math.max(min, value - step);
        onChange(newValue);
        setIsAnimating('down');
        setTimeout(() => setIsAnimating(null), 200);
    }, [disabled, value, min, step, onChange]);

    /**
     * Manejar cambio de input
     */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        const numValue = parseInt(rawValue);
        if (!isNaN(numValue)) {
            const clampedValue = Math.max(min, Math.min(max, numValue));
            onChange(clampedValue);
        }
    }, [min, max, onChange]);

    /**
     * Manejar blur del input
     */
    const handleBlur = useCallback(() => {
        const numValue = parseInt(inputValue);
        if (isNaN(numValue) || numValue < min) {
            setInputValue(min.toString());
            onChange(min);
        } else if (numValue > max) {
            setInputValue(max.toString());
            onChange(max);
        } else {
            setInputValue(numValue.toString());
            onChange(numValue);
        }
    }, [inputValue, min, max, onChange]);

    /**
     * Manejar teclas
     */
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            increment();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            decrement();
        } else if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    }, [increment, decrement]);

    /**
     * Seleccionar todo el texto al hacer focus
     */
    const handleFocus = useCallback(() => {
        inputRef.current?.select();
    }, []);

    const containerClasses = [
        styles.container,
        styles[`size-${size}`],
        styles[`variant-${variant}`],
        disabled && styles.disabled,
        className,
    ].filter(Boolean).join(' ');

    const valueClasses = [
        styles.valueWrapper,
        isAnimating === 'up' && styles.animateUp,
        isAnimating === 'down' && styles.animateDown,
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Botón decrementar */}
            <button
                type="button"
                className={`${styles.button} ${styles.decrementButton}`}
                onClick={decrement}
                disabled={disabled || value <= min}
                aria-label="Reducir cantidad"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            {/* Input de valor */}
            <div className={valueClasses}>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className={styles.input}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-label="Cantidad"
                    min={min}
                    max={max}
                />
            </div>

            {/* Botón incrementar */}
            <button
                type="button"
                className={`${styles.button} ${styles.incrementButton}`}
                onClick={increment}
                disabled={disabled || value >= max}
                aria-label="Aumentar cantidad"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            {/* Indicador de stock */}
            {stockLevel !== undefined && stockLevel > 0 && stockLevel <= 5 && (
                <span className={styles.stockWarning}>
                    ¡Solo quedan {stockLevel}!
                </span>
            )}
        </div>
    );
}

export default QuantitySelector;