'use client';

import React from 'react';
import Image from 'next/image';
import styles from './OrderSummary.module.css';

export interface OrderLineItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    linePrice: number;
    imageUrl?: string;
    sku?: string;
}

export interface OrderSummaryProps {
    items: OrderLineItem[];
    subtotal: number;
    shipping?: number;
    tax?: number;
    discount?: number;
    total: number;
    currency?: string;
    showItems?: boolean;
}

/**
 * OrderSummary - Resumen del pedido para checkout
 */
export function OrderSummary({
    items,
    subtotal,
    shipping = 0,
    tax = 0,
    discount = 0,
    total,
    currency = '€',
    showItems = true,
}: OrderSummaryProps) {
    const formatPrice = (price: number) => {
        return (price / 100).toFixed(2) + currency;
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Resumen del pedido</h3>

            {/* Lista de productos */}
            {showItems && items.length > 0 && (
                <div className={styles.items}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemImage}>
                                <Image
                                    src={item.imageUrl || '/placeholder-product.png'}
                                    alt={item.name}
                                    fill
                                    sizes="60px"
                                    className={styles.image}
                                />
                                <span className={styles.quantity}>{item.quantity}</span>
                            </div>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                {item.sku && (
                                    <span className={styles.itemSku}>SKU: {item.sku}</span>
                                )}
                            </div>
                            <span className={styles.itemPrice}>
                                {formatPrice(item.linePrice)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Totales */}
            <div className={styles.totals}>
                <div className={styles.row}>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>

                {shipping > 0 && (
                    <div className={styles.row}>
                        <span>Envío</span>
                        <span>{formatPrice(shipping)}</span>
                    </div>
                )}

                {shipping === 0 && (
                    <div className={styles.row}>
                        <span>Envío</span>
                        <span className={styles.freeShipping}>Gratis</span>
                    </div>
                )}

                {discount > 0 && (
                    <div className={`${styles.row} ${styles.discount}`}>
                        <span>Descuento</span>
                        <span>-{formatPrice(discount)}</span>
                    </div>
                )}

                {tax > 0 && (
                    <div className={styles.row}>
                        <span>IVA</span>
                        <span>{formatPrice(tax)}</span>
                    </div>
                )}

                <div className={`${styles.row} ${styles.total}`}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            {/* Info adicional */}
            <div className={styles.info}>
                <div className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Pago seguro SSL</span>
                </div>
                <div className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Garantía de 2 años</span>
                </div>
            </div>
        </div>
    );
}