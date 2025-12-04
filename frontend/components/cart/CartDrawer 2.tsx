'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './CartDrawer.module.css';
import { CartItem, OrderLine } from './CartItem';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';

/**
 * Props para el componente CartDrawer
 * @interface CartDrawerProps
 */
export interface CartDrawerProps {
    /** Estado de apertura del drawer */
    isOpen: boolean;
    /** Callback para cerrar el drawer */
    onClose: () => void;
    /** Líneas del pedido (items del carrito) */
    items: OrderLine[];
    /** Subtotal del carrito (sin IVA) */
    subtotal: number;
    /** Total del carrito (con IVA) */
    total: number;
    /** Cantidad total de items */
    itemCount: number;
    /** Estado de carga */
    loading?: boolean;
    /** Callback para actualizar cantidad */
    onUpdateQuantity: (lineId: string, quantity: number) => void;
    /** Callback para eliminar item */
    onRemoveItem: (lineId: string) => void;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de X para cerrar
 */
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Icono de carrito
 */
const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
);

/**
 * CartDrawer - Panel lateral de carrito de compras
 * 
 * Características:
 * - Slide-in desde la derecha
 * - Focus trap para accesibilidad
 * - Lista de productos con controles
 * - Resumen con subtotal y total
 * - Botones de acción (ver carrito, checkout)
 * 
 * @example
 * ```tsx
 * <CartDrawer
 *   isOpen={cartOpen}
 *   onClose={() => setCartOpen(false)}
 *   items={cartItems}
 *   subtotal={100}
 *   total={121}
 *   itemCount={3}
 *   onUpdateQuantity={handleUpdate}
 *   onRemoveItem={handleRemove}
 * />
 * ```
 */
export function CartDrawer({
    isOpen,
    onClose,
    items,
    subtotal,
    total,
    itemCount,
    loading = false,
    onUpdateQuantity,
    onRemoveItem,
    className,
}: CartDrawerProps) {
    // Focus trap ref
    const drawerRef = useFocusTrap(isOpen);

    // Cerrar con Escape
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // Bloquear scroll del body cuando está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    const containerClasses = [
        styles.container,
        isOpen && styles.open,
        className,
    ].filter(Boolean).join(' ');

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                ref={drawerRef}
                className={containerClasses}
                role="dialog"
                aria-modal="true"
                aria-label="Carrito de compras"
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <span className={styles.cartIconWrapper}>
                            <CartIcon />
                        </span>
                        <h2 className={styles.title}>
                            Carrito
                            {itemCount > 0 && (
                                <span className={styles.itemCount}>({itemCount})</span>
                            )}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar carrito"
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* Contenido */}
                <div className={styles.content}>
                    {items.length === 0 ? (
                        // Estado vacío
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>
                                <CartIcon />
                            </div>
                            <h3 className={styles.emptyTitle}>Tu carrito está vacío</h3>
                            <p className={styles.emptyText}>
                                Añade productos para comenzar tu compra
                            </p>
                            <Link
                                href="/productos"
                                className={styles.emptyButton}
                                onClick={onClose}
                            >
                                Ver productos
                            </Link>
                        </div>
                    ) : (
                        // Lista de items
                        <ul className={styles.itemsList}>
                            {items.map(item => (
                                <li key={item.id} className={styles.itemWrapper}>
                                    <CartItem
                                        item={item}
                                        onUpdateQuantity={onUpdateQuantity}
                                        onRemove={onRemoveItem}
                                        loading={loading}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer con totales y acciones */}
                {items.length > 0 && (
                    <footer className={styles.footer}>
                        {/* Resumen de precios */}
                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Subtotal</span>
                                <span className={styles.summaryValue}>
                                    {(subtotal / 100).toFixed(2)}€
                                </span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>IVA (21%)</span>
                                <span className={styles.summaryValue}>
                                    {((total - subtotal) / 100).toFixed(2)}€
                                </span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span className={styles.summaryLabel}>Total</span>
                                <span className={styles.summaryValue}>
                                    {(total / 100).toFixed(2)}€
                                </span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className={styles.actions}>
                            <Link
                                href="/carrito"
                                className={styles.viewCartButton}
                                onClick={onClose}
                            >
                                Ver carrito
                            </Link>
                            <Link
                                href="/checkout"
                                className={styles.checkoutButton}
                                onClick={onClose}
                            >
                                Finalizar compra
                            </Link>
                        </div>
                    </footer>
                )}
            </aside>
        </>
    );
}

export default CartDrawer;