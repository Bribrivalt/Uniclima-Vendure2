'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GET_ORDER_BY_CODE } from '@/lib/vendure/mutations/order';
import { Skeleton } from '@/components/core/Skeleton';
import styles from './page.module.css';

interface OrderLine {
    id: string;
    quantity: number;
    linePrice: number;
    linePriceWithTax: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        priceWithTax: number;
        featuredAsset?: {
            preview: string;
        };
    };
}

interface ShippingAddress {
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phoneNumber?: string;
}

interface Order {
    id: string;
    code: string;
    state: string;
    totalQuantity: number;
    subTotal: number;
    subTotalWithTax: number;
    shipping: number;
    shippingWithTax: number;
    total: number;
    totalWithTax: number;
    currencyCode: string;
    customer?: {
        id: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
    };
    shippingAddress?: ShippingAddress;
    lines: OrderLine[];
    shippingLines: Array<{
        shippingMethod: {
            name: string;
        };
        priceWithTax: number;
    }>;
}

interface OrderData {
    orderByCode: Order | null;
}

export default function OrderConfirmationPage() {
    const params = useParams();
    const code = params.code as string;

    const { data, loading, error } = useQuery<OrderData>(GET_ORDER_BY_CODE, {
        variables: { code },
        skip: !code,
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(price / 100);
    };

    const getOrderStatusColor = (state: string) => {
        switch (state) {
            case 'PaymentSettled':
            case 'Delivered':
                return styles.statusSuccess;
            case 'PaymentPending':
            case 'ArrangingPayment':
                return styles.statusWarning;
            case 'Cancelled':
                return styles.statusError;
            default:
                return styles.statusDefault;
        }
    };

    const getOrderStatusLabel = (state: string) => {
        const labels: Record<string, string> = {
            'AddingItems': 'Añadiendo artículos',
            'ArrangingPayment': 'Procesando pago',
            'PaymentPending': 'Pago pendiente',
            'PaymentSettled': 'Pago completado',
            'PartiallyShipped': 'Parcialmente enviado',
            'Shipped': 'Enviado',
            'PartiallyDelivered': 'Parcialmente entregado',
            'Delivered': 'Entregado',
            'Cancelled': 'Cancelado',
        };
        return labels[state] || state;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <Skeleton width="200px" height="32px" />
                    <div className={styles.loadingContent}>
                        <Skeleton width="100%" height="400px" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data?.orderByCode) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <div className={styles.errorIcon}>
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1>Pedido no encontrado</h1>
                    <p>No hemos podido encontrar el pedido con código <strong>{code}</strong>.</p>
                    <Link href="/" className={styles.homeLink}>
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    const order = data.orderByCode;

    return (
        <div className={styles.container}>
            {/* Success Header */}
            <div className={styles.header}>
                <div className={styles.successIcon}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className={styles.title}>¡Gracias por tu pedido!</h1>
                <p className={styles.subtitle}>
                    Tu pedido ha sido recibido correctamente. Te hemos enviado un email de confirmación.
                </p>
            </div>

            {/* Order Info */}
            <div className={styles.orderInfo}>
                <div className={styles.orderInfoItem}>
                    <span className={styles.orderInfoLabel}>Nº de Pedido</span>
                    <span className={styles.orderInfoValue}>{order.code}</span>
                </div>
                <div className={styles.orderInfoItem}>
                    <span className={styles.orderInfoLabel}>Estado</span>
                    <span className={`${styles.orderStatus} ${getOrderStatusColor(order.state)}`}>
                        {getOrderStatusLabel(order.state)}
                    </span>
                </div>
                <div className={styles.orderInfoItem}>
                    <span className={styles.orderInfoLabel}>Total</span>
                    <span className={styles.orderInfoValue}>{formatPrice(order.totalWithTax)}</span>
                </div>
            </div>

            <div className={styles.content}>
                {/* Order Items */}
                <div className={styles.itemsSection}>
                    <h2 className={styles.sectionTitle}>Artículos del pedido</h2>
                    <div className={styles.items}>
                        {order.lines.map((line) => (
                            <div key={line.id} className={styles.item}>
                                <div className={styles.itemImage}>
                                    {line.productVariant.featuredAsset ? (
                                        <img
                                            src={line.productVariant.featuredAsset.preview}
                                            alt={line.productVariant.name}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.itemDetails}>
                                    <h3 className={styles.itemName}>{line.productVariant.name}</h3>
                                    {line.productVariant.sku && (
                                        <p className={styles.itemSku}>REF: {line.productVariant.sku}</p>
                                    )}
                                    <p className={styles.itemQuantity}>Cantidad: {line.quantity}</p>
                                </div>
                                <div className={styles.itemPrice}>
                                    {formatPrice(line.linePriceWithTax)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className={styles.summarySection}>
                    <h2 className={styles.sectionTitle}>Resumen</h2>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subTotalWithTax)}</span>
                        </div>
                        {order.shippingLines.map((shippingLine, index) => (
                            <div key={index} className={styles.summaryRow}>
                                <span>Envío ({shippingLine.shippingMethod.name})</span>
                                <span>{formatPrice(shippingLine.priceWithTax)}</span>
                            </div>
                        ))}
                        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                            <span>Total</span>
                            <span>{formatPrice(order.totalWithTax)}</span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className={styles.addressCard}>
                            <h3 className={styles.addressTitle}>Dirección de envío</h3>
                            <address className={styles.address}>
                                <strong>{order.shippingAddress.fullName}</strong>
                                {order.shippingAddress.company && (
                                    <span>{order.shippingAddress.company}</span>
                                )}
                                <span>{order.shippingAddress.streetLine1}</span>
                                {order.shippingAddress.streetLine2 && (
                                    <span>{order.shippingAddress.streetLine2}</span>
                                )}
                                <span>
                                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                </span>
                                <span>{order.shippingAddress.province}, {order.shippingAddress.country}</span>
                                {order.shippingAddress.phoneNumber && (
                                    <span>Tel: {order.shippingAddress.phoneNumber}</span>
                                )}
                            </address>
                        </div>
                    )}

                    {/* Customer Email */}
                    {order.customer && (
                        <div className={styles.emailInfo}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>
                                Confirmación enviada a: <strong>{order.customer.emailAddress}</strong>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <Link href="/productos" className={styles.continueButton}>
                    Seguir comprando
                </Link>
                <Link href="/cuenta" className={styles.accountButton}>
                    Ver mis pedidos
                </Link>
            </div>

            {/* Help */}
            <div className={styles.help}>
                <h3>¿Necesitas ayuda?</h3>
                <p>
                    Si tienes alguna pregunta sobre tu pedido, no dudes en{' '}
                    <Link href="/contacto">contactarnos</Link>.
                </p>
            </div>
        </div>
    );
}