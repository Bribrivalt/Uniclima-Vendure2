/**
 * OptimizedImage Component
 * 
 * Componente de imagen optimizada con:
 * - Lazy loading nativo
 * - Placeholder blur mientras carga
 * - Soporte para formatos modernos (WebP, AVIF)
 * - Responsive sizing automático
 * - Error handling con fallback
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import styles from './OptimizedImage.module.css';

/**
 * Placeholder blur genérico para imágenes de productos
 */
const DEFAULT_BLUR_DATA_URL = 
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSITFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AqbZ3he6lt7e9tHt5YwVKq4ZW+EEUpSlIbG3dgAHyRXZ//9k=';

/**
 * Placeholder para categorías/servicios
 */
const CATEGORY_BLUR_DATA_URL = 
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIRAAAgEDBAMBAAAAAAAAAAAAAQIDAAQGBREHITESQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAQADAQEAAAAAAAAAAAAAAAECAAMhMf/aAAwDAQACEQMRAD8A0jjrNrzM8Ss7+7v55LiSNlaRnJLHu9/h7r0Gq6Np19JA+oWcM7xnlG8gYqfdKUpFjSZmVz2If/Z';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
    /** URL de imagen fallback si la principal falla */
    fallbackSrc?: string;
    /** Tipo de placeholder blur a usar */
    blurType?: 'product' | 'category' | 'custom';
    /** Mostrar skeleton mientras carga */
    showSkeleton?: boolean;
    /** Aspect ratio para el contenedor */
    aspectRatio?: '1/1' | '4/3' | '16/9' | '3/4' | 'auto';
}

/**
 * Componente de imagen optimizada con lazy loading y manejo de errores
 */
export function OptimizedImage({
    src,
    alt,
    fallbackSrc = '/placeholder-product.png',
    blurType = 'product',
    showSkeleton = true,
    aspectRatio = 'auto',
    className = '',
    ...props
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Seleccionar blur data URL según tipo
    const blurDataURL = blurType === 'category' 
        ? CATEGORY_BLUR_DATA_URL 
        : DEFAULT_BLUR_DATA_URL;

    /**
     * Handler para errores de carga de imagen
     */
    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImageSrc(fallbackSrc);
        }
    };

    /**
     * Handler cuando la imagen termina de cargar
     */
    const handleLoad = () => {
        setIsLoading(false);
    };

    // Generar clase de aspect ratio
    const aspectClass = aspectRatio !== 'auto' 
        ? styles[`aspect${aspectRatio.replace('/', '')}`] 
        : '';

    return (
        <div className={`${styles.imageContainer} ${aspectClass} ${className}`}>
            {showSkeleton && isLoading && (
                <div className={styles.skeleton} aria-hidden="true" />
            )}
            <Image
                src={imageSrc}
                alt={alt}
                loading="lazy"
                placeholder="blur"
                blurDataURL={blurDataURL}
                onError={handleError}
                onLoad={handleLoad}
                className={`${styles.image} ${isLoading ? styles.imageLoading : styles.imageLoaded}`}
                {...props}
            />
        </div>
    );
}

/**
 * Variante específica para imágenes de producto
 */
export function ProductImage({
    src,
    alt,
    priority = false,
    ...props
}: Omit<OptimizedImageProps, 'blurType'> & { priority?: boolean }) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            blurType="product"
            aspectRatio="1/1"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={75}
            loading={priority ? 'eager' : 'lazy'}
            {...props}
        />
    );
}

/**
 * Variante específica para imágenes de categoría/banner
 */
export function CategoryImage({
    src,
    alt,
    ...props
}: Omit<OptimizedImageProps, 'blurType'>) {
    return (
        <OptimizedImage
            src={src}
            alt={alt}
            blurType="category"
            aspectRatio="16/9"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
            {...props}
        />
    );
}

export default OptimizedImage;