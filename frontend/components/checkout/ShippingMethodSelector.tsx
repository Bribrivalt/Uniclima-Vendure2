'use client';

import React, { useState } from 'react';
import styles from './ShippingMethodSelector.module.css';

/**
 * Interfaz para un método de envío
 * @interface ShippingMethod
 */
export interface ShippingMethod {
    /** ID único del método */
    id: string;
    /** Nombre del método */
    name: string;
    /** Descripción */
    description?: string;
    /** Precio en céntimos (0 = gratis) */
    price: number;
    /** Precio con IVA en céntimos */
    priceWithTax: number;
    /** Tiempo estimado de entrega */
    deliveryTime?: string;
    /** Código del transportista */
    carrier?: string;
    /** Logo del transportista */
    carrierLogo?: string;
    /** Disponibilidad */
    available?: boolean;
    /** Mensaje si no está disponible */
    unavailableReason?: string;
}

/**
 * Props para el componente ShippingMethodSelector
 * @interface ShippingMethodSelectorProps
 */
export interface ShippingMethodSelectorProps {
    /** Métodos de envío disponibles */
    methods: ShippingMethod[];
    /** ID del método seleccionado */
    selectedId?: string;
    /** Callback al seleccionar método */
    onSelect: (method: ShippingMethod) => void;
    /** Estado de carga */
    loading?: boolean;
    /** Mostrar precios con IVA */
    showPricesWithTax?: boolean;
    /** Título de la sección */
    title?: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de camión (envío estándar)
 */
const TruckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

/**
 * Icono de rayo (envío express)
 */
const ExpressIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

/**
 * Icono de tienda (recogida)
 */
const StoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

/**
 * Icono de check
 */
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/**
 * Obtener icono según el tipo de envío
 */
const getShippingIcon = (methodId: string, carrier?: string) => {
    const id = methodId.toLowerCase();
    const carrierLower = carrier?.toLowerCase() || '';

    if (id.includes('express') || id.includes('urgente') || id.includes('24h')) {
        return <ExpressIcon />;
    }
    if (id.includes('recogida') || id.includes('pickup') || id.includes('tienda')) {
        return <StoreIcon />;
    }
    return <TruckIcon />;
};

/**
 * ShippingMethodSelector - Selector de método de envío
 * 
 * Permite al usuario seleccionar entre diferentes opciones de envío
 * durante el proceso de checkout. Muestra precio, tiempo estimado
 * y logo del transportista.
 * 
 * @example
 * ```tsx
 * <ShippingMethodSelector
 *   methods={[
 *     { id: 'standard', name: 'Envío estándar', price: 499, priceWithTax: 604, deliveryTime: '3-5 días' },
 *     { id: 'express', name: 'Envío express', price: 999, priceWithTax: 1209, deliveryTime: '24-48h' },
 *   ]}
 *   selectedId={selectedShipping}
 *   onSelect={handleShippingSelect}
 * />
 * ```
 */
export function ShippingMethodSelector({
    methods,
    selectedId,
    onSelect,
    loading = false,
    showPricesWithTax = true,
    title = 'Método de envío',
    className,
}: ShippingMethodSelectorProps) {
    const [selected, setSelected] = useState<string | undefined>(selectedId);

    // Handler para selección
    const handleSelect = (method: ShippingMethod) => {
        if (method.available === false) return;
        setSelected(method.id);
        onSelect(method);
    };

    // Formatear precio
    const formatPrice = (method: ShippingMethod): string => {
        const price = showPricesWithTax ? method.priceWithTax : method.price;
        if (price === 0) return 'Gratis';
        return `${(price / 100).toFixed(2)}€`;
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    // Loading skeleton
    if (loading) {
        return (
            <div className={containerClasses}>
                {title && <h3 className={styles.title}>{title}</h3>}
                <div className={styles.methods}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.skeleton}>
                            <div className={styles.skeletonIcon} />
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonLine} />
                                <div className={styles.skeletonLineShort} />
                            </div>
                            <div className={styles.skeletonPrice} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Sin métodos disponibles
    if (methods.length === 0) {
        return (
            <div className={containerClasses}>
                {title && <h3 className={styles.title}>{title}</h3>}
                <div className={styles.noMethods}>
                    <p>No hay métodos de envío disponibles para tu dirección.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            {title && <h3 className={styles.title}>{title}</h3>}

            <div className={styles.methods} role="radiogroup" aria-label={title}>
                {methods.map(method => {
                    const isSelected = selected === method.id;
                    const isDisabled = method.available === false;

                    return (
                        <button
                            key={method.id}
                            type="button"
                            className={`
                                ${styles.method}
                                ${isSelected ? styles.selected : ''}
                                ${isDisabled ? styles.disabled : ''}
                            `}
                            onClick={() => handleSelect(method)}
                            disabled={isDisabled}
                            role="radio"
                            aria-checked={isSelected}
                            aria-disabled={isDisabled}
                        >
                            {/* Indicador de selección */}
                            <span className={styles.radio}>
                                {isSelected && (
                                    <span className={styles.radioCheck}>
                                        <CheckIcon />
                                    </span>
                                )}
                            </span>

                            {/* Icono del método */}
                            <span className={styles.icon}>
                                {method.carrierLogo ? (
                                    <img
                                        src={method.carrierLogo}
                                        alt={method.carrier || method.name}
                                        className={styles.carrierLogo}
                                    />
                                ) : (
                                    getShippingIcon(method.id, method.carrier)
                                )}
                            </span>

                            {/* Información del método */}
                            <span className={styles.info}>
                                <span className={styles.name}>{method.name}</span>
                                {method.description && (
                                    <span className={styles.description}>{method.description}</span>
                                )}
                                {method.deliveryTime && (
                                    <span className={styles.deliveryTime}>
                                        Entrega estimada: {method.deliveryTime}
                                    </span>
                                )}
                                {isDisabled && method.unavailableReason && (
                                    <span className={styles.unavailable}>
                                        {method.unavailableReason}
                                    </span>
                                )}
                            </span>

                            {/* Precio */}
                            <span className={`${styles.price} ${method.price === 0 ? styles.free : ''}`}>
                                {formatPrice(method)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ShippingMethodSelector;