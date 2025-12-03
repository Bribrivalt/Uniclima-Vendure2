'use client';

import React from 'react';
import styles from './Badge.module.css';

/**
 * Props para el componente Badge
 * @interface BadgeProps
 */
export interface BadgeProps {
    /** Contenido del badge (texto o número) */
    children: React.ReactNode;
    /** Variante de color del badge */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
    /** Tamaño del badge */
    size?: 'sm' | 'md' | 'lg';
    /** Estilo del badge */
    style?: 'solid' | 'outline' | 'subtle';
    /** Si el badge tiene forma de píldora (bordes muy redondeados) */
    pill?: boolean;
    /** Icono a mostrar antes del texto */
    icon?: React.ReactNode;
    /** Si el badge tiene un punto indicador */
    dot?: boolean;
    /** Clase CSS adicional */
    className?: string;
    /** Callback al hacer clic (convierte el badge en interactivo) */
    onClick?: () => void;
    /** Si se puede cerrar/eliminar */
    removable?: boolean;
    /** Callback al cerrar */
    onRemove?: () => void;
}

/**
 * Badge - Componente de etiqueta/indicador visual
 * 
 * Características:
 * - Variantes de color: default, primary, success, warning, error, info
 * - Tamaños: sm, md, lg
 * - Estilos: solid, outline, subtle
 * - Soporte para iconos
 * - Opción de punto indicador (dot)
 * - Opción removable con botón de cierre
 * 
 * @example
 * ```tsx
 * // Básico
 * <Badge>Nuevo</Badge>
 * 
 * // Con variante de color
 * <Badge variant="success">Activo</Badge>
 * <Badge variant="error">Error</Badge>
 * 
 * // Con icono
 * <Badge variant="info" icon={<InfoIcon />}>Información</Badge>
 * 
 * // Con punto indicador
 * <Badge dot variant="success">En línea</Badge>
 * 
 * // Removable
 * <Badge removable onRemove={() => handleRemove()}>Filtro activo</Badge>
 * 
 * // Como píldora
 * <Badge pill variant="primary">Premium</Badge>
 * ```
 */
export function Badge({
    children,
    variant = 'default',
    size = 'md',
    style: badgeStyle = 'solid',
    pill = false,
    icon,
    dot = false,
    className,
    onClick,
    removable = false,
    onRemove,
}: BadgeProps) {
    // Determinar si es interactivo
    const isInteractive = !!onClick;

    // Clases CSS
    const badgeClasses = [
        styles.badge,
        styles[variant],
        styles[size],
        styles[badgeStyle],
        pill && styles.pill,
        isInteractive && styles.interactive,
        className,
    ].filter(Boolean).join(' ');

    // Elemento base (button si es interactivo, span si no)
    const Element = isInteractive ? 'button' : 'span';

    // Handler para remover
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.();
    };

    return (
        <Element
            className={badgeClasses}
            onClick={onClick}
            type={isInteractive ? 'button' : undefined}
            aria-label={isInteractive ? `Badge: ${children}` : undefined}
        >
            {/* Punto indicador */}
            {dot && <span className={styles.dot} aria-hidden="true" />}

            {/* Icono */}
            {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}

            {/* Contenido */}
            <span className={styles.content}>{children}</span>

            {/* Botón de cerrar */}
            {removable && (
                <button
                    type="button"
                    className={styles.removeButton}
                    onClick={handleRemove}
                    aria-label="Eliminar"
                >
                    <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.removeIcon}
                        aria-hidden="true"
                    >
                        <path
                            d="M12 4L4 12M4 4L12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            )}
        </Element>
    );
}

/**
 * BadgeGroup - Contenedor para agrupar múltiples badges
 * 
 * @example
 * ```tsx
 * <BadgeGroup>
 *   <Badge variant="primary">React</Badge>
 *   <Badge variant="primary">TypeScript</Badge>
 *   <Badge variant="primary">Next.js</Badge>
 * </BadgeGroup>
 * ```
 */
export interface BadgeGroupProps {
    /** Badges a mostrar */
    children: React.ReactNode;
    /** Clase CSS adicional */
    className?: string;
}

export function BadgeGroup({ children, className }: BadgeGroupProps) {
    const groupClasses = [styles.group, className].filter(Boolean).join(' ');

    return (
        <div className={groupClasses} role="list">
            {React.Children.map(children, (child, index) => (
                <div role="listitem" key={index}>
                    {child}
                </div>
            ))}
        </div>
    );
}

export default Badge;