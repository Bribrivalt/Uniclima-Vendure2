'use client';

import React from 'react';
import Link from 'next/link';
import styles from './MiniCart.module.css';

/**
 * Props para el componente MiniCart
 * @interface MiniCartProps
 */
export interface MiniCartProps {
    /** Número de items en el carrito */
    itemCount: number;
    /** Total del carrito (con IVA) en céntimos */
    total?: number;
    /** Callback al hacer clic */
    onClick?: () => void;
    /** URL del carrito (si se usa como link) */
    href?: string;
    /** Mostrar total junto al icono */
    showTotal?: boolean;
    /** Mostrar label "Carrito" */
    showLabel?: boolean;
    /** Variante de visualización */
    variant?: 'icon' | 'button' | 'detailed';
    /** Tamaño del componente */
    size?: 'sm' | 'md' | 'lg';
    /** Animación al actualizar */
    animated?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de carrito de compras
 */
const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
);

/**
 * MiniCart - Indicador de carrito para el header
 * 
 * Muestra un icono de carrito con contador de items.
 * Puede funcionar como botón o como link.
 * 
 * @example
 * ```tsx
 * // Como botón que abre drawer
 * <MiniCart
 *   itemCount={3}
 *   total={12100}
 *   onClick={openCartDrawer}
 * />
 * 
 * // Como link al carrito
 * <MiniCart
 *   itemCount={5}
 *   href="/carrito"
 *   showLabel
 * />
 * 
 * // Versión detallada
 * <MiniCart
 *   itemCount={2}
 *   total={8500}
 *   variant="detailed"
 *   onClick={openCartDrawer}
 * />
 * ```
 */
export function MiniCart({
    itemCount,
    total,
    onClick,
    href,
    showTotal = false,
    showLabel = false,
    variant = 'icon',
    size = 'md',
    animated = true,
    className,
}: MiniCartProps) {
    // Formatear total
    const formattedTotal = total ? (total / 100).toFixed(2) + '€' : null;

    // Clases CSS
    const containerClasses = [
        styles.container,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        animated && itemCount > 0 && styles.animated,
        className,
    ].filter(Boolean).join(' ');

    // Contenido interno
    const content = (
        <>
            {/* Icono con badge */}
            <span className={styles.iconWrapper}>
                <span className={styles.icon}>
                    <CartIcon />
                </span>
                {itemCount > 0 && (
                    <span className={styles.badge} aria-hidden="true">
                        {itemCount > 99 ? '99+' : itemCount}
                    </span>
                )}
            </span>

            {/* Label opcional */}
            {showLabel && (
                <span className={styles.label}>Carrito</span>
            )}

            {/* Total opcional */}
            {showTotal && formattedTotal && (
                <span className={styles.total}>{formattedTotal}</span>
            )}

            {/* Screen reader text */}
            <span className={styles.srOnly}>
                Carrito de compras{itemCount > 0 ? `, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}` : ', vacío'}
                {formattedTotal ? `, total ${formattedTotal}` : ''}
            </span>
        </>
    );

    // Variante detallada
    if (variant === 'detailed') {
        const detailedContent = (
            <div className={styles.detailedContent}>
                <span className={styles.iconWrapper}>
                    <span className={styles.icon}>
                        <CartIcon />
                    </span>
                    {itemCount > 0 && (
                        <span className={styles.badge} aria-hidden="true">
                            {itemCount > 99 ? '99+' : itemCount}
                        </span>
                    )}
                </span>
                <div className={styles.detailedInfo}>
                    <span className={styles.detailedLabel}>Mi Carrito</span>
                    <span className={styles.detailedValue}>
                        {itemCount === 0
                            ? 'Vacío'
                            : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`
                        }
                    </span>
                </div>
                {formattedTotal && itemCount > 0 && (
                    <span className={styles.detailedTotal}>{formattedTotal}</span>
                )}
            </div>
        );

        if (href) {
            return (
                <Link href={href} className={containerClasses}>
                    {detailedContent}
                </Link>
            );
        }

        return (
            <button type="button" className={containerClasses} onClick={onClick}>
                {detailedContent}
            </button>
        );
    }

    // Si tiene href, renderizar como Link
    if (href) {
        return (
            <Link href={href} className={containerClasses}>
                {content}
            </Link>
        );
    }

    // Si no, renderizar como button
    return (
        <button type="button" className={containerClasses} onClick={onClick}>
            {content}
        </button>
    );
}

export default MiniCart;