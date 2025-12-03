'use client';

import React from 'react';
import styles from './SkipLink.module.css';

/**
 * Props del componente SkipLink
 */
export interface SkipLinkProps {
    /** ID del elemento al que saltar */
    targetId?: string;
    /** Texto del enlace */
    children?: React.ReactNode;
    /** Clases CSS adicionales */
    className?: string;
}

/**
 * SkipLink - Enlace para saltar al contenido principal
 * 
 * Componente de accesibilidad que permite a los usuarios de teclado
 * y lectores de pantalla saltar directamente al contenido principal,
 * evitando la navegación repetitiva del header.
 * 
 * @example
 * ```tsx
 * // En el layout principal
 * <SkipLink targetId="main-content" />
 * <Header />
 * <main id="main-content">...</main>
 * ```
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
    targetId = 'main-content',
    children = 'Saltar al contenido principal',
    className,
}) => {
    /**
     * Maneja el clic para saltar al contenido
     */
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = document.getElementById(targetId);

        if (target) {
            // Hacer el elemento focusable temporalmente si no lo es
            if (!target.hasAttribute('tabindex')) {
                target.setAttribute('tabindex', '-1');
            }
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            className={`${styles.skipLink} ${className || ''}`}
        >
            {children}
        </a>
    );
};

export default SkipLink;