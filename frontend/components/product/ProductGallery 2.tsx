'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';

/**
 * Interfaz para una imagen de la galería
 */
export interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    thumbnail?: string;
}

/**
 * Props para el componente ProductGallery
 * @interface ProductGalleryProps
 */
export interface ProductGalleryProps {
    /** Lista de imágenes de la galería */
    images: GalleryImage[];
    /** Nombre del producto (para alt fallback) */
    productName?: string;
    /** Habilitar zoom al hacer hover */
    enableZoom?: boolean;
    /** Habilitar lightbox fullscreen */
    enableLightbox?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de zoom
 */
const ZoomIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
    </svg>
);

/**
 * Icono de cerrar
 */
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

/**
 * Icono de flecha izquierda
 */
const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

/**
 * Icono de flecha derecha
 */
const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

/**
 * ProductGallery - Galería de imágenes de producto
 * 
 * Características:
 * - Imagen principal con thumbnails
 * - Zoom on hover
 * - Lightbox fullscreen
 * - Navegación con flechas
 * - Soporte para teclado
 * 
 * @example
 * ```tsx
 * <ProductGallery
 *   images={[
 *     { id: '1', src: '/product-1.jpg', alt: 'Producto vista frontal' },
 *     { id: '2', src: '/product-2.jpg', alt: 'Producto vista lateral' },
 *   ]}
 *   productName="Aire Acondicionado Split"
 *   enableZoom
 *   enableLightbox
 * />
 * ```
 */
export function ProductGallery({
    images,
    productName = 'Producto',
    enableZoom = true,
    enableLightbox = true,
    className,
}: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [isZooming, setIsZooming] = useState(false);

    // Imagen seleccionada
    const selectedImage = images[selectedIndex] || images[0];

    // Navegación
    const goToPrevious = useCallback(() => {
        setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    // Abrir/cerrar lightbox
    const openLightbox = () => {
        if (enableLightbox) {
            setIsLightboxOpen(true);
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = '';
    };

    // Zoom handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableZoom) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        if (enableZoom) {
            setIsZooming(true);
        }
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isLightboxOpen) return;

        switch (e.key) {
            case 'ArrowLeft':
                goToPrevious();
                break;
            case 'ArrowRight':
                goToNext();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    }, [isLightboxOpen, goToPrevious, goToNext]);

    // Añadir/quitar event listener
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Si no hay imágenes, mostrar placeholder
    if (!images || images.length === 0) {
        return (
            <div className={`${styles.container} ${className || ''}`}>
                <div className={styles.mainImage}>
                    <div className={styles.placeholder}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Sin imagen</span>
                    </div>
                </div>
            </div>
        );
    }

    // Clases
    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Imagen principal */}
            <div
                className={styles.mainImageWrapper}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={openLightbox}
                role={enableLightbox ? 'button' : undefined}
                tabIndex={enableLightbox ? 0 : undefined}
                onKeyDown={e => {
                    if (enableLightbox && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        openLightbox();
                    }
                }}
                aria-label={enableLightbox ? 'Abrir imagen en pantalla completa' : undefined}
            >
                <div
                    className={`${styles.mainImage} ${isZooming ? styles.zooming : ''}`}
                    style={isZooming ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    } : undefined}
                >
                    <Image
                        src={selectedImage.src}
                        alt={selectedImage.alt || `${productName} - Imagen ${selectedIndex + 1}`}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={selectedIndex === 0}
                    />
                </div>

                {/* Icono de zoom */}
                {(enableZoom || enableLightbox) && (
                    <div className={styles.zoomIcon} aria-hidden="true">
                        <ZoomIcon />
                    </div>
                )}

                {/* Navegación en imagen principal (solo si hay más de 1) */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            className={`${styles.navButton} ${styles.navPrev}`}
                            onClick={e => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            type="button"
                            className={`${styles.navButton} ${styles.navNext}`}
                            onClick={e => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRightIcon />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className={styles.thumbnails} role="listbox" aria-label="Seleccionar imagen">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            className={`${styles.thumbnail} ${index === selectedIndex ? styles.active : ''}`}
                            onClick={() => setSelectedIndex(index)}
                            role="option"
                            aria-selected={index === selectedIndex}
                            aria-label={`Ver ${image.alt || `imagen ${index + 1}`}`}
                        >
                            <Image
                                src={image.thumbnail || image.src}
                                alt=""
                                fill
                                className={styles.thumbnailImage}
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    className={styles.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Galería de imágenes"
                >
                    <div className={styles.lightboxOverlay} onClick={closeLightbox} />

                    <div className={styles.lightboxContent}>
                        {/* Botón cerrar */}
                        <button
                            type="button"
                            className={styles.lightboxClose}
                            onClick={closeLightbox}
                            aria-label="Cerrar galería"
                        >
                            <CloseIcon />
                        </button>

                        {/* Imagen */}
                        <div className={styles.lightboxImageWrapper}>
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt || productName}
                                fill
                                className={styles.lightboxImage}
                                sizes="100vw"
                            />
                        </div>

                        {/* Navegación */}
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                                    onClick={goToPrevious}
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                                    onClick={goToNext}
                                    aria-label="Imagen siguiente"
                                >
                                    <ChevronRightIcon />
                                </button>
                            </>
                        )}

                        {/* Contador */}
                        <div className={styles.lightboxCounter}>
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductGallery;