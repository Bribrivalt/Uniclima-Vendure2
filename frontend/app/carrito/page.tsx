'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import { ADJUST_ORDER_LINE, REMOVE_ORDER_LINE } from '@/lib/vendure/mutations/cart';
import { CartItem, OrderLine } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface ActiveOrderData {
    activeOrder: {
        id: string;
        code: string;
        state: string;
        lines: OrderLine[];
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        totalQuantity: number;
    } | null;
}

export default function CarritoPage() {
    const router = useRouter();
    const { showToast } = useToast();

    // Query para obtener carrito activo
    const { data, loading, error, refetch } = useQuery<ActiveOrderData>(GET_ACTIVE_ORDER, {
        fetchPolicy: 'network-only',
    });

    // Mutation para ajustar cantidad
    const [adjustOrderLine, { loading: adjusting }] = useMutation(ADJUST_ORDER_LINE, {
        onCompleted: () => {
            refetch();
            showToast('Cantidad actualizada', 'success');
        },
        onError: (error) => {
            console.error('Error adjusting quantity:', error);
            showToast('Error al actualizar cantidad', 'error');
        },
    });

    // Mutation para eliminar producto
    const [removeOrderLine, { loading: removing }] = useMutation(REMOVE_ORDER_LINE, {
        onCompleted: () => {
            refetch();
            showToast('Producto eliminado del carrito', 'success');
        },
        onError: (error) => {
            console.error('Error removing item:', error);
            showToast('Error al eliminar producto', 'error');
        },
    });

    const handleUpdateQuantity = (lineId: string, quantity: number) => {
        adjustOrderLine({
            variables: { orderLineId: lineId, quantity },
        });
    };

    const handleRemove = (lineId: string) => {
        removeOrderLine({
            variables: { orderLineId: lineId },
        });
    };

    const handleCheckout = () => {
        // TODO: Implementar checkout
        showToast('Funcionalidad de checkout próximamente', 'info');
        // router.push('/checkout');
    };

    const activeOrder = data?.activeOrder;
    const hasItems = activeOrder && activeOrder.lines.length > 0;

    // Calcular envío (gratis si > 100€)
    const subtotalAmount = activeOrder?.subTotalWithTax || 0;
    const shippingAmount = subtotalAmount >= 10000 ? 0 : 1000; // 10€ envío si < 100€
    const taxAmount = activeOrder ? activeOrder.totalWithTax - activeOrder.total : 0;
    const totalAmount = activeOrder ? activeOrder.totalWithTax + shippingAmount : 0;

    return (
        <div className={styles.container}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
                <Link href="/">Inicio</Link>
                <span className={styles.separator}>/</span>
                <span>Carrito</span>
            </nav>

            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Mi Carrito</h1>
                {hasItems && (
                    <span className={styles.itemCount}>
                        {activeOrder.totalQuantity} {activeOrder.totalQuantity === 1 ? 'producto' : 'productos'}
                    </span>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Cargando carrito...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className={styles.error}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h2>Error al cargar el carrito</h2>
                    <p>Por favor, verifica que el backend esté corriendo.</p>
                    <button onClick={() => refetch()} className={styles.retryButton}>
                        Reintentar
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && !hasItems && (
                <div className={styles.empty}>
                    <svg
                        width="120"
                        height="120"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={styles.emptyIcon}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
                    <p className={styles.emptyText}>
                        Añade productos a tu carrito para empezar a comprar
                    </p>
                    <Link href="/repuestos" className={styles.shopButton}>
                        Ir a la Tienda
                    </Link>
                </div>
            )}

            {/* Cart Content */}
            {!loading && !error && hasItems && (
                <div className={styles.content}>
                    {/* Cart Items */}
                    <div className={styles.items}>
                        {activeOrder.lines.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemove}
                                loading={adjusting || removing}
                            />
                        ))}

                        {/* Continue Shopping Link */}
                        <Link href="/repuestos" className={styles.continueLink}>
                            ← Continuar comprando
                        </Link>
                    </div>

                    {/* Cart Summary */}
                    <div className={styles.summaryWrapper}>
                        <CartSummary
                            subtotal={subtotalAmount}
                            shipping={shippingAmount}
                            tax={taxAmount}
                            total={totalAmount}
                            onCheckout={handleCheckout}
                            loading={adjusting || removing}
                            itemCount={activeOrder.totalQuantity}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
