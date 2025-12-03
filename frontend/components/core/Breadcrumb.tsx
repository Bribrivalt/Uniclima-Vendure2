'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';

/**
 * Interfaz para un item del breadcrumb
 */
export interface BreadcrumbItem {
    /** Texto a mostrar */
    label: string;
    /** URL del enlace (si es el último elemento, no se usa) */
    href?: string;
    /** Icono opcional */
    icon?: React.ReactNode;
}

/**
 * Props para el componente Breadcrumb
 * @interface BreadcrumbProps
 */
export interface BreadcrumbProps {
    /** Lista de items del breadcrumb */
    items: BreadcrumbItem[];
    /** Separador entre items */
    separator?: React.ReactNode;
    /** Si se debe mostrar el icono de home en el primer item */
    showHomeIcon?: boolean;
    /** Número máximo de items a mostrar (los del medio se colapsan) */
    maxItems?: number;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de Home por defecto
 */
const HomeIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.homeIcon}
        aria-hidden="true"
    >
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
);

/**
 * Separador por defecto (chevron)
 */
const ChevronSeparator = () => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.separator}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
        />
    </svg>
);

/**
 * Icono de puntos suspensivos para items colapsados
 */
const EllipsisIcon = () => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.ellipsisIcon}
        aria-hidden="true"
    >
        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

/**
 * Breadcrumb - Componente de navegación por migas de pan
 * 
 * Características:
 * - Separadores personalizables
 * - Icono de home opcional
 * - Colapso automático de items intermedios
 * - Soporte para iconos en cada item
 * - Schema.org JSON-LD para SEO
 * - Accesible con ARIA
 * 
 * @example
 * ```tsx
 * // Básico
 * <Breadcrumb 
 *   items={[
 *     { label: 'Inicio', href: '/' },
 *     { label: 'Productos', href: '/productos' },
 *     { label: 'Aire Acondicionado', href: '/productos/aire-acondicionado' },
 *     { label: 'Split Daikin 3.5kW' }
 *   ]}
 * />
 * 
 * // Con icono de home
 * <Breadcrumb 
 *   items={[...]}
 *   showHomeIcon
 * />
 * 
 * // Con límite de items (colapsa los del medio)
 * <Breadcrumb 
 *   items={[...]}
 *   maxItems={3}
 * />
 * 
 * // Con separador personalizado
 * <Breadcrumb 
 *   items={[...]}
 *   separator="/"
 * />
 * ```
 */
export function Breadcrumb({
    items,
    separator,
    showHomeIcon = false,
    maxItems,
    className,
}: BreadcrumbProps) {
    // Determinar qué items mostrar
    const shouldCollapse = maxItems && items.length > maxItems;
    let displayItems = items;

    if (shouldCollapse && maxItems) {
        // Mantener el primero, el último y maxItems-2 del medio
        const firstItem = items[0];
        const lastItems = items.slice(-(maxItems - 1));
        displayItems = [firstItem, { label: '...', href: undefined }, ...lastItems];
    }

    // Clases CSS
    const breadcrumbClasses = [styles.breadcrumb, className].filter(Boolean).join(' ');

    // Renderizar separador
    const renderSeparator = () => {
        if (separator) {
            return <span className={styles.separator} aria-hidden="true">{separator}</span>;
        }
        return <ChevronSeparator />;
    };

    return (
        <nav
            className={breadcrumbClasses}
            aria-label="Navegación de migas de pan"
        >
            <ol className={styles.list}>
                {displayItems.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === displayItems.length - 1;
                    const isEllipsis = item.label === '...';

                    return (
                        <li key={index} className={styles.item}>
                            {/* Separador (excepto en el primero) */}
                            {!isFirst && renderSeparator()}

                            {/* Contenido del item */}
                            {isEllipsis ? (
                                <span className={styles.ellipsis} aria-hidden="true">
                                    <EllipsisIcon />
                                </span>
                            ) : isLast || !item.href ? (
                                // Último item (texto sin enlace)
                                <span
                                    className={styles.current}
                                    aria-current="page"
                                >
                                    {item.icon && (
                                        <span className={styles.itemIcon} aria-hidden="true">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className={styles.label}>{item.label}</span>
                                </span>
                            ) : (
                                // Item con enlace
                                <Link
                                    href={item.href}
                                    className={styles.link}
                                >
                                    {isFirst && showHomeIcon && !item.icon ? (
                                        <HomeIcon />
                                    ) : item.icon ? (
                                        <span className={styles.itemIcon} aria-hidden="true">
                                            {item.icon}
                                        </span>
                                    ) : null}
                                    <span className={styles.label}>{item.label}</span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

/**
 * Genera el schema JSON-LD para breadcrumbs (SEO)
 * Usar en conjunto con el componente Breadcrumb
 * 
 * @example
 * ```tsx
 * const items = [
 *   { label: 'Inicio', href: '/' },
 *   { label: 'Productos', href: '/productos' },
 * ];
 * 
 * // En el head o como script
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{
 *     __html: JSON.stringify(generateBreadcrumbSchema(items, 'https://uniclima.es'))
 *   }}
 * />
 * ```
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items
            .filter(item => item.href)
            .map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.label,
                item: `${baseUrl}${item.href}`,
            })),
    };
}

export default Breadcrumb;