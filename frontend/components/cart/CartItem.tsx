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
            {/* Imagen Izquierda */}
            <Link href={`/productos/${productSlug}`} className={styles.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={item.productVariant.name}
                    fill
                    className={styles.image}
                    sizes="100px"
                />
            </Link>

            {/* Columna Derecha */}
            <div className={styles.contentColumn}>
                <div className={styles.titleRow}>
                    <Link href={`/productos/${productSlug}`} className={styles.nameLink}>
                        <h3 className={styles.name}>{item.productVariant.product.name}</h3>
                    </Link>
                    {item.productVariant.name !== item.productVariant.product.name && (
                        <p className={styles.variant}>{item.productVariant.name}</p>
                    )}
                </div>

                {/* Fila Inferior: Cantidad x Precio + Eliminar */}
                <div className={styles.bottomRow}>
                    <div className={styles.quantitySelector}>
                        <button
                            onClick={handleDecrease}
                            disabled={loading}
                            className={styles.quantityBtn}
                            aria-label="Disminuir"
                        >
                            -
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button
                            onClick={handleIncrease}
                            disabled={loading}
                            className={styles.quantityBtn}
                            aria-label="Aumentar"
                        >
                            +
                        </button>
                    </div>

                    <span className={styles.priceX}>x {unitPrice} €</span>

                    <button
                        onClick={() => setShowRemoveConfirm(true)}
                        disabled={loading || isRemoving}
                        className={styles.trashBtn}
                        aria-label="Eliminar producto"
                    >
                        <TrashIcon size={16} />
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
