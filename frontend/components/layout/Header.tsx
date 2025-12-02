'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import styles from './Header.module.css';

export default function Header() {
    const { currentUser, isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Obtener carrito activo para mostrar contador
    const { data: cartData } = useQuery(GET_ACTIVE_ORDER);
    const cartItemCount = cartData?.activeOrder?.totalQuantity || 0;

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>🌡️</span>
                        <span className={styles.logoText}>Uniclima</span>
                    </Link>

                    {/* Menú de navegación */}
                    <div className={styles.menu}>
                        <Link href="/" className={styles.menuLink}>Inicio</Link>
                        <Link href="/productos" className={styles.menuLink}>Productos</Link>
                        <Link href="/servicios" className={styles.menuLink}>Servicios</Link>
                        <Link href="/repuestos" className={styles.menuLink}>Repuestos</Link>
                        <Link href="/conocenos" className={styles.menuLink}>Conócenos</Link>
                        <Link href="/contacto" className={styles.menuLink}>Contacto</Link>
                    </div>

                    {/* Iconos de acción */}
                    <div className={styles.actions}>
                        {/* Usuario / Login */}
                        {isAuthenticated && currentUser ? (
                            <div className={styles.userMenu} ref={dropdownRef}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                    aria-label="Mi cuenta"
                                >
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <div className={styles.dropdownHeader}>
                                            <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                                            <span>{currentUser.emailAddress}</span>
                                        </div>
                                        <Link href="/cuenta" className={styles.dropdownItem}>
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Mi Cuenta
                                        </Link>
                                        <Link href="/pedidos" className={styles.dropdownItem}>
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Mis Pedidos
                                        </Link>
                                        <div className={styles.dropdownDivider} />
                                        <button onClick={handleLogout} className={styles.dropdownItem}>
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className={styles.iconButton} aria-label="Iniciar sesión">
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        )}

                        {/* Búsqueda */}
                        <button className={styles.iconButton} aria-label="Buscar">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Carrito con contador */}
                        <Link href="/carrito" className={styles.cartButton} aria-label="Carrito">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className={styles.cartBadge}>{cartItemCount}</span>
                            )}
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
