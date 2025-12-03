'use client';

import React, { forwardRef, useId } from 'react';
import styles from './Checkbox.module.css';

/**
 * Props para el componente Checkbox
 * @interface CheckboxProps
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    /** Etiqueta del checkbox */
    label?: string;
    /** Texto de ayuda debajo del checkbox */
    helperText?: string;
    /** Estado de error */
    error?: boolean;
    /** Mensaje de error */
    errorMessage?: string;
    /** Tamaño del checkbox */
    size?: 'sm' | 'md';
    /** Estado indeterminado (ni checked ni unchecked) */
    indeterminate?: boolean;
}

/**
 * Checkbox - Componente de casilla de verificación reutilizable
 * 
 * Características:
 * - Soporte para estados: checked, unchecked, indeterminate
 * - Tamaños: sm, md
 * - Integración de label
 * - Mensajes de error y ayuda
 * - Accesible con ARIA labels
 * - Navegación por teclado
 * 
 * @example
 * ```tsx
 * // Básico
 * <Checkbox label="Acepto los términos" />
 * 
 * // Con estado controlado
 * <Checkbox 
 *   label="Suscribirse al newsletter" 
 *   checked={isSubscribed}
 *   onChange={(e) => setIsSubscribed(e.target.checked)}
 * />
 * 
 * // Con error
 * <Checkbox 
 *   label="Acepto la política de privacidad" 
 *   error 
 *   errorMessage="Debes aceptar para continuar"
 * />
 * 
 * // Indeterminado (para selección parcial)
 * <Checkbox label="Seleccionar todos" indeterminate />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            label,
            helperText,
            error = false,
            errorMessage,
            size = 'md',
            indeterminate = false,
            disabled = false,
            className,
            id,
            ...props
        },
        ref
    ) => {
        // Generar ID único si no se proporciona
        const generatedId = useId();
        const checkboxId = id || generatedId;

        // Referencia interna para manejar indeterminate
        const internalRef = React.useRef<HTMLInputElement>(null);

        // Combinar refs
        React.useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

        // Actualizar estado indeterminate
        React.useEffect(() => {
            if (internalRef.current) {
                internalRef.current.indeterminate = indeterminate;
            }
        }, [indeterminate]);

        // Clases CSS
        const wrapperClasses = [
            styles.wrapper,
            disabled && styles.disabled,
            className,
        ].filter(Boolean).join(' ');

        const checkboxClasses = [
            styles.checkbox,
            styles[size],
            error && styles.error,
        ].filter(Boolean).join(' ');

        return (
            <div className={wrapperClasses}>
                <label className={styles.label} htmlFor={checkboxId}>
                    <input
                        ref={internalRef}
                        type="checkbox"
                        id={checkboxId}
                        className={checkboxClasses}
                        disabled={disabled}
                        aria-invalid={error}
                        aria-describedby={
                            errorMessage
                                ? `${checkboxId}-error`
                                : helperText
                                    ? `${checkboxId}-helper`
                                    : undefined
                        }
                        {...props}
                    />

                    {/* Checkbox visual personalizado */}
                    <span className={styles.checkmark} aria-hidden="true">
                        {indeterminate ? (
                            // Icono de indeterminado (línea horizontal)
                            <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={styles.icon}
                            >
                                <path
                                    d="M4 8H12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        ) : (
                            // Icono de check
                            <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={styles.icon}
                            >
                                <path
                                    d="M13.5 4.5L6.5 11.5L3 8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </span>

                    {/* Texto del label */}
                    {label && <span className={styles.labelText}>{label}</span>}
                </label>

                {/* Mensaje de error */}
                {error && errorMessage && (
                    <span
                        id={`${checkboxId}-error`}
                        className={styles.errorMessage}
                        role="alert"
                    >
                        {errorMessage}
                    </span>
                )}

                {/* Texto de ayuda */}
                {!error && helperText && (
                    <span
                        id={`${checkboxId}-helper`}
                        className={styles.helperText}
                    >
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;