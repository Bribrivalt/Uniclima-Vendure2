/**
 * CompareButton - Botón para añadir/quitar productos de comparación
 * 
 * @description Componente reutilizable que permite a los usuarios
 * gestionar la lista de comparación de productos.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useCompare, CompareProduct } from '@/lib/hooks/useCompare';
import styles from './CompareButton.module.css';

// ========================================
// TIPOS
// ========================================

interface CompareButtonProps {
    /** Producto a añadir/quitar de comparación */
    product: Omit<CompareProduct, 'addedAt'>;
    /** Variante visual */
    variant?: 'icon' | 'text' | 'full';
    /** Tamaño */
    size?: 'sm' | 'md' | 'lg';
    /** Clases adicionales */
    className?: string;
    /** Mostrar tooltip */
    showTooltip?: boolean;
}

// ========================================
// COMPONENTE
// ========================================

/**
 * Botón para gestionar comparación de productos
 * 
 * @example
 * ```tsx
 * <CompareButton 
 *     product={{
 *         id: product.id,
 *         slug: product.slug,
 *         name: product.name,
 *         image: product.featuredAsset?.preview,
 *         price: product.variants[0].priceWithTax,
 *         inStock: true,
 *         specs: product.customFields,
 *     }}
 *     variant="icon"
 * />
 * ```
 */
export function CompareButton({
    product,
    variant = 'icon',
    size = 'md',
    className = '',
    showTooltip = true,
}: CompareButtonProps) {
    const { isInCompare, toggleProduct, isFull, count } = useCompare();
    const [showFeedback, setShowFeedback] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Evitar hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const isComparing = mounted && isInCompare(product.id);
    const canAdd = !isComparing && !isFull;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isComparing && isFull) {
            // Mostrar mensaje de límite alcanzado
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 2000);
            return;
        }

        toggleProduct(product);
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 1500);
    };

    const getButtonClasses = () => {
        const classes = [
            styles.button,
            styles[variant],
            styles[size],
            isComparing ? styles.active : '',
            className,
        ].filter(Boolean);

        return classes.join(' ');
    };

    const getTooltipText = () => {
        if (!canAdd && !isComparing) {
            return 'Límite de 4 productos alcanzado';
        }
        return isComparing ? 'Quitar de comparación' : 'Añadir a comparación';
    };

    const getButtonText = () => {
        if (variant === 'icon') return null;
        
        if (isComparing) {
            return variant === 'full' ? 'Quitar de comparación' : 'Comparando';
        }
        return variant === 'full' ? 'Añadir a comparación' : 'Comparar';
    };

    // No renderizar en servidor
    if (!mounted) {
        return (
            <button 
                className={getButtonClasses()} 
                disabled
                aria-label="Comparar producto"
            >
                <CompareIcon />
                {getButtonText() && <span>{getButtonText()}</span>}
            </button>
        );
    }

    return (
        <div className={styles.wrapper}>
            <button
                className={getButtonClasses()}
                onClick={handleClick}
                aria-label={getTooltipText()}
                aria-pressed={isComparing}
                disabled={!canAdd && !isComparing}
                title={showTooltip ? getTooltipText() : undefined}
            >
                {isComparing ? <CompareActiveIcon /> : <CompareIcon />}
                {getButtonText() && <span className={styles.text}>{getButtonText()}</span>}
            </button>

            {/* Feedback toast */}
            {showFeedback && (
                <div className={`${styles.feedback} ${isComparing ? styles.feedbackRemove : styles.feedbackAdd}`}>
                    {!canAdd && !isComparing ? (
                        'Máximo 4 productos'
                    ) : isComparing ? (
                        '✓ En comparación'
                    ) : (
                        '✓ Añadido'
                    )}
                </div>
            )}
        </div>
    );
}

// ========================================
// ICONOS
// ========================================

function CompareIcon() {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={styles.icon}
        >
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="9" rx="1" />
            <path d="M3 16h7" />
            <path d="M14 16h7" />
            <path d="M3 20h7" />
            <path d="M14 20h7" />
        </svg>
    );
}

function CompareActiveIcon() {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className={styles.icon}
        >
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="9" rx="1" />
            <path d="M3 16h7" stroke="currentColor" strokeWidth="2" />
            <path d="M14 16h7" stroke="currentColor" strokeWidth="2" />
            <path d="M3 20h7" stroke="currentColor" strokeWidth="2" />
            <path d="M14 20h7" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="4" r="3" fill="var(--color-success)" />
            <path d="M18.5 4l1 1 2-2" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
    );
}

// ========================================
// BADGE CONTADOR
// ========================================

interface CompareBadgeProps {
    className?: string;
}

/**
 * Badge que muestra el número de productos en comparación
 */
export function CompareBadge({ className = '' }: CompareBadgeProps) {
    const { count } = useCompare();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || count === 0) return null;

    return (
        <span className={`${styles.badge} ${className}`}>
            {count}
        </span>
    );
}

// ========================================
// LINK A COMPARADOR
// ========================================

interface CompareFloatingButtonProps {
    className?: string;
}

/**
 * Botón flotante que aparece cuando hay productos para comparar
 */
export function CompareFloatingButton({ className = '' }: CompareFloatingButtonProps) {
    const { count } = useCompare();
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && count > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [mounted, count]);

    if (!mounted || !isVisible) return null;

    return (
        <a
            href="/comparar"
            className={`${styles.floatingButton} ${className}`}
            aria-label={`Comparar ${count} productos`}
        >
            <CompareIcon />
            <span className={styles.floatingText}>
                Comparar ({count})
            </span>
        </a>
    );
}

export default CompareButton;