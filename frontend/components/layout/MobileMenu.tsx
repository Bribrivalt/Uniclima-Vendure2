'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import styles from './MobileMenu.module.css';

/**
 * Elemento de navegación del menú móvil
 */
export interface MobileMenuItem {
    /** Etiqueta visible del enlace */
    label: string;
    /** URL de destino */
    href: string;
    /** Icono opcional (emoji o componente) */
    icon?: React.ReactNode;
    /** Subitems para menús anidados */
    children?: MobileMenuItem[];
}

/**
 * Props del componente MobileMenu
 */
export interface MobileMenuProps {
    /** Si el menú está abierto */
    isOpen: boolean;
    /** Callback para cerrar el menú */
    onClose: () => void;
    /** Items de navegación */
    items: MobileMenuItem[];
    /** Logo o título del sitio */
    logo?: React.ReactNode;
    /** Clases CSS adicionales */
    className?: string;
}

/**
 * MobileMenu - Menú de navegación móvil desplegable
 * 
 * Drawer lateral con navegación completa para dispositivos móviles.
 * Incluye focus trap, cierre con Escape y overlay clickeable.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <MobileMenu
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   items={[
 *     { label: 'Inicio', href: '/' },
 *     { label: 'Productos', href: '/productos' },
 *   ]}
 * />
 * ```
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    items,
    logo,
    className,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Activar focus trap cuando el menú está abierto
    useFocusTrap(isOpen);

    /**
     * Cerrar el menú con la tecla Escape
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';
            // Enfocar el botón de cierre
            closeButtonRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    /**
     * Renderiza un item del menú
     */
    const renderMenuItem = (item: MobileMenuItem, index: number) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
            <li key={index} className={styles.menuItem}>
                <Link
                    href={item.href}
                    className={styles.menuLink}
                    onClick={onClose}
                >
                    {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
                    <span className={styles.menuLabel}>{item.label}</span>
                </Link>
                {hasChildren && (
                    <ul className={styles.submenu}>
                        {item.children!.map((child, childIndex) => (
                            <li key={childIndex} className={styles.submenuItem}>
                                <Link
                                    href={child.href}
                                    className={styles.submenuLink}
                                    onClick={onClose}
                                >
                                    {child.icon && <span className={styles.menuIcon}>{child.icon}</span>}
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={styles.overlay}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer del menú */}
            <nav
                ref={menuRef}
                className={`${styles.drawer} ${className || ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
            >
                {/* Header del menú */}
                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        {logo || <span className={styles.siteName}>Uniclima</span>}
                    </div>
                    <button
                        ref={closeButtonRef}
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar menú"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={styles.closeIcon}
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido del menú */}
                <div className={styles.content}>
                    <ul className={styles.menuList}>
                        {items.map((item, index) => renderMenuItem(item, index))}
                    </ul>
                </div>

                {/* Footer del menú */}
                <div className={styles.footer}>
                    <Link
                        href="/login"
                        className={styles.footerLink}
                        onClick={onClose}
                    >
                        👤 Iniciar sesión
                    </Link>
                    <Link
                        href="/contacto"
                        className={styles.footerLink}
                        onClick={onClose}
                    >
                        📞 Contacto
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default MobileMenu;