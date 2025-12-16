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
import { UserIcon, SearchIcon, CartIcon, MenuIcon, PackageIcon, LogoutIcon } from '@/components/icons';
import styles from './Header.module.css';

/**
 * Icono del logo Uniclima
 */
const UniclimLogoIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
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

    // Estado para las secciones expandidas del menú
    const [expandedMenuSections, setExpandedMenuSections] = useState<Set<string>>(new Set());

    const toggleMenuSection = (section: string) => {
        setExpandedMenuSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    // Categorías de la tienda
    const tiendaCategorias = [
        {
            id: 'aires',
            name: 'Aires Acondicionados',
            subcategorias: ['Split Pared', 'Multisplit', 'Conductos', 'Cassette', 'Suelo/Techo', 'Portátil']
        },
        {
            id: 'calefacciones',
            name: 'Calefacciones',
            subcategorias: ['Calderas de Gas', 'Calderas de Condensación', 'Radiadores', 'Suelo Radiante']
        },
        {
            id: 'repuestos',
            name: 'Repuestos',
            subcategorias: ['Placas Electrónicas', 'Compresores', 'Ventiladores', 'Válvulas', 'Sensores']
        },
        {
            id: 'reacondicionados',
            name: 'Reacondicionados',
            subcategorias: ['Aires Reacondicionados', 'Calderas Reacondicionadas']
        },
        {
            id: 'nuevos',
            name: 'Nuevos',
            subcategorias: ['Últimas Novedades', 'Ofertas Especiales']
        }
    ];

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

                    {/* Botón "Todas las categorías" */}
                    <div className={styles.categoriesMenuWrapper} ref={categoriesDropdownRef}>
                        <button
                            className={styles.categoriesMenuButton}
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            aria-expanded={isCategoriesOpen}
                            aria-haspopup="true"
                        >
                            <MenuIcon />
                            <span>Todas las categorías</span>
                        </button>

                        {/* Menú desplegable */}
                        {isCategoriesOpen && (
                            <div className={styles.fullMenu}>
                                {/* Inicio */}
                                <Link
                                    href="/"
                                    className={styles.fullMenuItem}
                                    onClick={() => setIsCategoriesOpen(false)}
                                >
                                    <span>Inicio</span>
                                    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.fullMenuIcon}>
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                    </svg>
                                </Link>

                                {/* Servicios */}
                                <Link
                                    href="/servicios"
                                    className={styles.fullMenuItem}
                                    onClick={() => setIsCategoriesOpen(false)}
                                >
                                    <span>Servicios</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.fullMenuIcon}>
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                </Link>

                                {/* Tienda - Sección expandible */}
                                <div className={styles.fullMenuSection}>
                                    <button
                                        className={`${styles.fullMenuSectionHeader} ${expandedMenuSections.has('tienda') ? styles.expanded : ''}`}
                                        onClick={() => toggleMenuSection('tienda')}
                                    >
                                        <span>Tienda</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.fullMenuChevron}>
                                            <path d={expandedMenuSections.has('tienda') ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                                        </svg>
                                    </button>

                                    {expandedMenuSections.has('tienda') && (
                                        <div className={styles.fullMenuSectionContent}>
                                            {/* Catálogo general */}
                                            <Link
                                                href="/productos"
                                                className={styles.fullMenuSubItem}
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                <span>Ver todo el catálogo</span>
                                            </Link>

                                            {/* Categorías de la tienda */}
                                            {tiendaCategorias.map((categoria) => (
                                                <div key={categoria.id} className={styles.fullMenuSubSection}>
                                                    <button
                                                        className={`${styles.fullMenuSubSectionHeader} ${expandedMenuSections.has(categoria.id) ? styles.expanded : ''}`}
                                                        onClick={() => toggleMenuSection(categoria.id)}
                                                    >
                                                        <span>{categoria.name}</span>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.fullMenuChevronSmall}>
                                                            <path d={expandedMenuSections.has(categoria.id) ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                                                        </svg>
                                                    </button>

                                                    {expandedMenuSections.has(categoria.id) && (
                                                        <div className={styles.fullMenuSubItems}>
                                                            {categoria.subcategorias.map((sub) => (
                                                                <Link
                                                                    key={sub}
                                                                    href={`/productos?categoria=${categoria.id}&sub=${encodeURIComponent(sub.toLowerCase().replace(/ /g, '-'))}`}
                                                                    className={styles.fullMenuSubSubItem}
                                                                    onClick={() => setIsCategoriesOpen(false)}
                                                                >
                                                                    {sub}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Blog */}
                                <Link
                                    href="/blog"
                                    className={styles.fullMenuItem}
                                    onClick={() => setIsCategoriesOpen(false)}
                                >
                                    <span>Blog</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.fullMenuIcon}>
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                    </svg>
                                </Link>

                                {/* Contacto */}
                                <Link
                                    href="/contacto"
                                    className={styles.fullMenuItem}
                                    onClick={() => setIsCategoriesOpen(false)}
                                >
                                    <span>Contacto</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.fullMenuIcon}>
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Barra de búsqueda */}
                    <form className={styles.headerSearchBar} onSubmit={handleSearch}>
                        <input
                            type="text"
                            className={styles.headerSearchInput}
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Buscar productos"
                        />
                        <button type="submit" className={styles.headerSearchButton}>
                            Buscar
                        </button>
                    </form>

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
