'use client';

import styles from './CartSummary.module.css';

export interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    onCheckout: () => void;
    loading?: boolean;
    itemCount?: number;
}

/**
 * CartSummary - Resumen del carrito con totales y botón de checkout
 */
export function CartSummary({
    subtotal,
    shipping,
    tax,
    total,
    onCheckout,
    loading = false,
    itemCount = 0,
}: CartSummaryProps) {
    const formatPrice = (price: number) => (price / 100).toFixed(2);

    return (
        <div className={styles.summary}>
            <h2 className={styles.title}>Resumen del Pedido</h2>

            <div className={styles.details}>
                {/* Subtotal */}
                <div className={styles.row}>
                    <span className={styles.label}>Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
                    <span className={styles.value}>{formatPrice(subtotal)}€</span>
                </div>

                {/* Envío */}
                <div className={styles.row}>
                    <span className={styles.label}>Envío</span>
                    <span className={styles.value}>
                        {shipping === 0 ? (
                            <span className={styles.free}>GRATIS</span>
                        ) : (
                            `${formatPrice(shipping)}€`
                        )}
                    </span>
                </div>

                {/* IVA */}
                <div className={styles.row}>
                    <span className={styles.label}>IVA (21%)</span>
                    <span className={styles.value}>{formatPrice(tax)}€</span>
                </div>

                <div className={styles.divider} />

                {/* Total */}
                <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>{formatPrice(total)}€</span>
                </div>
            </div>

            {/* Botón Checkout */}
            <button
                onClick={onCheckout}
                disabled={loading || itemCount === 0}
                className={styles.checkoutButton}
            >
                {loading ? (
                    <>
                        <span className={styles.spinner} />
                        Procesando...
                    </>
                ) : (
                    'Finalizar compra'
                )}
            </button>

            {/* Información adicional */}
            <div className={styles.info}>
                <div className={styles.infoItem}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <span>Pago seguro</span>
                </div>
                <div className={styles.infoItem}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span>Envío gratuito +100€</span>
                </div>
            </div>
        </div>
    );
}
