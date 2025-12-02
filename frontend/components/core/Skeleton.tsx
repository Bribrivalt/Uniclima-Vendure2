import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    lines?: number;
    className?: string;
    animate?: boolean;
}

/**
 * Skeleton - Componente para estados de carga
 * 
 * @param variant - Forma del skeleton (text, circular, rectangular)
 * @param width - Ancho del skeleton
 * @param height - Alto del skeleton
 * @param lines - Número de líneas (solo para variant text)
 * @param className - Clases CSS adicionales
 * @param animate - Activar animación de pulso
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    lines = 1,
    className = '',
    animate = true,
}) => {
    const getStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {};

        if (width) {
            style.width = typeof width === 'number' ? `${width}px` : width;
        }

        if (height) {
            style.height = typeof height === 'number' ? `${height}px` : height;
        }

        return style;
    };

    const classNames = [
        styles.skeleton,
        styles[variant],
        animate ? styles.animate : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Para múltiples líneas de texto
    if (variant === 'text' && lines > 1) {
        return (
            <div className={styles.textContainer}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={classNames}
                        style={{
                            ...getStyle(),
                            width: index === lines - 1 ? '75%' : '100%', // Última línea más corta
                        }}
                    />
                ))}
            </div>
        );
    }

    return <div className={classNames} style={getStyle()} />;
};

// Componentes predefinidos para casos comunes
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`${styles.card} ${className || ''}`}>
        <Skeleton variant="rectangular" height={200} />
        <div className={styles.cardContent}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" lines={2} />
            <div className={styles.cardFooter}>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="rectangular" width={100} height={36} />
            </div>
        </div>
    </div>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
    <Skeleton variant="circular" width={size} height={size} />
);

export const SkeletonButton: React.FC<{ width?: number }> = ({ width = 120 }) => (
    <Skeleton variant="rectangular" width={width} height={40} />
);