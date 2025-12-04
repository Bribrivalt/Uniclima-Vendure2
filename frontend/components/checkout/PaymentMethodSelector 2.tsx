'use client';

import React, { useState } from 'react';
import styles from './PaymentMethodSelector.module.css';

/**
 * Interfaz para un método de pago
 * @interface PaymentMethod
 */
export interface PaymentMethod {
    /** ID único del método */
    id: string;
    /** Nombre del método */
    name: string;
    /** Descripción */
    description?: string;
    /** Código del método (stripe, paypal, etc) */
    code: string;
    /** Icono/logo del método */
    icon?: string;
    /** Disponibilidad */
    available?: boolean;
    /** Mensaje si no está disponible */
    unavailableReason?: string;
    /** Comisión adicional (en céntimos) */
    surcharge?: number;
    /** Métodos de tarjeta aceptados (si aplica) */
    acceptedCards?: string[];
}

/**
 * Props para el componente PaymentMethodSelector
 * @interface PaymentMethodSelectorProps
 */
export interface PaymentMethodSelectorProps {
    /** Métodos de pago disponibles */
    methods: PaymentMethod[];
    /** ID del método seleccionado */
    selectedId?: string;
    /** Callback al seleccionar método */
    onSelect: (method: PaymentMethod) => void;
    /** Estado de carga */
    loading?: boolean;
    /** Título de la sección */
    title?: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de tarjeta de crédito
 */
const CreditCardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

/**
 * Icono de PayPal
 */
const PaypalIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.773.773 0 01.763-.643h6.142c2.414 0 4.208.565 5.137 1.615.849.96 1.083 2.245.699 3.877-.447 1.9-1.326 3.374-2.606 4.363-1.262.973-2.88 1.478-4.815 1.478H8.197l-.872 6.173a.773.773 0 01-.763.643h-.486z" />
    </svg>
);

/**
 * Icono de transferencia bancaria
 */
const BankIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
);

/**
 * Icono de Bizum
 */
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
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
 * Iconos de tarjetas
 */
const CardBrandIcons: Record<string, JSX.Element> = {
    visa: (
        <svg viewBox="0 0 48 48" fill="#1A1F71">
            <path d="M44 35a4 4 0 01-4 4H8a4 4 0 01-4-4V13a4 4 0 014-4h32a4 4 0 014 4v22z" />
            <text x="24" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">VISA</text>
        </svg>
    ),
    mastercard: (
        <svg viewBox="0 0 48 48">
            <circle cx="17" cy="24" r="10" fill="#EB001B" />
            <circle cx="31" cy="24" r="10" fill="#F79E1B" />
            <path d="M24 16.5a10 10 0 000 15" fill="#FF5F00" />
        </svg>
    ),
    amex: (
        <svg viewBox="0 0 48 48" fill="#2E77BC">
            <rect x="4" y="9" width="40" height="30" rx="3" />
            <text x="24" y="26" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">AMEX</text>
        </svg>
    ),
};

/**
 * Obtener icono según el método de pago
 */
const getPaymentIcon = (code: string) => {
    const codeLower = code.toLowerCase();

    if (codeLower.includes('card') || codeLower.includes('stripe') || codeLower.includes('tarjeta')) {
        return <CreditCardIcon />;
    }
    if (codeLower.includes('paypal')) {
        return <PaypalIcon />;
    }
    if (codeLower.includes('bank') || codeLower.includes('transfer')) {
        return <BankIcon />;
    }
    if (codeLower.includes('bizum') || codeLower.includes('phone')) {
        return <PhoneIcon />;
    }
    return <CreditCardIcon />;
};

/**
 * PaymentMethodSelector - Selector de método de pago
 * 
 * Permite al usuario seleccionar entre diferentes opciones de pago
 * durante el proceso de checkout. Muestra iconos de tarjetas aceptadas
 * y comisiones si las hubiera.
 * 
 * @example
 * ```tsx
 * <PaymentMethodSelector
 *   methods={[
 *     { id: 'card', name: 'Tarjeta de crédito/débito', code: 'stripe', acceptedCards: ['visa', 'mastercard'] },
 *     { id: 'paypal', name: 'PayPal', code: 'paypal' },
 *     { id: 'transfer', name: 'Transferencia bancaria', code: 'bank-transfer' },
 *   ]}
 *   selectedId={selectedPayment}
 *   onSelect={handlePaymentSelect}
 * />
 * ```
 */
export function PaymentMethodSelector({
    methods,
    selectedId,
    onSelect,
    loading = false,
    title = 'Método de pago',
    className,
}: PaymentMethodSelectorProps) {
    const [selected, setSelected] = useState<string | undefined>(selectedId);

    // Handler para selección
    const handleSelect = (method: PaymentMethod) => {
        if (method.available === false) return;
        setSelected(method.id);
        onSelect(method);
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
                    <p>No hay métodos de pago disponibles.</p>
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
                                {method.icon ? (
                                    <img
                                        src={method.icon}
                                        alt={method.name}
                                        className={styles.methodLogo}
                                    />
                                ) : (
                                    getPaymentIcon(method.code)
                                )}
                            </span>

                            {/* Información del método */}
                            <span className={styles.info}>
                                <span className={styles.name}>{method.name}</span>
                                {method.description && (
                                    <span className={styles.description}>{method.description}</span>
                                )}
                                {method.surcharge && method.surcharge > 0 && (
                                    <span className={styles.surcharge}>
                                        + {(method.surcharge / 100).toFixed(2)}€ de comisión
                                    </span>
                                )}
                                {isDisabled && method.unavailableReason && (
                                    <span className={styles.unavailable}>
                                        {method.unavailableReason}
                                    </span>
                                )}
                            </span>

                            {/* Tarjetas aceptadas */}
                            {method.acceptedCards && method.acceptedCards.length > 0 && (
                                <span className={styles.acceptedCards}>
                                    {method.acceptedCards.map(card => (
                                        <span key={card} className={styles.cardBrand}>
                                            {CardBrandIcons[card] || card}
                                        </span>
                                    ))}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Información de seguridad */}
            <div className={styles.security}>
                <span className={styles.securityIcon}>🔒</span>
                <span className={styles.securityText}>
                    Pago seguro. Tus datos están protegidos con encriptación SSL.
                </span>
            </div>
        </div>
    );
}

export default PaymentMethodSelector;