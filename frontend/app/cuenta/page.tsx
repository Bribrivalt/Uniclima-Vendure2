/**
 * Pagina Mi Cuenta - Area de cliente con tabs
 *
 * Incluye tabs para:
 * - Perfil: Informacion personal editable
 * - Pedidos: Lista de pedidos recientes
 * - Direcciones: Direcciones de envio guardadas
 * - Seguridad: Cambio de contrasena
 *
 * @module CuentaPage
 * @version 2.0.0
 */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/auth-context';
import { GET_ACTIVE_CUSTOMER_WITH_ADDRESSES } from '@/lib/vendure/queries/auth';
import { GET_CUSTOMER_ORDERS } from '@/lib/vendure/mutations/order';
import {
    UPDATE_CUSTOMER_MUTATION,
    UPDATE_CUSTOMER_PASSWORD_MUTATION
} from '@/lib/vendure/mutations/auth';
import { Input, Button, Alert } from '@/components/core';
import styles from './page.module.css';

/**
 * Interface para direccion de envio del cliente
 */
interface Address {
    id: string;
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: {
        code: string;
        name: string;
    };
    phoneNumber?: string;
    defaultShippingAddress: boolean;
    defaultBillingAddress: boolean;
}

/**
 * Interface para preview de pedido en la lista
 */
interface OrderPreview {
    id: string;
    code: string;
    state: string;
    totalWithTax: number;
    createdAt: string;
    lines: Array<{
        id: string;
        quantity: number;
        productVariant: {
            name: string;
            featuredAsset?: {
                preview: string;
            };
        };
    }>;
}

/**
 * Interface para datos del cliente desde GraphQL
 */
interface CustomerData {
    activeCustomer: {
        id: string;
        title?: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
        phoneNumber?: string;
        addresses: Address[];
    } | null;
}

/**
 * Interface para datos de pedidos desde GraphQL
 */
interface OrdersData {
    activeCustomer: {
        orders: {
            items: OrderPreview[];
            totalItems: number;
        };
    } | null;
}

/**
 * Formatea precio en centimos a formato EUR
 * @param price - Precio en centimos
 * @returns Precio formateado (ej: "1.234,56 EUR")
 */
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(price / 100);
};

/**
 * Formatea fecha ISO a formato legible
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada (ej: "4 dic 2024")
 */
const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateString));
};

/**
 * Obtiene etiqueta legible para estado de pedido
 * @param state - Estado interno de Vendure
 * @returns Etiqueta en espanol
 */
const getOrderStatusLabel = (state: string): string => {
    const labels: Record<string, string> = {
        'AddingItems': 'En carrito',
        'ArrangingPayment': 'Procesando',
        'PaymentPending': 'Pendiente',
        'PaymentSettled': 'Pagado',
        'Shipped': 'Enviado',
        'Delivered': 'Entregado',
        'Cancelled': 'Cancelado',
    };
    return labels[state] || state;
};

/** Tipo para identificadores de tabs */
type TabId = 'perfil' | 'pedidos' | 'direcciones' | 'seguridad';

/** Configuracion de tabs disponibles con iconos SVG */
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
        id: 'perfil',
        label: 'Mi Perfil',
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        id: 'pedidos',
        label: 'Mis Pedidos',
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
    },
    {
        id: 'direcciones',
        label: 'Direcciones',
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        id: 'seguridad',
        label: 'Seguridad',
        icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
];

/**
 * Componente principal de la pagina Mi Cuenta
 * Muestra informacion del usuario con navegacion por tabs
 */
export default function CuentaPage() {
    const searchParams = useSearchParams();
    const { logout } = useAuth();

    /** Tab inicial desde parametro URL o por defecto 'perfil' */
    const initialTab = (searchParams.get('tab') as TabId) || 'perfil';
    const [activeTab, setActiveTab] = useState<TabId>(initialTab);

    /** Estado del formulario de edicion de perfil */
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [profileEditing, setProfileEditing] = useState(false);

    /** Estado del formulario de cambio de contrasena */
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    /** Query para obtener datos del cliente con direcciones */
    const { data: customerData, loading: loadingCustomer, refetch: refetchCustomer } = useQuery<CustomerData>(
        GET_ACTIVE_CUSTOMER_WITH_ADDRESSES,
        { fetchPolicy: 'network-only' }
    );

    /** Query para obtener ultimos pedidos (solo cuando tab pedidos activo) */
    const { data: ordersData, loading: loadingOrders } = useQuery<OrdersData>(
        GET_CUSTOMER_ORDERS,
        {
            variables: { options: { take: 5, sort: { createdAt: 'DESC' } } },
            skip: activeTab !== 'pedidos',
        }
    );

    /** Mutation para actualizar datos del perfil */
    const [updateCustomer, { loading: updatingProfile }] = useMutation(UPDATE_CUSTOMER_MUTATION, {
        onCompleted: () => {
            setProfileEditing(false);
            refetchCustomer();
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
        },
    });

    /** Mutation para cambiar contrasena */
    const [updatePassword, { loading: updatingPassword }] = useMutation(UPDATE_CUSTOMER_PASSWORD_MUTATION, {
        onCompleted: (data) => {
            if (data.updateCustomerPassword?.success) {
                setPasswordSuccess(true);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else if (data.updateCustomerPassword?.errorCode) {
                setPasswordError(data.updateCustomerPassword.message || 'Error al cambiar contrasena');
            }
        },
        onError: (error) => {
            setPasswordError('Error al cambiar contrasena');
            console.error('Error updating password:', error);
        },
    });

    /** Cargar datos del usuario cuando se obtienen de la API */
    useEffect(() => {
        if (customerData?.activeCustomer) {
            setProfileForm({
                firstName: customerData.activeCustomer.firstName || '',
                lastName: customerData.activeCustomer.lastName || '',
                phoneNumber: customerData.activeCustomer.phoneNumber || '',
            });
        }
    }, [customerData]);

    /**
     * Handler para enviar formulario de perfil
     * Ejecuta mutation UPDATE_CUSTOMER_MUTATION
     */
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCustomer({
            variables: {
                input: {
                    firstName: profileForm.firstName,
                    lastName: profileForm.lastName,
                    phoneNumber: profileForm.phoneNumber || null,
                },
            },
        });
    };

    /**
     * Handler para enviar formulario de cambio de contrasena
     * Valida que las contrasenas coincidan y tengan minimo 8 caracteres
     */
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Las contrasenas no coinciden');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('La contrasena debe tener al menos 8 caracteres');
            return;
        }

        updatePassword({
            variables: {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            },
        });
    };

    /** Datos extraidos para render */
    const customer = customerData?.activeCustomer;
    const orders = ordersData?.activeCustomer?.orders?.items || [];
    const addresses = customer?.addresses || [];

    /**
     * Renderiza contenido del tab Perfil
     * Muestra datos del usuario con opcion de editar
     */
    const renderProfileTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
                <h2>Informacion Personal</h2>
                {!profileEditing && (
                    <Button variant="outline" size="sm" onClick={() => setProfileEditing(true)}>
                        Editar
                    </Button>
                )}
            </div>

            {profileEditing ? (
                <form onSubmit={handleProfileSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <Input
                            label="Nombre"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Apellidos"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>
                    <div className={styles.formRow}>
                        <Input
                            label="Email"
                            type="email"
                            value={customer?.emailAddress || ''}
                            disabled
                            fullWidth
                            helperText="El email no se puede cambiar"
                        />
                        <Input
                            label="Telefono"
                            type="tel"
                            value={profileForm.phoneNumber}
                            onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                            fullWidth
                            placeholder="612 345 678"
                        />
                    </div>
                    <div className={styles.formActions}>
                        <Button variant="outline" onClick={() => setProfileEditing(false)} disabled={updatingProfile}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" loading={updatingProfile}>
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            ) : (
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <label>Nombre completo</label>
                        <p>{customer?.firstName} {customer?.lastName}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>Email</label>
                        <p>{customer?.emailAddress}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>Telefono</label>
                        <p>{customer?.phoneNumber || 'No especificado'}</p>
                    </div>
                </div>
            )}
        </div>
    );

    /**
     * Renderiza contenido del tab Pedidos
     * Muestra lista de ultimos 5 pedidos con link a ver todos
     */
    const renderOrdersTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
                <h2>Mis Pedidos</h2>
                <Link href="/pedidos" className={styles.viewAllLink}>
                    Ver todos
                </Link>
            </div>

            {loadingOrders ? (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Cargando pedidos...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No tienes pedidos todavia</p>
                    <Link href="/productos" className={styles.shopLink}>
                        Explorar productos
                    </Link>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <Link key={order.id} href={`/pedido/${order.code}`} className={styles.orderItem}>
                            <div className={styles.orderInfo}>
                                <span className={styles.orderCode}>#{order.code}</span>
                                <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className={styles.orderStatus}>
                                {getOrderStatusLabel(order.state)}
                            </div>
                            <div className={styles.orderTotal}>
                                {formatPrice(order.totalWithTax)}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    /**
     * Renderiza contenido del tab Direcciones
     * Muestra grid de direcciones guardadas con opcion de editar/eliminar
     */
    const renderAddressesTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
                <h2>Mis Direcciones</h2>
                <Button variant="outline" size="sm">
                    + Anadir direccion
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No tienes direcciones guardadas</p>
                    <p className={styles.emptyHint}>
                        Las direcciones se guardaran automaticamente cuando realices un pedido
                    </p>
                </div>
            ) : (
                <div className={styles.addressesGrid}>
                    {addresses.map((address) => (
                        <div key={address.id} className={styles.addressCard}>
                            {(address.defaultShippingAddress || address.defaultBillingAddress) && (
                                <div className={styles.addressBadges}>
                                    {address.defaultShippingAddress && (
                                        <span className={styles.badge}>Envio predeterminado</span>
                                    )}
                                    {address.defaultBillingAddress && (
                                        <span className={styles.badge}>Facturacion predeterminada</span>
                                    )}
                                </div>
                            )}
                            <p className={styles.addressName}>{address.fullName}</p>
                            {address.company && <p>{address.company}</p>}
                            <p>{address.streetLine1}</p>
                            {address.streetLine2 && <p>{address.streetLine2}</p>}
                            <p>{address.postalCode} {address.city}</p>
                            <p>{address.province}, {address.country.name}</p>
                            {address.phoneNumber && <p>Tel: {address.phoneNumber}</p>}
                            <div className={styles.addressActions}>
                                <button className={styles.addressBtn}>Editar</button>
                                <button className={styles.addressBtn}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    /**
     * Renderiza contenido del tab Seguridad
     * Formulario para cambio de contrasena
     */
    const renderSecurityTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
                <h2>Cambiar Contrasena</h2>
            </div>

            {passwordError && (
                <Alert type="error" dismissible onClose={() => setPasswordError('')}>
                    {passwordError}
                </Alert>
            )}

            {passwordSuccess && (
                <Alert type="success" dismissible onClose={() => setPasswordSuccess(false)}>
                    Contrasena cambiada correctamente
                </Alert>
            )}

            <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.formRowSingle}>
                    <Input
                        label="Contrasena actual"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        fullWidth
                    />
                </div>
                <div className={styles.formRowSingle}>
                    <Input
                        label="Nueva contrasena"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        fullWidth
                        helperText="Minimo 8 caracteres"
                    />
                </div>
                <div className={styles.formRowSingle}>
                    <Input
                        label="Confirmar nueva contrasena"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        fullWidth
                    />
                </div>
                <div className={styles.formActions}>
                    <Button type="submit" variant="primary" loading={updatingPassword}>
                        Cambiar contrasena
                    </Button>
                </div>
            </form>
        </div>
    );

    /**
     * Renderiza el contenido segun el tab activo
     */
    const renderTabContent = () => {
        switch (activeTab) {
            case 'perfil':
                return renderProfileTab();
            case 'pedidos':
                return renderOrdersTab();
            case 'direcciones':
                return renderAddressesTab();
            case 'seguridad':
                return renderSecurityTab();
            default:
                return null;
        }
    };

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.title}>Mi Cuenta</h1>
                        {customer && (
                            <p className={styles.welcome}>
                                Hola, {customer.firstName}
                            </p>
                        )}
                    </div>
                    <button onClick={logout} className={styles.logoutButton}>
                        Cerrar Sesion
                    </button>
                </div>

                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <nav className={styles.tabNav}>
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className={styles.main}>
                        {loadingCustomer ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <p>Cargando...</p>
                            </div>
                        ) : (
                            renderTabContent()
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
