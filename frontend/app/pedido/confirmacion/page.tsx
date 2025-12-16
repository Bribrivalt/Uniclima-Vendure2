/**
 * Página de Confirmación de Pedido
 *
 * @description Se muestra después de completar un pedido con éxito.
 * Muestra el resumen del pedido, detalles de envío y próximos pasos.
 */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_ORDER_BY_CODE } from '@/lib/vendure/mutations/stripe';
import styles from './page.module.css';

// ========================================
// INTERFACES
// ========================================

interface OrderLine {
    id: string;
    quantity: number;
    linePriceWithTax: number;
    productVariant: {
        name: string;
        sku: string;
        featuredAsset?: {
            preview: string;
        };
    };
}

interface OrderData {
    orderByCode: {
        id: string;
        code: string;
        state: string;
        createdAt: string;
        totalWithTax: number;
        shippingWithTax: number;
        subTotalWithTax: number;
        customer?: {
            firstName: string;
            lastName: string;
            emailAddress: string;
        };
        shippingAddress?: {
            fullName: string;
            streetLine1: string;
            streetLine2?: string;
            city: string;
            province: string;
            postalCode: string;
            country: string;
            phoneNumber: string;
        };
        shippingLines: Array<{
            shippingMethod: {
                name: string;
                description?: string;
            };
            priceWithTax: number;
        }>;
        lines: OrderLine[];
        payments: Array<{
            id: string;
            method: string;
            amount: number;
            state: string;
            transactionId?: string;
        }>;
    } | null;
}

// ========================================
// COMPONENTE INTERNO
// ========================================

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('code');

    const [showConfetti, setShowConfetti] = useState(true);

    // Query para obtener los datos del pedido
    const { data, loading, error } = useQuery<OrderData>(GET_ORDER_BY_CODE, {
        variables: { code: orderCode },
        skip: !orderCode,
        fetchPolicy: 'network-only',
    });

    // Ocultar confetti después de 5 segundos
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const order = data?.orderByCode;

    // Estado de carga
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Cargando datos del pedido...</p>
                </div>
            </div>
        );
    }

    // Error o pedido no encontrado
    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h1>Pedido no encontrado</h1>
                    <p>
                        No hemos podido encontrar el pedido con código <strong>{orderCode}</strong>.
                        Si acabas de realizar un pedido, por favor espera unos segundos y recarga la página.
                    </p>
                    <div className={styles.errorActions}>
                        <Link href="/cuenta/pedidos" className={styles.linkButton}>
                            Ver mis pedidos
                        </Link>
                        <Link href="/contacto" className={styles.linkSecondary}>
                            Contactar soporte
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Formatear fecha
    const orderDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={styles.container}>
            {/* Confetti animation */}
            {showConfetti && <div className={styles.confetti} aria-hidden="true" />}

            {/* Success Header */}
            <div className={styles.successHeader}>
                <div className={styles.checkmark}>
                    <CheckmarkIcon />
                </div>
                <h1 className={styles.title}>¡Pedido realizado con éxito!</h1>
                <p className={styles.subtitle}>
                    Gracias por tu compra. Hemos enviado un email de confirmación a{' '}
                    <strong>{order.customer?.emailAddress}</strong>
                </p>
                <div className={styles.orderCode}>
                    Nº de pedido: <span>{order.code}</span>
                </div>
            </div>

            {/* Order Content */}
            <div className={styles.content}>
                {/* Main Column */}
                <div className={styles.mainColumn}>
                    {/* Order Details */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Detalles del pedido</h2>
                        <div className={styles.orderDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Fecha</span>
                                <span className={styles.detailValue}>{orderDate}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Estado</span>
                                <span className={`${styles.detailValue} ${styles.status}`}>
                                    <StatusBadge state={order.state} />
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Método de pago</span>
                                <span className={styles.detailValue}>
                                    {order.payments[0]?.method === 'stripe' ? 'Tarjeta de crédito' : order.payments[0]?.method}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Dirección de envío</h2>
                            <address className={styles.address}>
                                <p className={styles.addressName}>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.streetLine1}</p>
                                {order.shippingAddress.streetLine2 && <p>{order.shippingAddress.streetLine2}</p>}
                                <p>
                                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                </p>
                                <p>{order.shippingAddress.province}</p>
                                <p className={styles.addressPhone}>
                                    Tel: {order.shippingAddress.phoneNumber}
                                </p>
                            </address>
                        </section>
                    )}

                    {/* Shipping Method */}
                    {order.shippingLines[0] && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Método de envío</h2>
                            <div className={styles.shippingMethod}>
                                <span className={styles.shippingName}>
                                    {order.shippingLines[0].shippingMethod.name}
                                </span>
                                <span className={styles.shippingPrice}>
                                    {order.shippingLines[0].priceWithTax === 0
                                        ? 'Gratis'
                                        : `${(order.shippingLines[0].priceWithTax / 100).toFixed(2)}€`}
                                </span>
                            </div>
                        </section>
                    )}

                    {/* Next Steps */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Próximos pasos</h2>
                        <ol className={styles.nextSteps}>
                            <li>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3>Confirmación por email</h3>
                                    <p>Recibirás un email con todos los detalles de tu pedido.</p>
                                </div>
                            </li>
                            <li>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3>Preparación del pedido</h3>
                                    <p>Procesaremos tu pedido en las próximas 24-48h laborables.</p>
                                </div>
                            </li>
                            <li>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h3>Envío y seguimiento</h3>
                                    <p>Te enviaremos el número de seguimiento cuando salga el pedido.</p>
                                </div>
                            </li>
                        </ol>
                    </section>
                </div>

                {/* Sidebar - Order Summary */}
                <aside className={styles.sidebar}>
                    <div className={styles.orderSummary}>
                        <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

                        {/* Products */}
                        <div className={styles.productList}>
                            {order.lines.map((line) => (
                                <div key={line.id} className={styles.productItem}>
                                    <div className={styles.productImage}>
                                        {line.productVariant.featuredAsset ? (
                                            <img
                                                src={line.productVariant.featuredAsset.preview}
                                                alt={line.productVariant.name}
                                            />
                                        ) : (
                                            <div className={styles.noImage}>📦</div>
                                        )}
                                        <span className={styles.quantity}>{line.quantity}</span>
                                    </div>
                                    <div className={styles.productInfo}>
                                        <span className={styles.productName}>{line.productVariant.name}</span>
                                        <span className={styles.productSku}>SKU: {line.productVariant.sku}</span>
                                    </div>
                                    <span className={styles.productPrice}>
                                        {(line.linePriceWithTax / 100).toFixed(2)}€
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>{(order.subTotalWithTax / 100).toFixed(2)}€</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Envío</span>
                                <span>
                                    {order.shippingWithTax === 0
                                        ? 'Gratis'
                                        : `${(order.shippingWithTax / 100).toFixed(2)}€`}
                                </span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <span>Total</span>
                                <span>{(order.totalWithTax / 100).toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Link href="/cuenta/pedidos" className={styles.primaryButton}>
                            Ver mis pedidos
                        </Link>
                        <Link href="/productos" className={styles.secondaryButton}>
                            Seguir comprando
                        </Link>
                    </div>

                    {/* Support */}
                    <div className={styles.support}>
                        <p>¿Tienes alguna pregunta?</p>
                        <Link href="/contacto">Contactar con soporte</Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}

// ========================================
// COMPONENTES AUXILIARES
// ========================================

function CheckmarkIcon() {
    return (
        <svg viewBox="0 0 52 52" className={styles.checkmarkSvg}>
            <circle cx="26" cy="26" r="25" fill="none" className={styles.checkmarkCircle} />
            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className={styles.checkmarkPath} />
        </svg>
    );
}

function StatusBadge({ state }: { state: string }) {
    const statusMap: Record<string, { label: string; className: string }> = {
        PaymentSettled: { label: 'Pago completado', className: styles.statusSuccess },
        PaymentAuthorized: { label: 'Pago autorizado', className: styles.statusSuccess },
        Shipped: { label: 'Enviado', className: styles.statusInfo },
        Delivered: { label: 'Entregado', className: styles.statusSuccess },
        Cancelled: { label: 'Cancelado', className: styles.statusError },
        default: { label: state, className: styles.statusDefault },
    };

    const status = statusMap[state] || statusMap.default;

    return <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>;
}

// ========================================
// COMPONENTE PRINCIPAL CON SUSPENSE
// ========================================

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Cargando datos del pedido...</p>
                </div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}