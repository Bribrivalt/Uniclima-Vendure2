'use client';

import React from 'react';
import Link from 'next/link';
import styles from './CartEmpty.module.css';

/**
 * Props para el componente CartEmpty
 * @interface CartEmptyProps
 */
export interface CartEmptyProps {
    /** Título personalizado */
    title?: string;
    /** Descripción personalizada */
    description?: string;
    /** Texto del botón de acción */
    actionText?: string;
    /** URL del botón de acción */
    actionUrl?: string;
    /** Mostrar productos sugeridos */
    showSuggestions?: boolean;
    /** Callback al hacer clic en el botón */
    onActionClick?: () => void;
    /** Variante de visualización */
    variant?: 'default' | 'compact' | 'inline';
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de carrito vacío
 */
const EmptyCartIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Icono de flecha para el botón
 */
const ArrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * CartEmpty - Estado vacío del carrito
 * 
 * Componente visual que se muestra cuando el carrito está vacío.
 * Incluye icono, mensaje y llamada a la acción.
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <CartEmpty />
 * 
 * // Con mensaje personalizado
 * <CartEmpty
 *   title="¡Tu carrito está vacío!"
 *   description="Explora nuestro catálogo y encuentra lo que necesitas"
 *   actionText="Ver productos"
 *   actionUrl="/productos"
 * />
 * 
 * // Versión compacta para drawer
 * <CartEmpty variant="compact" />
 * ```
 */
export function CartEmpty({
    title = 'Tu carrito está vacío',
    description = 'Parece que aún no has añadido ningún producto. ¡Explora nuestro catálogo y encuentra lo que necesitas!',
    actionText = 'Explorar productos',
    actionUrl = '/productos',
    showSuggestions = false,
    onActionClick,
    variant = 'default',
    className,
}: CartEmptyProps) {
    const containerClasses = [
        styles.container,
        styles[`variant-${variant}`],
        className,
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent) => {
        if (onActionClick) {
            onActionClick();
        }
    };

    return (
        <div className={containerClasses}>
            {/* Ilustración/Icono */}
            <div className={styles.illustration}>
                <EmptyCartIcon />
            </div>

            {/* Contenido */}
            <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
            </div>

            {/* Acción principal */}
            <Link
                href={actionUrl}
                className={styles.actionButton}
                onClick={handleClick}
            >
                <span>{actionText}</span>
                <span className={styles.actionIcon}>
                    <ArrowIcon />
                </span>
            </Link>

            {/* Sugerencias de categorías */}
            {showSuggestions && variant === 'default' && (
                <div className={styles.suggestions}>
                    <p className={styles.suggestionsLabel}>Categorías populares:</p>
                    <div className={styles.suggestionsLinks}>
                        <Link href="/productos?categoria=aire-acondicionado" className={styles.suggestionLink}>
                            Aire Acondicionado
                        </Link>
                        <Link href="/productos?categoria=calefaccion" className={styles.suggestionLink}>
                            Calefacción
                        </Link>
                        <Link href="/productos?categoria=ventilacion" className={styles.suggestionLink}>
                            Ventilación
                        </Link>
                        <Link href="/repuestos" className={styles.suggestionLink}>
                            Repuestos
                        </Link>
                    </div>
                </div>
            )}

            {/* Información adicional */}
            {variant === 'default' && (
                <div className={styles.benefits}>
                    <div className={styles.benefit}>
                        <span className={styles.benefitIcon}>🚚</span>
                        <span className={styles.benefitText}>Envío gratis a partir de 100€</span>
                    </div>
                    <div className={styles.benefit}>
                        <span className={styles.benefitIcon}>🔄</span>
                        <span className={styles.benefitText}>Devoluciones en 14 días</span>
                    </div>
                    <div className={styles.benefit}>
                        <span className={styles.benefitIcon}>🛡️</span>
                        <span className={styles.benefitText}>Garantía en todos los productos</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartEmpty;