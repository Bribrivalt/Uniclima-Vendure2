/**
 * Header Component - Uniclima Solutions
 *
 * Barra de navegación principal profesional con:
 * - Logo corporativo
 * - Menú de navegación con dropdown de categorías
 * - Barra de búsqueda integrada
 * - Botones de usuario, búsqueda y carrito
 * - CartDrawer integrado
 * - Menú móvil responsive
 *
 * Estilo inspirado en uniclimasolutions.com
 *
 * @author Frontend Team
 * @version 2.0.0
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
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
 * Icono del logo Uniclima
 */
const UniclimLogoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

/**
 * Icono de usuario
 */
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

/**
 * Icono de búsqueda
 */
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

/**
 * Icono de carrito
 */
const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

/**
 * Icono de menú hamburguesa
 */
const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

/**
 * Icono de grid
 */
const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

/**
 * Icono de capa/categoría
 */
const LayersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

/**
 * Icono de pedidos
 */
const PackageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

/**
 * Icono de logout
 */
const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

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
 */
export default function Header() {
    const { currentUser, isAuthenticated, logout } = useAuth();
    const { showToast } = useToast();

    // Estados
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Referencias
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const categoriesDropdownRef = useRef<HTMLDivElement>(null);

    // Query para obtener carrito activo
    const { data: cartData, refetch: refetchCart } = useQuery<ActiveOrderData>(GET_ACTIVE_ORDER, {
        fetchPolicy: 'cache-and-network',
    });

    // Extraer datos del carrito
    const activeOrder = cartData?.activeOrder;
    const cartItemCount = activeOrder?.totalQuantity || 0;
    const cartItems: OrderLine[] = activeOrder?.lines || [];
    const cartSubtotal = activeOrder?.subTotalWithTax || 0;
    const cartTotal = activeOrder?.totalWithTax || 0;

    // Query para obtener categorías
    const { data: collectionsData } = useQuery(GET_COLLECTIONS);
    const collections: Collection[] = collectionsData?.collections?.items || [];

    // Mutations
    const [adjustOrderLine, { loading: adjusting }] = useMutation(ADJUST_ORDER_LINE, {
        onCompleted: () => refetchCart(),
        onError: (error) => {
            console.error('Error adjusting quantity:', error);
            showToast('Error al actualizar cantidad', 'error');
        },
    });

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

    // Handlers
    const handleUpdateQuantity = (lineId: string, quantity: number) => {
        adjustOrderLine({ variables: { orderLineId: lineId, quantity } });
    };

    const handleRemoveItem = (lineId: string) => {
        removeOrderLine({ variables: { orderLineId: lineId } });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsUserDropdownOpen(false);
    };

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
            if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
                setIsCategoriesOpen(false);
            }
        };

        if (isUserDropdownOpen || isCategoriesOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserDropdownOpen, isCategoriesOpen]);

    return (
        <header className={styles.header} role="banner">
            <div className={styles.container}>
                <nav className={styles.nav} aria-label="Navegación principal">
                    {/* Logo */}
                    <Link href="/" className={styles.logo} aria-label="Uniclima Solutions - Ir a inicio">
                        <div className={styles.logoIcon} aria-hidden="true">
                            <UniclimLogoIcon />
                        </div>
                        <div className={styles.logoText}>
                            <span className={styles.logoName}>UNICLIMA</span>
                            <span className={styles.logoTagline}>SOLUTIONS</span>
                        </div>
                    </Link>

                    {/* Menú de navegación */}
                    <div className={styles.menu} role="menubar" aria-label="Menú principal">
                        <Link href="/" className={styles.menuLink} role="menuitem">
                            Inicio
                        </Link>

                        <Link href="/servicios" className={styles.menuLink} role="menuitem">
                            Servicios
                        </Link>

                        {/* Dropdown de Tienda/Categorías */}
                        <div
                            className={styles.menuDropdown}
                            ref={categoriesDropdownRef}
                            onMouseEnter={() => setIsCategoriesOpen(true)}
                            onMouseLeave={() => setIsCategoriesOpen(false)}
                        >
                            <Link href="/productos" className={styles.menuLink}>
                                Tienda
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

                            {isCategoriesOpen && (
                                <div className={styles.megaMenu}>
                                    <div className={styles.megaMenuContent}>
                                        {/* Columna izquierda - Destacados */}
                                        <div className={styles.megaMenuHighlight}>
                                            <div className={styles.megaMenuHighlightBg}>
                                                <h3 className={styles.megaMenuHighlightTitle}>
                                                    🔥 Ofertas de Temporada
                                                </h3>
                                                <p className={styles.megaMenuHighlightText}>
                                                    Descubre las mejores ofertas en climatización
                                                </p>
                                                <Link
                                                    href="/productos"
                                                    className={styles.megaMenuHighlightBtn}
                                                    onClick={() => setIsCategoriesOpen(false)}
                                                >
                                                    Ver Todos los Productos
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Columna central - Categorías */}
                                        <div className={styles.megaMenuCategories}>
                                            <h4 className={styles.megaMenuSectionTitle}>
                                                <LayersIcon />
                                                Categorías
                                            </h4>
                                            <div className={styles.megaMenuCategoriesGrid}>
                                                {collections.map((collection) => (
                                                    <Link
                                                        key={collection.id}
                                                        href={`/productos?collection=${collection.slug}`}
                                                        className={styles.megaMenuCategoryItem}
                                                        onClick={() => setIsCategoriesOpen(false)}
                                                    >
                                                        <div className={styles.megaMenuCategoryIcon}>
                                                            {collection.featuredAsset ? (
                                                                <Image
                                                                    src={collection.featuredAsset.preview}
                                                                    alt={collection.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className={styles.megaMenuCategoryImage}
                                                                />
                                                            ) : (
                                                                <LayersIcon />
                                                            )}
                                                        </div>
                                                        <div className={styles.megaMenuCategoryInfo}>
                                                            <span className={styles.megaMenuCategoryName}>{collection.name}</span>
                                                        </div>
                                                        <svg className={styles.megaMenuCategoryArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M9 18l6-6-6-6" />
                                                        </svg>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Columna derecha - Enlaces rápidos */}
                                        <div className={styles.megaMenuQuickLinks}>
                                            <h4 className={styles.megaMenuSectionTitle}>
                                                <GridIcon />
                                                Acceso Rápido
                                            </h4>
                                            <Link
                                                href="/productos"
                                                className={styles.megaMenuQuickLink}
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                <GridIcon />
                                                <span>Ver Todo el Catálogo</span>
                                            </Link>
                                            <Link
                                                href="/productos?sort=price-asc"
                                                className={styles.megaMenuQuickLink}
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                                </svg>
                                                <span>Más Económicos</span>
                                            </Link>
                                            <Link
                                                href="/productos?new=true"
                                                className={styles.megaMenuQuickLink}
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                                <span>Novedades</span>
                                            </Link>
                                            <Link
                                                href="/contacto"
                                                className={styles.megaMenuQuickLink}
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                </svg>
                                                <span>Solicitar Presupuesto</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/blog" className={styles.menuLink} role="menuitem">
                            Blog
                        </Link>

                        <Link href="/contacto" className={styles.menuLink} role="menuitem">
                            Contacto
                        </Link>
                    </div>

                    {/* Acciones */}
                    <div className={styles.actions} role="group" aria-label="Acciones de usuario">
                        {/* Usuario / Login */}
                        {isAuthenticated && currentUser ? (
                            <div className={styles.userMenu} ref={userDropdownRef}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    aria-expanded={isUserDropdownOpen}
                                    aria-haspopup="menu"
                                    aria-controls="user-dropdown-menu"
                                    aria-label={`Mi cuenta - ${currentUser.firstName}`}
                                >
                                    <UserIcon />
                                </button>

                                {isUserDropdownOpen && (
                                    <div
                                        className={styles.dropdown}
                                        id="user-dropdown-menu"
                                        role="menu"
                                        aria-labelledby="user-menu-button"
                                    >
                                        <div className={styles.dropdownHeader} role="presentation">
                                            <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                                            <span>{currentUser.emailAddress}</span>
                                        </div>
                                        <Link
                                            href="/cuenta"
                                            className={styles.dropdownItem}
                                            onClick={() => setIsUserDropdownOpen(false)}
                                            role="menuitem"
                                        >
                                            <UserIcon aria-hidden="true" />
                                            Mi Cuenta
                                        </Link>
                                        <Link
                                            href="/pedidos"
                                            className={styles.dropdownItem}
                                            onClick={() => setIsUserDropdownOpen(false)}
                                            role="menuitem"
                                        >
                                            <PackageIcon aria-hidden="true" />
                                            Mis Pedidos
                                        </Link>
                                        <div className={styles.dropdownDivider} role="separator" />
                                        <button
                                            onClick={handleLogout}
                                            className={styles.dropdownItem}
                                            role="menuitem"
                                        >
                                            <LogoutIcon aria-hidden="true" />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className={styles.iconButton} aria-label="Iniciar sesión">
                                <UserIcon />
                            </Link>
                        )}

                        {/* Búsqueda */}
                        <Link href="/buscar" className={styles.iconButton} aria-label="Buscar">
                            <SearchIcon />
                        </Link>

                        {/* Carrito */}
                        <button
                            className={styles.cartButton}
                            aria-label="Ver carrito"
                            onClick={() => setIsCartDrawerOpen(true)}
                        >
                            <CartIcon />
                            {cartItemCount > 0 && (
                                <span className={styles.cartBadge}>{cartItemCount}</span>
                            )}
                        </button>

                        {/* Botón menú móvil */}
                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <MenuIcon aria-hidden="true" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* CartDrawer */}
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
