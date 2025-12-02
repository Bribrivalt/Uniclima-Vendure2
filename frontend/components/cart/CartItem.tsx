'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './CartItem.module.css';

export interface OrderLine {
    id: string;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        price: number;
        priceWithTax: number;
        featuredAsset?: {
            preview: string;
        };
    };
    quantity: number;
    linePrice: number;
    linePriceWithTax: number;
}

export interface CartItemProps {
    item: OrderLine;
    onUpdateQuantity: (lineId: string, quantity: number) => void;
    onRemove: (lineId: string) => void;
    loading?: boolean;
}

/**
 * CartItem - Componente para mostrar un producto en el carrito
 */
export function CartItem({ item, onUpdateQuantity, onRemove, loading = false }: CartItemProps) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleDecrease = () => {
        if (item.quantity > 1 && !loading) {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (!loading) {
            onUpdateQuantity(item.id, item.quantity + 1);
        }
    };

    const handleRemove = () => {
        if (!loading && !isRemoving) {
            setIsRemoving(true);
            onRemove(item.id);
        }
    };

    const imageUrl = item.productVariant.featuredAsset?.preview || '/placeholder-product.png';
    const unitPrice = (item.productVariant.priceWithTax / 100).toFixed(2);
    const subtotal = (item.linePriceWithTax / 100).toFixed(2);

    return (
        <div className={`${styles.cartItem} ${loading || isRemoving ? styles.loading : ''}`}>
            {/* Imagen */}
            <div className={styles.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={item.productVariant.name}
                    fill
                    className={styles.image}
                    sizes="120px"
                />
            </div>

            {/* Información del producto */}
            <div className={styles.info}>
                <h3 className={styles.name}>{item.productVariant.name}</h3>
                <p className={styles.sku}>SKU: {item.productVariant.sku}</p>
                <p className={styles.price}>{unitPrice}€ / unidad</p>
            </div>

            {/* Controles de cantidad */}
            <div className={styles.quantityControls}>
                <button
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1 || loading}
                    className={styles.quantityButton}
                    aria-label="Disminuir cantidad"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>

                <span className={styles.quantity}>{item.quantity}</span>

                <button
                    onClick={handleIncrease}
                    disabled={loading}
                    className={styles.quantityButton}
                    aria-label="Aumentar cantidad"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Subtotal */}
            <div className={styles.subtotal}>
                <span className={styles.subtotalAmount}>{subtotal}€</span>
                <span className={styles.taxLabel}>IVA incluido</span>
            </div>

            {/* Botón eliminar */}
            <button
                onClick={handleRemove}
                disabled={loading || isRemoving}
                className={styles.removeButton}
                aria-label="Eliminar producto"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            </button>
        </div>
    );
}
