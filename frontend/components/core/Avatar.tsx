'use client';

import React from 'react';
import styles from './Avatar.module.css';

/**
 * Props para el componente Avatar
 * @interface AvatarProps
 */
export interface AvatarProps {
    /** URL de la imagen */
    src?: string;
    /** Texto alternativo para la imagen */
    alt?: string;
    /** Nombre para generar iniciales (usado si no hay imagen) */
    name?: string;
    /** Tamaño del avatar */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Forma del avatar */
    shape?: 'circle' | 'square';
    /** Color de fondo (si no hay imagen) */
    bgColor?: string;
    /** Indicador de estado (punto de color) */
    status?: 'online' | 'offline' | 'busy' | 'away';
    /** Si es clicable */
    onClick?: () => void;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Obtiene las iniciales de un nombre
 * @param name - Nombre completo
 * @returns Iniciales (máximo 2 caracteres)
 */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Genera un color consistente basado en el nombre
 * @param name - Nombre para generar color
 * @returns Color HSL
 */
function getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 45%)`;
}

/**
 * Avatar - Componente de avatar de usuario
 * 
 * Características:
 * - Soporte para imagen o iniciales
 * - Tamaños: xs, sm, md, lg, xl
 * - Formas: circle, square
 * - Indicador de estado
 * - Color automático basado en nombre
 * 
 * @example
 * ```tsx
 * // Con imagen
 * <Avatar 
 *   src="/avatar.jpg" 
 *   alt="Usuario" 
 *   size="md" 
 * />
 * 
 * // Con iniciales
 * <Avatar 
 *   name="Juan García" 
 *   size="lg" 
 * />
 * 
 * // Con estado
 * <Avatar 
 *   src="/avatar.jpg" 
 *   status="online" 
 * />
 * 
 * // Cuadrado
 * <Avatar 
 *   name="Admin" 
 *   shape="square" 
 * />
 * ```
 */
export function Avatar({
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    bgColor,
    status,
    onClick,
    className,
}: AvatarProps) {
    const [imageError, setImageError] = React.useState(false);

    // Determinar si mostrar imagen o iniciales
    const showImage = src && !imageError;
    const initials = name ? getInitials(name) : '?';
    const backgroundColor = bgColor || (name ? getColorFromName(name) : 'var(--color-surface)');

    // Handler de error de imagen
    const handleImageError = () => {
        setImageError(true);
    };

    // Determinar si es interactivo
    const isInteractive = !!onClick;
    const Element = isInteractive ? 'button' : 'div';

    // Clases CSS
    const avatarClasses = [
        styles.avatar,
        styles[size],
        styles[shape],
        isInteractive && styles.interactive,
        className,
    ].filter(Boolean).join(' ');

    return (
        <Element
            className={avatarClasses}
            onClick={onClick}
            type={isInteractive ? 'button' : undefined}
            style={{ backgroundColor: !showImage ? backgroundColor : undefined }}
            aria-label={alt || name || 'Avatar'}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={alt || name || 'Avatar'}
                    className={styles.image}
                    onError={handleImageError}
                />
            ) : (
                <span className={styles.initials}>{initials}</span>
            )}

            {/* Indicador de estado */}
            {status && (
                <span
                    className={`${styles.status} ${styles[status]}`}
                    aria-label={`Estado: ${status}`}
                />
            )}
        </Element>
    );
}

/**
 * AvatarGroup - Grupo de avatares apilados
 * 
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar name="Juan" />
 *   <Avatar name="María" />
 *   <Avatar name="Pedro" />
 *   <Avatar name="Ana" />
 * </AvatarGroup>
 * ```
 */
export interface AvatarGroupProps {
    /** Avatares */
    children: React.ReactNode;
    /** Máximo de avatares a mostrar */
    max?: number;
    /** Tamaño de los avatares */
    size?: AvatarProps['size'];
    /** Clase CSS adicional */
    className?: string;
}

export function AvatarGroup({
    children,
    max,
    size = 'md',
    className,
}: AvatarGroupProps) {
    const childArray = React.Children.toArray(children);
    const visibleChildren = max ? childArray.slice(0, max) : childArray;
    const remaining = max && childArray.length > max ? childArray.length - max : 0;

    const groupClasses = [styles.group, styles[`group-${size}`], className].filter(Boolean).join(' ');

    return (
        <div className={groupClasses} role="group" aria-label="Grupo de avatares">
            {visibleChildren.map((child, index) => (
                <div key={index} className={styles.groupItem}>
                    {React.isValidElement(child)
                        ? React.cloneElement(child, { size } as AvatarProps)
                        : child
                    }
                </div>
            ))}

            {remaining > 0 && (
                <div className={`${styles.avatar} ${styles[size]} ${styles.remaining}`}>
                    <span className={styles.initials}>+{remaining}</span>
                </div>
            )}
        </div>
    );
}

export default Avatar;