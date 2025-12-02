'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    footer?: React.ReactNode;
}

/**
 * Modal - Componente de ventana modal
 * 
 * @param isOpen - Estado de visibilidad del modal
 * @param onClose - Callback para cerrar el modal
 * @param title - Título del modal
 * @param children - Contenido del modal
 * @param size - Tamaño del modal (sm, md, lg, xl)
 * @param closeOnOverlay - Cerrar al hacer click en el overlay
 * @param closeOnEscape - Cerrar al presionar Escape
 * @param showCloseButton - Mostrar botón de cerrar
 * @param footer - Contenido del footer
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnOverlay = true,
    closeOnEscape = true,
    showCloseButton = true,
    footer,
}) => {
    // Manejar tecla Escape
    const handleEscape = useCallback(
        (event: KeyboardEvent) => {
            if (closeOnEscape && event.key === 'Escape') {
                onClose();
            }
        },
        [closeOnEscape, onClose]
    );

    // Efecto para el listener de Escape y bloquear scroll
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscape]);

    // Click en overlay
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlay && event.target === event.currentTarget) {
            onClose();
        }
    };

    // No renderizar si no está abierto
    if (!isOpen) return null;

    // Renderizar con portal
    const modalContent = (
        <div
            className={styles.overlay}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div className={`${styles.modal} ${styles[size]}`}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className={styles.header}>
                        {title && (
                            <h2 id="modal-title" className={styles.title}>
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={onClose}
                                aria-label="Cerrar modal"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={styles.content}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    // Usar portal para renderizar fuera del DOM normal
    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
};