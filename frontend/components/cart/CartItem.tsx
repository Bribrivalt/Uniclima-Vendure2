/**
 * CartItem Component - Uniclima
 *
 * Muestra un producto individual en el carrito de compras.
 * Permite modificar la cantidad y eliminar el producto.
 * Incluye animaciones de actualización y feedback visual.
 *
 * La estructura de datos viene de la query GET_ACTIVE_ORDER de Vendure,
 * donde la imagen está en productVariant.product.featuredAsset
 *
 * @author Frontend Team
 * @version 2.0.0
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './CartItem.module.css';
import { TrashIcon, PlusIcon, MinusIcon } from '@/components/icons';

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
                source: string;
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
    const [quantityAnimation, setQuantityAnimation] = useState<'up' | 'down' | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const prevQuantityRef = useRef(item.quantity);
    const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Detectar cambio de cantidad para animación
    useEffect(() => {
        if (item.quantity !== prevQuantityRef.current) {
            setQuantityAnimation(item.quantity > prevQuantityRef.current ? 'up' : 'down');
            const timer = setTimeout(() => setQuantityAnimation(null), 300);
            prevQuantityRef.current = item.quantity;
            return () => clearTimeout(timer);
        }
    }, [item.quantity]);

    // Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (removeTimeoutRef.current) {
                clearTimeout(removeTimeoutRef.current);
            }
        };
    }, []);

    const handleDecrease = useCallback(() => {
        if (item.quantity > 1 && !loading) {
            onUpdateQuantity(item.id, item.quantity - 1);
        } else if (item.quantity === 1) {
            // Mostrar confirmación de eliminación
            setShowRemoveConfirm(true);
            removeTimeoutRef.current = setTimeout(() => setShowRemoveConfirm(false), 3000);
        }
    }, [item.id, item.quantity, loading, onUpdateQuantity]);

    const handleIncrease = useCallback(() => {
        if (!loading) {
            onUpdateQuantity(item.id, item.quantity + 1);
        }
    }, [item.id, item.quantity, loading, onUpdateQuantity]);

    const handleRemove = useCallback(() => {
        if (!loading && !isRemoving) {
            setIsRemoving(true);
            onRemove(item.id);
        }
    }, [item.id, loading, isRemoving, onRemove]);

    const handleCancelRemove = useCallback(() => {
        setShowRemoveConfirm(false);
        if (removeTimeoutRef.current) {
            clearTimeout(removeTimeoutRef.current);
        }
    }, []);

    // Obtener la imagen del producto padre (product.featuredAsset, no productVariant.featuredAsset)
    const imageUrl = item.productVariant.product.featuredAsset?.preview || item.productVariant.product.featuredAsset?.source || '/placeholder-product.png';
    // El precio unitario viene de unitPriceWithTax en la línea de pedido
    const unitPrice = (item.unitPriceWithTax / 100).toFixed(2);
    // Subtotal de la línea (cantidad * precio unitario)
    const subtotal = (item.linePriceWithTax / 100).toFixed(2);
    // Slug del producto para el enlace
    const productSlug = item.productVariant.product.slug;

    // Clases con animaciones
    const quantityClasses = [
        styles.quantity,
        quantityAnimation === 'up' && styles.quantityUp,
        quantityAnimation === 'down' && styles.quantityDown,
    ].filter(Boolean).join(' ');

    return (
        <div className={`${styles.cartItem} ${loading || isRemoving ? styles.loading : ''} ${isRemoving ? styles.removing : ''}`}>
            {/* Imagen Izquierda - Pequeña */}
            <Link href={`/productos/${productSlug}`} className={styles.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={item.productVariant.name}
                    fill
                    className={styles.image}
                    sizes="60px"
                />
            </Link>

            {/* Contenido Central */}
            <div className={styles.contentColumn}>
                {/* Nombre del producto */}
                <Link href={`/productos/${productSlug}`} className={styles.nameLink}>
                    <h3 className={styles.name}>{item.productVariant.product.name}</h3>
                </Link>

                {/* Selector de cantidad con estilo input + flechas */}
                <div className={styles.quantityRow}>
                    <div className={styles.quantityInputWrapper}>
                        <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className={styles.quantityInput}
                            aria-label="Cantidad"
                        />
                        <div className={styles.quantityArrows}>
                            <button
                                onClick={handleIncrease}
                                disabled={loading}
                                className={styles.arrowBtn}
                                aria-label="Aumentar cantidad"
                            >
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                                    <path d="M5 0L10 6H0L5 0Z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDecrease}
                                disabled={loading}
                                className={styles.arrowBtn}
                                aria-label="Disminuir cantidad"
                            >
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                                    <path d="M5 6L0 0H10L5 6Z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <span className={styles.priceMultiplier}>x {unitPrice} €</span>

                    {/* Botón eliminar */}
                    <button
                        onClick={() => setShowRemoveConfirm(true)}
                        disabled={loading || isRemoving}
                        className={styles.trashBtn}
                        aria-label="Eliminar producto"
                    >
                        <TrashIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Overlay de Confirmación */}
            {showRemoveConfirm && (
                <div className={styles.removeConfirmOverlay}>
                    <span className={styles.removeText}>¿Eliminar?</span>
                    <div className={styles.removeActions}>
                        <button className={styles.confirmBtn} onClick={handleRemove}>Sí</button>
                        <button className={styles.cancelBtn} onClick={handleCancelRemove}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}
