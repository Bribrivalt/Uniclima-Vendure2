/**
 * Header Component - Uniclima
 *
 * Barra de navegación principal con:
 * - Logo de la marca
 * - Menú de navegación con dropdown de categorías
 * - Botones de usuario, búsqueda y carrito
 * - Contador de items en el carrito
 * - CartDrawer integrado que se abre al hacer click en el carrito
 *
 * Las categorías se cargan dinámicamente desde Vendure Collections.
 *
 * @author Frontend Team
 * @version 1.2.0
 */
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import { ADJUST_ORDER_LINE, REMOVE_ORDER_LINE } from '@/lib/vendure/mutations/cart';
import { GET_COLLECTIONS } from '@/lib/vendure/queries/products';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { OrderLine } from '@/components/cart/CartItem';
import { useToast } from '@/components/ui/Toast';
import styles from './Header.module.css';

/**
 * Interfaz para una Collection de Vendure
 */
interface Collection {
    id: string;
    name: string;
    slug: string;
    featuredAsset?: {
        id: string;
        preview: string;
    };
}

/**
 * Interfaz para la respuesta de GET_ACTIVE_ORDER
 */
interface ActiveOrderData {
    activeOrder: {
        id: string;
        code: string;
        totalQuantity: number;
        subTotal: number;
        subTotalWithTax: number;
        total: number;
        totalWithTax: number;
        lines: OrderLine[];
    } | null;
}

/**
 * Componente Header principal
 * Incluye navegación, categorías dinámicas, acciones de usuario y CartDrawer
 */
export default function Header() {
    const { currentUser, isAuthenticated, logout } = useAuth();
    const { showToast } = useToast();

    // Estado para dropdown de usuario
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    // Estado para dropdown de categorías (Productos)
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    // Estado para el drawer del carrito
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

    // Referencia para cerrar dropdowns al hacer click fuera
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const categoriesDropdownRef = useRef<HTMLDivElement>(null);

    // Query para obtener carrito activo con todos los datos necesarios para el drawer
    const { data: cartData, refetch: refetchCart } = useQuery<ActiveOrderData>(GET_ACTIVE_ORDER, {
        // Usar cache-and-network para tener datos actualizados
        fetchPolicy: 'cache-and-network',
    });

    // Extraer datos del carrito
    const activeOrder = cartData?.activeOrder;
    const cartItemCount = activeOrder?.totalQuantity || 0;
    const cartItems: OrderLine[] = activeOrder?.lines || [];
    const cartSubtotal = activeOrder?.subTotalWithTax || 0;
    const cartTotal = activeOrder?.totalWithTax || 0;

    // Query para obtener categorías (Collections) desde Vendure
    const { data: collectionsData } = useQuery(GET_COLLECTIONS);
    const collections: Collection[] = collectionsData?.collections?.items || [];

    // Mutation para ajustar cantidad de un producto en el carrito
    const [adjustOrderLine, { loading: adjusting }] = useMutation(ADJUST_ORDER_LINE, {
        onCompleted: () => {
            refetchCart();
        },
        onError: (error) => {
            console.error('Error adjusting quantity:', error);
            showToast('Error al actualizar cantidad', 'error');
        },
    });

    // Mutation para eliminar un producto del carrito
    const [removeOrderLine, { loading: removing }] = useMutation(REMOVE_ORDER_LINE, {
        onCompleted: () => {
            refetchCart();
            showToast('Producto eliminado del carrito', 'success');
        },
        onError: (error) => {
            console.error('Error removing item:', error);
            showToast('Error al eliminar producto', 'error');
        },
    });

    /**
     * Handler para actualizar la cantidad de un producto en el carrito
     */
    const handleUpdateQuantity = (lineId: string, quantity: number) => {
        adjustOrderLine({
            variables: { orderLineId: lineId, quantity },
        });
    };

    /**
     * Handler para eliminar un producto del carrito
     */
    const handleRemoveItem = (lineId: string) => {
        removeOrderLine({
            variables: { orderLineId: lineId },
        });
    };

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Cerrar dropdown de usuario
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
            // Cerrar dropdown de categorías
            if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
                setIsCategoriesOpen(false);
            }
        };

        if (isUserDropdownOpen || isCategoriesOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserDropdownOpen, isCategoriesOpen]);

    /**
     * Handler para cerrar sesión
     */
    const handleLogout = async () => {
        await logout();
        setIsUserDropdownOpen(false);
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

                    {/* Menú de navegación principal */}
                    <div className={styles.menu}>
                        <Link href="/" className={styles.menuLink}>Inicio</Link>

                        {/* Dropdown de Productos/Categorías */}
                        <div
                            className={styles.menuDropdown}
                            ref={categoriesDropdownRef}
                            onMouseEnter={() => setIsCategoriesOpen(true)}
                            onMouseLeave={() => setIsCategoriesOpen(false)}
                        >
                            <Link href="/productos" className={styles.menuLink}>
                                Productos
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className={`${styles.menuChevron} ${isCategoriesOpen ? styles.menuChevronOpen : ''}`}
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </Link>

                            {/* Dropdown de categorías */}
                            {isCategoriesOpen && collections.length > 0 && (
                                <div className={styles.categoriesDropdown}>
                                    <div className={styles.categoriesGrid}>
                                        {/* Ver todos los productos */}
                                        <Link
                                            href="/productos"
                                            className={styles.categoryItem}
                                            onClick={() => setIsCategoriesOpen(false)}
                                        >
                                            <div className={styles.categoryIcon}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="7" height="7" />
                                                    <rect x="14" y="3" width="7" height="7" />
                                                    <rect x="14" y="14" width="7" height="7" />
                                                    <rect x="3" y="14" width="7" height="7" />
                                                </svg>
                                            </div>
                                            <span>Ver Todo</span>
                                        </Link>

                                        {/* Categorías desde Vendure */}
                                        {collections.map((collection) => (
                                            <Link
                                                key={collection.id}
                                                href={`/productos?collection=${collection.slug}`}
                                                className={styles.categoryItem}
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                {collection.featuredAsset ? (
                                                    <img
                                                        src={collection.featuredAsset.preview}
                                                        alt={collection.name}
                                                        className={styles.categoryImage}
                                                    />
                                                ) : (
                                                    <div className={styles.categoryIcon}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span>{collection.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/servicios" className={styles.menuLink}>Servicios</Link>
                        <Link href="/repuestos" className={styles.menuLink}>Repuestos</Link>
                        <Link href="/conocenos" className={styles.menuLink}>Conócenos</Link>
                        <Link href="/contacto" className={styles.menuLink}>Contacto</Link>
                    </div>

                    {/* Iconos de acción */}
                    <div className={styles.actions}>
                        {/* Usuario / Login */}
                        {isAuthenticated && currentUser ? (
                            <div className={styles.userMenu} ref={userDropdownRef}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    aria-expanded={isUserDropdownOpen}
                                    aria-haspopup="true"
                                    aria-label="Mi cuenta"
                                >
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                {isUserDropdownOpen && (
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

                        {/* Carrito con contador - Abre el drawer en lugar de navegar */}
                        <button
                            className={styles.cartButton}
                            aria-label="Ver carrito"
                            onClick={() => setIsCartDrawerOpen(true)}
                        >
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className={styles.cartBadge}>{cartItemCount}</span>
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* CartDrawer - Panel lateral para ver/editar carrito sin cambiar de página */}
            <CartDrawer
                isOpen={isCartDrawerOpen}
                onClose={() => setIsCartDrawerOpen(false)}
                items={cartItems}
                subtotal={cartSubtotal}
                total={cartTotal}
                itemCount={cartItemCount}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                loading={adjusting || removing}
            />
        </header>
    );
}
