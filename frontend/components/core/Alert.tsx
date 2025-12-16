import React from 'react';
import styles from './Alert.module.css';

export interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    children: React.ReactNode;
    onClose?: () => void;
    dismissible?: boolean;
    /** ARIA role for accessibility */
    role?: string;
    /** Additional class name */
    className?: string;
}

/**
 * Alert - Componente para mostrar mensajes de alerta
 * 
 * @param type - Tipo de alerta (success, error, warning, info)
 * @param children - Contenido del mensaje
 * @param onClose - Callback cuando se cierra la alerta
 * @param dismissible - Si se puede cerrar la alerta
 */
export const Alert: React.FC<AlertProps> = ({
    type = 'info',
    children,
    onClose,
    dismissible = false,
    role = 'alert',
    className,
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className={`${styles.alert} ${styles[type]} ${className || ''}`} role={role}>
            <div className={styles.icon}>
                {getIcon()}
            </div>
            <div className={styles.content}>
                {children}
            </div>
            {dismissible && onClose && (
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Cerrar alerta"
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
