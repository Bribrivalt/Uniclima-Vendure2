'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/core';
import styles from './AccountSidebar.module.css';

/**
 * Props para el componente AccountSidebar
 * @interface AccountSidebarProps
 */
export interface AccountSidebarProps {
    /** Clase CSS adicional */
    className?: string;
    /** Mostrar avatar del usuario */
    showAvatar?: boolean;
    /** Mostrar información del usuario */
    showUserInfo?: boolean;
    /** Items de navegación personalizados */
    customItems?: NavigationItem[];
}

/**
 * Interfaz para item de navegación
 */
interface NavigationItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: number;
}

/**
 * Iconos para navegación
 */
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const PackageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12.89 1.45l8 4A2 2 0 0122 7.24v9.53a2 2 0 01-1.11 1.79l-8 4a2 2 0 01-1.79 0l-8-4a2 2 0 01-1.1-1.8V7.24a2 2 0 011.11-1.79l8-4a2 2 0 011.78 0z" />
        <polyline points="2.32,6.16 12,11 21.68,6.16" />
        <line x1="12" y1="22.76" x2="12" y2="11" />
    </svg>
);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const MapPinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const CreditCardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const LogOutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

/**
 * Items de navegación predeterminados
 */
const defaultNavigationItems: NavigationItem[] = [
    { label: 'Mi perfil', href: '/cuenta', icon: <UserIcon /> },
    { label: 'Mis pedidos', href: '/cuenta/pedidos', icon: <PackageIcon /> },
    { label: 'Lista de deseos', href: '/cuenta/favoritos', icon: <HeartIcon /> },
    { label: 'Direcciones', href: '/cuenta/direcciones', icon: <MapPinIcon /> },
    { label: 'Métodos de pago', href: '/cuenta/pagos', icon: <CreditCardIcon /> },
    { label: 'Configuración', href: '/cuenta/configuracion', icon: <SettingsIcon /> },
];

/**
 * AccountSidebar - Barra lateral de navegación de cuenta
 * 
 * Proporciona navegación para las diferentes secciones del área de cuenta
 * del usuario, incluyendo perfil, pedidos, direcciones y configuración.
 * 
 * @example
 * ```tsx
 * <AccountSidebar
 *   showAvatar
 *   showUserInfo
 * />
 * ```
 */
export function AccountSidebar({
    className,
    showAvatar = true,
    showUserInfo = true,
    customItems,
}: AccountSidebarProps) {
    const pathname = usePathname();
    const { currentUser, logout } = useAuth();

    const navigationItems = customItems || defaultNavigationItems;

    // Determinar si un enlace está activo
    const isActive = (href: string) => {
        if (href === '/cuenta') {
            return pathname === '/cuenta';
        }
        return pathname?.startsWith(href);
    };

    // Handler para cerrar sesión
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const containerClasses = [styles.sidebar, className].filter(Boolean).join(' ');

    return (
        <aside className={containerClasses} aria-label="Navegación de cuenta">
            {/* Header con info del usuario */}
            {(showAvatar || showUserInfo) && currentUser && (
                <div className={styles.userSection}>
                    {showAvatar && (
                        <Avatar
                            name={`${currentUser.firstName} ${currentUser.lastName}`}
                            size="lg"
                            className={styles.avatar}
                        />
                    )}
                    {showUserInfo && (
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>
                                {currentUser.firstName} {currentUser.lastName}
                            </p>
                            <p className={styles.userEmail}>{currentUser.emailAddress}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Navegación */}
            <nav className={styles.navigation}>
                <ul className={styles.navList}>
                    {navigationItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                            >
                                {item.icon && (
                                    <span className={styles.navIcon}>{item.icon}</span>
                                )}
                                <span className={styles.navLabel}>{item.label}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={styles.navBadge}>{item.badge}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Botón de cerrar sesión */}
            <div className={styles.footer}>
                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                >
                    <span className={styles.navIcon}><LogOutIcon /></span>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
}

export default AccountSidebar;