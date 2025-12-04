/**
 * CartItem Component - Uniclima
 *
 * Muestra un producto individual en el carrito de compras.
 * Permite modificar la cantidad y eliminar el producto.
 *
 * La estructura de datos viene de la query GET_ACTIVE_ORDER de Vendure,
 * donde la imagen está en productVariant.product.featuredAsset
 *
 * @author Frontend Team
 * @version 1.1.0
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './CartItem.module.css';

/**
 * Interfaz que representa una línea de pedido del carrito
 * Debe coincidir con la estructura de GET_ACTIVE_ORDER query
 */
export interface OrderLine {
    /** ID único de la línea de pedido */
    id: string;
    /** Cantidad de unidades del producto */
    quantity: number;
    /** Precio unitario sin impuestos (en céntimos) */
    unitPrice: number;
    /** Precio unitario con impuestos (en céntimos) */
    unitPriceWithTax: number;
    /** Precio total de la línea sin impuestos (en céntimos) */
    linePrice: number;
    /** Precio total de la línea con impuestos (en céntimos) */
    linePriceWithTax: number;
    /** Información de la variante del producto */
    productVariant: {
        id: string;
        name: string;
        sku: string;
        /** Información del producto padre (contiene la imagen) */
        product: {
            id: string;
            name: string;
            slug: string;
            featuredAsset?: {
                id: string;
                preview: string;
            };
        };
    };
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

    // Obtener la imagen del producto padre (product.featuredAsset, no productVariant.featuredAsset)
    const imageUrl = item.productVariant.product.featuredAsset?.preview || '/placeholder-product.png';
    // El precio unitario viene de unitPriceWithTax en la línea de pedido
    const unitPrice = (item.unitPriceWithTax / 100).toFixed(2);
    // Subtotal de la línea (cantidad * precio unitario)
    const subtotal = (item.linePriceWithTax / 100).toFixed(2);
    // Slug del producto para el enlace
    const productSlug = item.productVariant.product.slug;

    return (
        <div className={`${styles.cartItem} ${loading || isRemoving ? styles.loading : ''}`}>
            {/* Imagen con enlace al producto */}
            <Link href={`/productos/${productSlug}`} className={styles.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={item.productVariant.name}
                    fill
                    className={styles.image}
                    sizes="120px"
                />
            </Link>

            {/* Información del producto con enlace */}
            <div className={styles.info}>
                <Link href={`/productos/${productSlug}`} className={styles.nameLink}>
                    <h3 className={styles.name}>{item.productVariant.product.name}</h3>
                </Link>
                {/* Mostrar nombre de variante si es diferente al producto */}
                {item.productVariant.name !== item.productVariant.product.name && (
                    <p className={styles.variant}>{item.productVariant.name}</p>
                )}
                <p className={styles.sku}>REF: {item.productVariant.sku}</p>
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
