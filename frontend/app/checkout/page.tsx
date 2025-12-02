'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth';
import { CheckoutSteps, ShippingForm, OrderSummary, DEFAULT_CHECKOUT_STEPS, ShippingAddress } from '@/components/checkout';
import { Button, Alert } from '@/components/core';
import styles from './page.module.css';

// Datos de ejemplo (en producción vendrían del carrito)
const MOCK_ORDER_ITEMS = [
    {
        id: '1',
        name: 'Filtro de aire acondicionado',
        quantity: 2,
        unitPrice: 2500,
        linePrice: 5000,
        sku: 'FIL-AC-001',
    },
    {
        id: '2',
        name: 'Termostato digital',
        quantity: 1,
        unitPrice: 8900,
        linePrice: 8900,
        sku: 'TERM-DIG-002',
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

    // Calcular totales
    const subtotal = MOCK_ORDER_ITEMS.reduce((sum, item) => sum + item.linePrice, 0);
    const shipping = subtotal > 10000 ? 0 : 500; // Envío gratis > 100€
    const total = subtotal + shipping;

    const handleShippingSubmit = async (address: ShippingAddress) => {
        setLoading(true);
        setError(null);

        try {
            // Simular guardado de dirección
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setShippingAddress(address);
            setCurrentStep(1);
        } catch (err) {
            setError('Error al guardar la dirección. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            // Simular proceso de pago
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setCurrentStep(2);
        } catch (err) {
            setError('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // Simular confirmación del pedido
            await new Promise((resolve) => setTimeout(resolve, 1500));
            router.push('/cuenta?tab=pedidos&success=true');
        } catch (err) {
            setError('Error al confirmar el pedido. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <ShippingForm
                        initialData={shippingAddress || undefined}
                        onSubmit={handleShippingSubmit}
                        loading={loading}
                    />
                );

            case 1:
                return (
                    <div className={styles.paymentStep}>
                        <h3 className={styles.stepTitle}>Método de pago</h3>
                        <div className={styles.paymentMethods}>
                            <label className={styles.paymentOption}>
                                <input type="radio" name="payment" value="card" defaultChecked />
                                <span className={styles.paymentLabel}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2" />
                                    </svg>
                                    Tarjeta de crédito/débito
                                </span>
                            </label>
                            <label className={styles.paymentOption}>
                                <input type="radio" name="payment" value="transfer" />
                                <span className={styles.paymentLabel}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Transferencia bancaria
                                </span>
                            </label>
                        </div>
                        <div className={styles.cardForm}>
                            <p className={styles.cardInfo}>
                                La pasarela de pago segura se abrirá al continuar.
                            </p>
                        </div>
                        <div className={styles.stepActions}>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(0)}
                                disabled={loading}
                            >
                                Volver
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handlePaymentSubmit}
                                loading={loading}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className={styles.confirmationStep}>
                        <h3 className={styles.stepTitle}>Confirmar pedido</h3>

                        <div className={styles.confirmationSection}>
                            <h4>Dirección de envío</h4>
                            {shippingAddress && (
                                <div className={styles.addressSummary}>
                                    <p>{shippingAddress.fullName}</p>
                                    {shippingAddress.company && <p>{shippingAddress.company}</p>}
                                    <p>{shippingAddress.streetLine1}</p>
                                    {shippingAddress.streetLine2 && <p>{shippingAddress.streetLine2}</p>}
                                    <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                                    <p>{shippingAddress.province}</p>
                                    <p>Tel: {shippingAddress.phoneNumber}</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.confirmationSection}>
                            <h4>Método de pago</h4>
                            <p>Tarjeta de crédito/débito</p>
                        </div>

                        <Alert type="info">
                            Al confirmar el pedido, aceptas nuestros términos y condiciones de venta.
                        </Alert>

                        <div className={styles.stepActions}>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                                disabled={loading}
                            >
                                Volver
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleConfirmOrder}
                                loading={loading}
                            >
                                Confirmar y pagar
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <h1 className={styles.title}>Finalizar compra</h1>

                <CheckoutSteps
                    steps={DEFAULT_CHECKOUT_STEPS}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                    allowNavigation={true}
                />

                {error && (
                    <Alert type="error" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        {renderStepContent()}
                    </div>

                    <aside className={styles.sidebar}>
                        <OrderSummary
                            items={MOCK_ORDER_ITEMS}
                            subtotal={subtotal}
                            shipping={shipping}
                            total={total}
                        />
                    </aside>
                </div>
            </div>
        </ProtectedRoute>
    );
}