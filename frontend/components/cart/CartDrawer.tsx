'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './CartDrawer.module.css';
import { CartItem, OrderLine } from './CartItem';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { CartIcon, CloseIcon } from '@/components/icons';

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
                        {/* Resumen de precios estilo tabla */}
                        <div className={styles.summary}>
                            <div className={styles.summaryRowSimple}>
                                <span>{items.reduce((acc, i) => acc + i.quantity, 0)} artículos</span>
                                <span>{(total / 100).toFixed(2)} €</span>
                            </div>
                            <div className={styles.summaryRowSimple}>
                                <span>Transporte</span>
                                <span>0,00 €</span>
                            </div>
                            <hr className={styles.summaryDivider} />
                            <div className={styles.summaryTotalRow}>
                                <span className={styles.totalLabel}>Total (impuestos inc.)</span>
                                <span className={styles.totalValue}>
                                    {(total / 100).toFixed(2)} €
                                </span>
                            </div>
                        </div>

                        {/* Botón de acción único */}
                        <Link
                            href="/checkout"
                            className={styles.tramitarButton}
                            onClick={onClose}
                        >
                            Tramitar Pedido
                        </Link>
                    </footer>
                )}
            </aside>
        </>
    );
}

export default CartDrawer;