'use client';

import React, { forwardRef, useId, createContext, useContext } from 'react';
import styles from './Radio.module.css';

/**
 * Contexto para compartir estado entre RadioGroup y Radio
 */
interface RadioGroupContextValue {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
    error?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * Props para el componente RadioGroup
 * @interface RadioGroupProps
 */
export interface RadioGroupProps {
    /** Nombre del grupo (para agrupar radios) */
    name: string;
    /** Valor seleccionado actualmente */
    value?: string;
    /** Callback cuando cambia la selección */
    onChange?: (value: string) => void;
    /** Hijos (componentes Radio) */
    children: React.ReactNode;
    /** Etiqueta del grupo */
    label?: string;
    /** Estado deshabilitado para todo el grupo */
    disabled?: boolean;
    /** Tamaño de los radios */
    size?: 'sm' | 'md';
    /** Orientación del grupo */
    orientation?: 'horizontal' | 'vertical';
    /** Estado de error */
    error?: boolean;
    /** Mensaje de error */
    errorMessage?: string;
    /** Texto de ayuda */
    helperText?: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * RadioGroup - Contenedor para agrupar opciones de Radio
 * 
 * @example
 * ```tsx
 * <RadioGroup 
 *   name="payment" 
 *   value={selectedPayment} 
 *   onChange={setSelectedPayment}
 *   label="Método de pago"
 * >
 *   <Radio value="card" label="Tarjeta de crédito" />
 *   <Radio value="paypal" label="PayPal" />
 *   <Radio value="transfer" label="Transferencia bancaria" />
 * </RadioGroup>
 * ```
 */
export function RadioGroup({
    name,
    value,
    onChange,
    children,
    label,
    disabled = false,
    size = 'md',
    orientation = 'vertical',
    error = false,
    errorMessage,
    helperText,
    className,
}: RadioGroupProps) {
    const groupId = useId();

    const contextValue: RadioGroupContextValue = {
        name,
        value,
        onChange,
        disabled,
        size,
        error,
    };

    const groupClasses = [
        styles.group,
        styles[orientation],
        className,
    ].filter(Boolean).join(' ');

    return (
        <RadioGroupContext.Provider value={contextValue}>
            <fieldset
                className={styles.fieldset}
                aria-describedby={
                    errorMessage
                        ? `${groupId}-error`
                        : helperText
                            ? `${groupId}-helper`
                            : undefined
                }
            >
                {/* Leyenda del grupo */}
                {label && (
                    <legend className={styles.legend}>{label}</legend>
                )}

                {/* Opciones de radio */}
                <div className={groupClasses} role="radiogroup">
                    {children}
                </div>

                {/* Mensaje de error */}
                {error && errorMessage && (
                    <span
                        id={`${groupId}-error`}
                        className={styles.errorMessage}
                        role="alert"
                    >
                        {errorMessage}
                    </span>
                )}

                {/* Texto de ayuda */}
                {!error && helperText && (
                    <span
                        id={`${groupId}-helper`}
                        className={styles.helperText}
                    >
                        {helperText}
                    </span>
                )}
            </fieldset>
        </RadioGroupContext.Provider>
    );
}

/**
 * Props para el componente Radio individual
 * @interface RadioProps
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    /** Valor del radio */
    value: string;
    /** Etiqueta del radio */
    label?: string;
    /** Descripción adicional */
    description?: string;
    /** Tamaño del radio (se hereda de RadioGroup si existe) */
    size?: 'sm' | 'md';
}

/**
 * Radio - Componente de botón de radio individual
 * 
 * Puede usarse dentro de RadioGroup o de forma independiente.
 * 
 * @example
 * ```tsx
 * // Dentro de RadioGroup (recomendado)
 * <RadioGroup name="size" value={size} onChange={setSize}>
 *   <Radio value="s" label="Pequeño" />
 *   <Radio value="m" label="Mediano" />
 *   <Radio value="l" label="Grande" />
 * </RadioGroup>
 * 
 * // Independiente
 * <Radio 
 *   name="newsletter" 
 *   value="yes" 
 *   label="Sí, quiero recibir noticias"
 *   checked={wantsNewsletter}
 *   onChange={() => setWantsNewsletter(true)}
 * />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    (
        {
            value,
            label,
            description,
            size: sizeProp,
            disabled: disabledProp,
            className,
            id,
            onChange,
            checked,
            name: nameProp,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const radioId = id || generatedId;

        // Obtener contexto del grupo si existe
        const groupContext = useContext(RadioGroupContext);

        // Determinar valores finales (prop > context > default)
        const name = nameProp || groupContext?.name || '';
        const size = sizeProp || groupContext?.size || 'md';
        const disabled = disabledProp ?? groupContext?.disabled ?? false;
        const error = groupContext?.error ?? false;
        const isChecked = checked ?? (groupContext?.value === value);

        // Handler de cambio
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(e);
            }
            if (groupContext?.onChange) {
                groupContext.onChange(value);
            }
        };

        // Clases CSS
        const wrapperClasses = [
            styles.wrapper,
            disabled && styles.disabled,
            className,
        ].filter(Boolean).join(' ');

        const radioClasses = [
            styles.radio,
            styles[size],
            error && styles.error,
        ].filter(Boolean).join(' ');

        return (
            <div className={wrapperClasses}>
                <label className={styles.label} htmlFor={radioId}>
                    <input
                        ref={ref}
                        type="radio"
                        id={radioId}
                        name={name}
                        value={value}
                        checked={isChecked}
                        disabled={disabled}
                        onChange={handleChange}
                        className={radioClasses}
                        aria-describedby={description ? `${radioId}-desc` : undefined}
                        {...props}
                    />

                    {/* Radio visual personalizado */}
                    <span className={styles.radioMark} aria-hidden="true">
                        <span className={styles.radioDot} />
                    </span>

                    {/* Contenido del label */}
                    <div className={styles.content}>
                        {label && <span className={styles.labelText}>{label}</span>}
                        {description && (
                            <span
                                id={`${radioId}-desc`}
                                className={styles.description}
                            >
                                {description}
                            </span>
                        )}
                    </div>
                </label>
            </div>
        );
    }
);

Radio.displayName = 'Radio';

export default Radio;