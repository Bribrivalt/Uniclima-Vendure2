import React, { forwardRef, useId } from 'react';
import styles from './Input.module.css';

/**
 * Props del componente Input
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Texto del label */
    label?: string;
    /** Mensaje de error */
    error?: string;
    /** Texto de ayuda */
    helperText?: string;
    /** Si el input ocupa todo el ancho disponible */
    fullWidth?: boolean;
    /** Icono a mostrar dentro del input */
    icon?: React.ReactNode;
}

/**
 * Input - Campo de entrada de texto reutilizable
 *
 * Componente de formulario con soporte para labels, validación,
 * iconos y estados de error.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="tu@email.com"
 *   error={errors.email}
 *   required
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = false,
            icon,
            className = '',
            id,
            required,
            ...props
        },
        ref
    ) => {
        // useId genera IDs estables entre servidor y cliente
        const generatedId = useId();
        const inputId = id || `input-${generatedId}`;
        const hasError = Boolean(error);

        const containerClassNames = [
            styles.container,
            fullWidth ? styles.fullWidth : '',
        ]
            .filter(Boolean)
            .join(' ');

        const inputClassNames = [
            styles.input,
            hasError ? styles.error : '',
            icon ? styles.withIcon : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClassNames}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}

                <div className={styles.inputWrapper}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={inputClassNames}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        {...props}
                    />
                </div>

                {error && (
                    <p id={`${inputId}-error`} className={styles.errorText}>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
