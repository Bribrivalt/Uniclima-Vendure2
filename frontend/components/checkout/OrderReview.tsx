'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './OrderReview.module.css';
import { Button } from '@/components/core';
import type { Address } from './AddressForm';
import type { ShippingMethod } from './ShippingMethodSelector';
import type { PaymentMethod } from './PaymentMethodSelector';

/**
 * Interfaz para un producto en la revisión del pedido
 * @interface OrderReviewItem
 */
export interface OrderReviewItem {
    /** ID de la línea */
    id: string;
    /** Nombre del producto */
    name: string;
    /** SKU */
    sku?: string;
    /** Variante (ej: "Unidad interior + exterior") */
    variantName?: string;
    /** Cantidad */
    quantity: number;
    /** Precio unitario (con IVA) en céntimos */
    unitPrice: number;
    /** Precio total de la línea (con IVA) en céntimos */
    linePrice: number;
    /** Imagen del producto */
    image?: string;
}

/**
 * Props para el componente OrderReview
 * @interface OrderReviewProps
 */
export interface OrderReviewProps {
    /** Items del pedido */
    items: OrderReviewItem[];
    /** Dirección de envío */
    shippingAddress: Address;
    /** Dirección de facturación (si es diferente) */
    billingAddress?: Address;
    /** Método de envío seleccionado */
    shippingMethod: ShippingMethod;
    /** Método de pago seleccionado */
    paymentMethod: PaymentMethod;
    /** Subtotal (sin IVA) en céntimos */
    subtotal: number;
    /** Total del IVA en céntimos */
    tax: number;
    /** Coste de envío (con IVA) en céntimos */
    shippingCost: number;
    /** Total del pedido (con IVA) en céntimos */
    total: number;
    /** Descuentos aplicados (en céntimos) */
    discount?: number;
    /** Código de cupón aplicado */
    couponCode?: string;
    /** Notas del pedido */
    orderNotes?: string;
    /** Términos y condiciones aceptados */
    termsAccepted?: boolean;
    /** Callback al aceptar términos */
    onTermsChange?: (accepted: boolean) => void;
    /** Callback al confirmar pedido */
    onConfirm: () => void;
    /** Callback para editar sección */
    onEditSection?: (section: 'shipping' | 'billing' | 'shippingMethod' | 'payment') => void;
    /** Estado de carga */
    loading?: boolean;
    /** Errores de validación */
    errors?: string[];
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de editar
 */
const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

/**
 * Icono de check
 */
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/**
 * Icono de candado (seguridad)
 */
const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

/**
 * OrderReview - Revisión final del pedido antes de confirmar
 * 
 * Muestra un resumen completo del pedido incluyendo:
 * - Productos con imágenes
 * - Direcciones de envío y facturación
 * - Métodos de envío y pago
 * - Desglose de precios
 * 
 * @example
 * ```tsx
 * <OrderReview
 *   items={cartItems}
 *   shippingAddress={shippingAddress}
 *   shippingMethod={selectedShipping}
 *   paymentMethod={selectedPayment}
 *   subtotal={10000}
 *   tax={2100}
 *   shippingCost={499}
 *   total={12599}
 *   onConfirm={handlePlaceOrder}
 *   onEditSection={handleEdit}
 * />
 * ```
 */
export function OrderReview({
    items,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    total,
    discount = 0,
    couponCode,
    orderNotes,
    termsAccepted = false,
    onTermsChange,
    onConfirm,
    onEditSection,
    loading = false,
    errors = [],
    className,
}: OrderReviewProps) {
    // Formatear precio
    const formatPrice = (cents: number): string => {
        return `${(cents / 100).toFixed(2)}€`;
    };

    // Formatear dirección
    const formatAddress = (address: Address): string => {
        const parts = [
            address.fullName,
            address.company,
            address.streetLine1,
            address.streetLine2,
            `${address.postalCode} ${address.city}`,
            address.province,
        ].filter(Boolean);
        return parts.join(', ');
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <h2 className={styles.title}>Revisa tu pedido</h2>

            {/* Errores */}
            {errors.length > 0 && (
                <div className={styles.errors}>
                    {errors.map((error, index) => (
                        <p key={index} className={styles.error}>{error}</p>
                    ))}
                </div>
            )}

            {/* Productos */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Productos ({items.length})</h3>
                    <Link href="/carrito" className={styles.editLink}>
                        <EditIcon /> Editar
                    </Link>
                </div>
                <div className={styles.items}>
                    {items.map(item => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemImage}>
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="80px"
                                        className={styles.itemImg}
                                    />
                                ) : (
                                    <div className={styles.itemPlaceholder}>📦</div>
                                )}
                            </div>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                {item.variantName && (
                                    <span className={styles.itemVariant}>{item.variantName}</span>
                                )}
                                {item.sku && (
                                    <span className={styles.itemSku}>SKU: {item.sku}</span>
                                )}
                            </div>
                            <div className={styles.itemQuantity}>
                                <span>x{item.quantity}</span>
                            </div>
                            <div className={styles.itemPrice}>
                                <span className={styles.itemLinePrice}>{formatPrice(item.linePrice)}</span>
                                {item.quantity > 1 && (
                                    <span className={styles.itemUnitPrice}>
                                        {formatPrice(item.unitPrice)} / ud.
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Direcciones */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Direcciones</h3>
                </div>
                <div className={styles.addresses}>
                    {/* Dirección de envío */}
                    <div className={styles.addressCard}>
                        <div className={styles.addressHeader}>
                            <span className={styles.addressLabel}>Dirección de envío</span>
                            {onEditSection && (
                                <button
                                    type="button"
                                    className={styles.editButton}
                                    onClick={() => onEditSection('shipping')}
                                >
                                    <EditIcon />
                                </button>
                            )}
                        </div>
                        <p className={styles.addressText}>{formatAddress(shippingAddress)}</p>
                        <p className={styles.addressPhone}>📞 {shippingAddress.phoneNumber}</p>
                    </div>

                    {/* Dirección de facturación */}
                    {billingAddress && (
                        <div className={styles.addressCard}>
                            <div className={styles.addressHeader}>
                                <span className={styles.addressLabel}>Dirección de facturación</span>
                                {onEditSection && (
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={() => onEditSection('billing')}
                                    >
                                        <EditIcon />
                                    </button>
                                )}
                            </div>
                            <p className={styles.addressText}>{formatAddress(billingAddress)}</p>
                            {billingAddress.taxId && (
                                <p className={styles.addressTax}>NIF/CIF: {billingAddress.taxId}</p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Método de envío */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Método de envío</h3>
                    {onEditSection && (
                        <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => onEditSection('shippingMethod')}
                        >
                            <EditIcon /> Cambiar
                        </button>
                    )}
                </div>
                <div className={styles.methodCard}>
                    <div className={styles.methodInfo}>
                        <span className={styles.methodName}>{shippingMethod.name}</span>
                        {shippingMethod.deliveryTime && (
                            <span className={styles.methodDelivery}>
                                Entrega: {shippingMethod.deliveryTime}
                            </span>
                        )}
                    </div>
                    <span className={`${styles.methodPrice} ${shippingCost === 0 ? styles.free : ''}`}>
                        {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                </div>
            </section>

            {/* Método de pago */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Método de pago</h3>
                    {onEditSection && (
                        <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => onEditSection('payment')}
                        >
                            <EditIcon /> Cambiar
                        </button>
                    )}
                </div>
                <div className={styles.methodCard}>
                    <div className={styles.methodInfo}>
                        <span className={styles.methodName}>{paymentMethod.name}</span>
                        {paymentMethod.surcharge && paymentMethod.surcharge > 0 && (
                            <span className={styles.methodSurcharge}>
                                + {formatPrice(paymentMethod.surcharge)} comisión
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Notas del pedido */}
            {orderNotes && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Notas del pedido</h3>
                    </div>
                    <p className={styles.notes}>{orderNotes}</p>
                </section>
            )}

            {/* Resumen de precios */}
            <section className={`${styles.section} ${styles.summary}`}>
                <h3 className={styles.sectionTitle}>Resumen</h3>
                <div className={styles.summaryRows}>
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>IVA (21%)</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Envío</span>
                        <span className={shippingCost === 0 ? styles.free : ''}>
                            {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className={`${styles.summaryRow} ${styles.discount}`}>
                            <span>
                                Descuento
                                {couponCode && <span className={styles.couponCode}>({couponCode})</span>}
                            </span>
                            <span>-{formatPrice(discount)}</span>
                        </div>
                    )}
                    <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>
            </section>

            {/* Términos y condiciones */}
            {onTermsChange && (
                <div className={styles.terms}>
                    <label className={styles.termsLabel}>
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={e => onTermsChange(e.target.checked)}
                            className={styles.termsCheckbox}
                        />
                        <span className={styles.termsText}>
                            He leído y acepto los{' '}
                            <Link href="/terminos" target="_blank">términos y condiciones</Link>
                            {' '}y la{' '}
                            <Link href="/privacidad" target="_blank">política de privacidad</Link>
                        </span>
                    </label>
                </div>
            )}

            {/* Botón de confirmar */}
            <div className={styles.actions}>
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={onTermsChange && !termsAccepted}
                    onClick={onConfirm}
                >
                    <LockIcon />
                    Confirmar pedido • {formatPrice(total)}
                </Button>
            </div>

            {/* Información de seguridad */}
            <div className={styles.security}>
                <span className={styles.securityIcon}>🔒</span>
                <span className={styles.securityText}>
                    Pago 100% seguro. Tus datos están protegidos.
                </span>
            </div>
        </div>
    );
}

export default OrderReview;