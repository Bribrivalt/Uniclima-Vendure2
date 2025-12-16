/**
 * RangeSlider Component - Uniclima
 * 
 * Slider de rango dual para filtros de precio y otros valores numéricos.
 * Características:
 * - Dos handles para min/max
 * - Diseño responsive
 * - Soporte para entrada manual de valores
 * - Animaciones suaves
 * - Accesibilidad completa
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './RangeSlider.module.css';

export interface RangeSliderProps {
    /** Valor mínimo absoluto */
    min: number;
    /** Valor máximo absoluto */
    max: number;
    /** Valor mínimo actual */
    minValue: number;
    /** Valor máximo actual */
    maxValue: number;
    /** Paso de incremento */
    step?: number;
    /** Callback cuando cambian los valores */
    onChange: (min: number, max: number) => void;
    /** Mostrar inputs numéricos */
    showInputs?: boolean;
    /** Prefijo para mostrar (ej: '€') */
    prefix?: string;
    /** Sufijo para mostrar (ej: 'kW') */
    suffix?: string;
    /** Etiqueta para accesibilidad */
    label?: string;
    /** Formatear valores para display */
    formatValue?: (value: number) => string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * RangeSlider - Slider de rango dual
 */
export function RangeSlider({
    min,
    max,
    minValue,
    maxValue,
    step = 1,
    onChange,
    showInputs = true,
    prefix = '',
    suffix = '',
    label = 'Rango',
    formatValue,
    className,
}: RangeSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const [localMinValue, setLocalMinValue] = useState(minValue);
    const [localMaxValue, setLocalMaxValue] = useState(maxValue);

    // Sincronizar valores locales cuando cambian los props
    useEffect(() => {
        setLocalMinValue(minValue);
        setLocalMaxValue(maxValue);
    }, [minValue, maxValue]);

    /**
     * Formatea un valor para mostrar
     */
    const displayValue = useCallback((value: number) => {
        if (formatValue) return formatValue(value);
        return `${prefix}${value.toLocaleString('es-ES')}${suffix}`;
    }, [formatValue, prefix, suffix]);

    /**
     * Calcula el porcentaje de una posición en el track
     */
    const calculatePercentage = useCallback((value: number) => {
        return ((value - min) / (max - min)) * 100;
    }, [min, max]);

    /**
     * Calcula el valor desde una posición en el track
     */
    const calculateValueFromPosition = useCallback((clientX: number) => {
        if (!trackRef.current) return min;

        const rect = trackRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const value = min + (percentage / 100) * (max - min);

        // Redondear al step más cercano
        return Math.round(value / step) * step;
    }, [min, max, step]);

    /**
     * Maneja el inicio del arrastre
     */
    const handleMouseDown = useCallback((handle: 'min' | 'max') => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(handle);
    }, []);

    /**
     * Maneja el movimiento durante el arrastre
     */
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        const newValue = calculateValueFromPosition(e.clientX);

        if (isDragging === 'min') {
            const clampedValue = Math.min(newValue, localMaxValue - step);
            setLocalMinValue(Math.max(min, clampedValue));
        } else {
            const clampedValue = Math.max(newValue, localMinValue + step);
            setLocalMaxValue(Math.min(max, clampedValue));
        }
    }, [isDragging, calculateValueFromPosition, localMaxValue, localMinValue, min, max, step]);

    /**
     * Maneja el fin del arrastre
     */
    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            onChange(localMinValue, localMaxValue);
            setIsDragging(null);
        }
    }, [isDragging, localMinValue, localMaxValue, onChange]);

    // Event listeners para el arrastre
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove as any);
            window.addEventListener('touchend', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleTouchMove as any);
                window.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    /**
     * Maneja el inicio del touch
     */
    const handleTouchStart = useCallback((handle: 'min' | 'max') => (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(handle);
    }, []);

    /**
     * Maneja el movimiento del touch
     */
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging || !e.touches[0]) return;

        const newValue = calculateValueFromPosition(e.touches[0].clientX);

        if (isDragging === 'min') {
            const clampedValue = Math.min(newValue, localMaxValue - step);
            setLocalMinValue(Math.max(min, clampedValue));
        } else {
            const clampedValue = Math.max(newValue, localMinValue + step);
            setLocalMaxValue(Math.min(max, clampedValue));
        }
    }, [isDragging, calculateValueFromPosition, localMaxValue, localMinValue, min, max, step]);

    /**
     * Maneja cambio en el input numérico
     */
    const handleInputChange = useCallback((type: 'min' | 'max', value: string) => {
        const numValue = parseInt(value) || 0;

        if (type === 'min') {
            const clampedValue = Math.max(min, Math.min(numValue, localMaxValue - step));
            setLocalMinValue(clampedValue);
            onChange(clampedValue, localMaxValue);
        } else {
            const clampedValue = Math.min(max, Math.max(numValue, localMinValue + step));
            setLocalMaxValue(clampedValue);
            onChange(localMinValue, clampedValue);
        }
    }, [min, max, localMinValue, localMaxValue, step, onChange]);

    /**
     * Maneja click en el track para mover el handle más cercano
     */
    const handleTrackClick = useCallback((e: React.MouseEvent) => {
        const newValue = calculateValueFromPosition(e.clientX);

        // Determinar qué handle mover basado en la proximidad
        const distanceToMin = Math.abs(newValue - localMinValue);
        const distanceToMax = Math.abs(newValue - localMaxValue);

        if (distanceToMin < distanceToMax) {
            const clampedValue = Math.min(newValue, localMaxValue - step);
            setLocalMinValue(Math.max(min, clampedValue));
            onChange(Math.max(min, clampedValue), localMaxValue);
        } else {
            const clampedValue = Math.max(newValue, localMinValue + step);
            setLocalMaxValue(Math.min(max, clampedValue));
            onChange(localMinValue, Math.min(max, clampedValue));
        }
    }, [calculateValueFromPosition, localMinValue, localMaxValue, min, max, step, onChange]);

    const minPercent = calculatePercentage(localMinValue);
    const maxPercent = calculatePercentage(localMaxValue);

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {/* Labels de rango */}
            <div className={styles.rangeLabels}>
                <span className={styles.rangeLabel}>{displayValue(localMinValue)}</span>
                <span className={styles.rangeSeparator}>—</span>
                <span className={styles.rangeLabel}>{displayValue(localMaxValue)}</span>
            </div>

            {/* Slider Track */}
            <div
                ref={trackRef}
                className={styles.track}
                onClick={handleTrackClick}
            >
                {/* Filled Range */}
                <div
                    className={styles.range}
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`,
                    }}
                />

                {/* Min Handle */}
                <div
                    className={`${styles.handle} ${isDragging === 'min' ? styles.active : ''}`}
                    style={{ left: `${minPercent}%` }}
                    onMouseDown={handleMouseDown('min')}
                    onTouchStart={handleTouchStart('min')}
                    role="slider"
                    aria-label={`${label} mínimo`}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={localMinValue}
                    tabIndex={0}
                >
                    <div className={styles.handleInner} />
                </div>

                {/* Max Handle */}
                <div
                    className={`${styles.handle} ${isDragging === 'max' ? styles.active : ''}`}
                    style={{ left: `${maxPercent}%` }}
                    onMouseDown={handleMouseDown('max')}
                    onTouchStart={handleTouchStart('max')}
                    role="slider"
                    aria-label={`${label} máximo`}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={localMaxValue}
                    tabIndex={0}
                >
                    <div className={styles.handleInner} />
                </div>
            </div>

            {/* Inputs numéricos */}
            {showInputs && (
                <div className={styles.inputs}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Mín.</label>
                        <div className={styles.inputWrapper}>
                            {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
                            <input
                                type="number"
                                className={styles.input}
                                value={localMinValue}
                                min={min}
                                max={localMaxValue - step}
                                step={step}
                                onChange={(e) => handleInputChange('min', e.target.value)}
                                aria-label={`${label} mínimo`}
                            />
                            {suffix && <span className={styles.inputSuffix}>{suffix}</span>}
                        </div>
                    </div>

                    <span className={styles.inputSeparator}>-</span>

                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Máx.</label>
                        <div className={styles.inputWrapper}>
                            {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
                            <input
                                type="number"
                                className={styles.input}
                                value={localMaxValue}
                                min={localMinValue + step}
                                max={max}
                                step={step}
                                onChange={(e) => handleInputChange('max', e.target.value)}
                                aria-label={`${label} máximo`}
                            />
                            {suffix && <span className={styles.inputSuffix}>{suffix}</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* Etiquetas de min/max absolutos */}
            <div className={styles.limits}>
                <span className={styles.limitLabel}>{displayValue(min)}</span>
                <span className={styles.limitLabel}>{displayValue(max)}</span>
            </div>
        </div>
    );
}

export default RangeSlider;