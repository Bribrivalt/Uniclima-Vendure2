/**
 * CartNotification Component - Uniclima
 * 
 * Muestra notificaciones animadas del carrito:
 * - Producto añadido con preview
 * - Stock bajo
 * - Errores
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CartNotification.module.css';
import { CartNotification as CartNotificationType } from '@/lib/cart-context';

// =========================================
// ICONOS
// =========================================

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// =========================================
// COMPONENTES
// =========================================

interface CartNotificationProps {
    notification: CartNotificationType;
    onClose: () => void;
}

export function CartNotificationItem({ notification, onClose }: CartNotificationProps) {
    const [isExiting, setIsExiting] = useState(false);

    // Animación de salida
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(), 300);
    };

    // Auto-cerrar después de 5 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 4700);

        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (notification.type) {
            case 'added':
                return <CheckIcon />;
            case 'removed':
                return <TrashIcon />;
            case 'updated':
                return <RefreshIcon />;
            case 'low_stock':
                return <AlertIcon />;
            case 'error':
                return <AlertIcon />;
            default:
                return <CheckIcon />;
        }
    };

    const getIconClass = () => {
        switch (notification.type) {
            case 'added':
                return styles.iconSuccess;
            case 'removed':
                return styles.iconInfo;
            case 'updated':
                return styles.iconInfo;
            case 'low_stock':
                return styles.iconWarning;
            case 'error':
                return styles.iconError;
            default:
                return styles.iconSuccess;
        }
    };

    return (
        <div
            className={`${styles.notification} ${isExiting ? styles.exiting : ''}`}
            role="alert"
            aria-live="polite"
        >
            {/* Icono */}
            <div className={`${styles.icon} ${getIconClass()}`}>
                {getIcon()}
            </div>

            {/* Contenido */}
            <div className={styles.content}>
                {/* Imagen del producto si existe */}
                {notification.productImage && (
                    <div className={styles.productImage}>
                        <Image
                            src={notification.productImage}
                            alt={notification.productName || ''}
                            fill
                            className={styles.image}
                            sizes="48px"
                        />
                    </div>
                )}

                {/* Mensaje */}
                <div className={styles.textContent}>
                    {notification.productName && (
                        <span className={styles.productName}>{notification.productName}</span>
                    )}
                    <span className={styles.message}>{notification.message}</span>
                </div>
            </div>

            {/* Botón Ver carrito para notificación de añadido */}
            {notification.type === 'added' && (
                <Link href="/carrito" className={styles.viewCartButton} onClick={handleClose}>
                    Ver carrito
                </Link>
            )}

            {/* Botón cerrar */}
            <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Cerrar notificación"
            >
                <CloseIcon />
            </button>

            {/* Barra de progreso */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} />
            </div>
        </div>
    );
}

// =========================================
// CONTENEDOR DE NOTIFICACIONES
// =========================================

interface CartNotificationsContainerProps {
    notifications: CartNotificationType[];
    onClearNotification: (id: string) => void;
}

export function CartNotificationsContainer({
    notifications,
    onClearNotification
}: CartNotificationsContainerProps) {
    if (notifications.length === 0) return null;

    return (
        <div className={styles.container} aria-label="Notificaciones del carrito">
            {notifications.slice(-3).map(notification => (
                <CartNotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={() => onClearNotification(notification.id)}
                />
            ))}
        </div>
    );
}

export default CartNotificationsContainer;