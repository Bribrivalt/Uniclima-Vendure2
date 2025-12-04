/**
 * Orders Page - Historial de Pedidos
 * 
 * Página protegida que muestra el historial de pedidos del cliente.
 * Utiliza GET_CUSTOMER_ORDERS para obtener los pedidos desde Vendure.
 * 
 * Funcionalidades:
 * - Lista de pedidos con estado, fecha y total
 * - Enlace al detalle de cada pedido
 * - Estados de carga y vacío
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';
import { GET_CUSTOMER_ORDERS } from '@/lib/vendure/mutations/order';
import styles from './page.module.css';

// ========================================
// INTERFACES
// ========================================

/**
 * Línea de pedido para el historial
 */
interface OrderLinePreview {
    id: string;
    quantity: number;
    productVariant: {
        name: string;
        featuredAsset?: {
            preview: string;
        };
    };
}

/**
 * Pedido en el historial
 */
interface OrderHistoryItem {
    id: string;
    code: string;
    state: string;
    totalWithTax: number;
    createdAt: string;
    updatedAt: string;
    lines: OrderLinePreview[];
}

/**
 * Respuesta de la query GET_CUSTOMER_ORDERS
 */
interface CustomerOrdersData {
    activeCustomer: {
        id: string;
        orders: {
            items: OrderHistoryItem[];
            totalItems: number;
        };
    } | null;
}

// ========================================
// HELPERS
// ========================================

/**
 * Formatear precio en euros
 */
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(price / 100);
};

/**
 * Formatear fecha en español
 */
const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(dateString));
};

/**
 * Obtener clase CSS según estado del pedido
 */
const getOrderStatusClass = (state: string): string => {
    switch (state) {
        case 'PaymentSettled':
        case 'Delivered':
            return styles.statusSuccess;
        case 'Shipped':
        case 'PartiallyShipped':
            return styles.statusInfo;
        case 'PaymentPending':
        case 'ArrangingPayment':
            return styles.statusWarning;
        case 'Cancelled':
            return styles.statusError;
        default:
            return styles.statusDefault;
    }
};

/**
 * Obtener etiqueta legible del estado
 */
const getOrderStatusLabel = (state: string): string => {
    const labels: Record<string, string> = {
        'AddingItems': 'En carrito',
        'ArrangingPayment': 'Procesando pago',
        'PaymentPending': 'Pago pendiente',
        'PaymentSettled': 'Pagado',
        'PartiallyShipped': 'Parcialmente enviado',
        'Shipped': 'Enviado',
        'PartiallyDelivered': 'Parcialmente entregado',
        'Delivered': 'Entregado',
        'Cancelled': 'Cancelado',
    };
    return labels[state] || state;
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function OrdersPage() {
    // Query para obtener historial de pedidos
    const { data, loading, error, refetch } = useQuery<CustomerOrdersData>(GET_CUSTOMER_ORDERS, {
        variables: {
            options: {
                take: 50, // Últimos 50 pedidos
                sort: { createdAt: 'DESC' },
            },
        },
        fetchPolicy: 'network-only',
    });

    const orders = data?.activeCustomer?.orders?.items || [];
    const totalOrders = data?.activeCustomer?.orders?.totalItems || 0;

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Mis Pedidos</h1>
                        {totalOrders > 0 && (
                            <span className={styles.orderCount}>
                                {totalOrders} {totalOrders === 1 ? 'pedido' : 'pedidos'}
                            </span>
                        )}
                    </div>
                    <Link href="/cuenta" className={styles.backLink}>
                        ← Volver a mi cuenta
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Cargando pedidos...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className={styles.error}>
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2>Error al cargar pedidos</h2>
                        <p>No hemos podido cargar tu historial de pedidos.</p>
                        <button onClick={() => refetch()} className={styles.retryButton}>
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && orders.length === 0 && (
                    <div className={styles.empty}>
                        <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2>No tienes pedidos todavía</h2>
                        <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                        <Link href="/productos" className={styles.shopButton}>
                            Explorar productos
                        </Link>
                    </div>
                )}

                {/* Orders List */}
                {!loading && !error && orders.length > 0 && (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/pedido/${order.code}`}
                                className={styles.orderCard}
                            >
                                {/* Order Header */}
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderInfo}>
                                        <span className={styles.orderCode}>
                                            Pedido #{order.code}
                                        </span>
                                        <span className={styles.orderDate}>
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                    <span className={`${styles.orderStatus} ${getOrderStatusClass(order.state)}`}>
                                        {getOrderStatusLabel(order.state)}
                                    </span>
                                </div>

                                {/* Order Products Preview */}
                                <div className={styles.orderProducts}>
                                    <div className={styles.productImages}>
                                        {order.lines.slice(0, 3).map((line, index) => (
                                            <div
                                                key={line.id}
                                                className={styles.productImage}
                                                style={{ zIndex: 3 - index }}
                                            >
                                                {line.productVariant.featuredAsset ? (
                                                    <img
                                                        src={line.productVariant.featuredAsset.preview}
                                                        alt={line.productVariant.name}
                                                    />
                                                ) : (
                                                    <div className={styles.noImage}>
                                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {order.lines.length > 3 && (
                                            <div className={styles.moreProducts}>
                                                +{order.lines.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.productNames}>
                                        {order.lines.slice(0, 2).map((line, index) => (
                                            <span key={line.id}>
                                                {line.quantity > 1 && `${line.quantity}x `}
                                                {line.productVariant.name}
                                                {index < Math.min(order.lines.length, 2) - 1 && ', '}
                                            </span>
                                        ))}
                                        {order.lines.length > 2 && (
                                            <span className={styles.moreProductsText}>
                                                {' '}y {order.lines.length - 2} más
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className={styles.orderFooter}>
                                    <span className={styles.orderTotal}>
                                        Total: <strong>{formatPrice(order.totalWithTax)}</strong>
                                    </span>
                                    <span className={styles.viewDetails}>
                                        Ver detalles
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Help Section */}
                <div className={styles.help}>
                    <h3>¿Necesitas ayuda con un pedido?</h3>
                    <p>
                        Si tienes alguna pregunta sobre tus pedidos o necesitas asistencia,{' '}
                        <Link href="/contacto">contacta con nosotros</Link>.
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    );
}