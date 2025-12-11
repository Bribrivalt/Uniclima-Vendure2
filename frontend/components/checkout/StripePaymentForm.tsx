/**
 * StripePaymentForm - Formulario de pago con Stripe Elements
 * 
 * @description Componente de pago integrado con Stripe para procesar pagos con tarjeta.
 * Utiliza Stripe Elements para una experiencia de pago segura y optimizada.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { useMutation } from '@apollo/client';
import { getStripe, stripeElementsOptions, getStripeErrorMessage } from '@/lib/stripe/config';
import {
    CREATE_STRIPE_PAYMENT_INTENT,
    ADD_PAYMENT_TO_ORDER,
    TRANSITION_ORDER_TO_STATE,
} from '@/lib/vendure/mutations/stripe';
import { Button, Alert } from '@/components/core';
import styles from './StripePaymentForm.module.css';

// ========================================
// INTERFACES
// ========================================

interface StripePaymentFormProps {
    /** Total del pedido en centavos */
    amount: number;
    /** Código de moneda (EUR) */
    currency?: string;
    /** Código del pedido */
    orderCode: string;
    /** Callback cuando el pago es exitoso */
    onSuccess: (orderCode: string) => void;
    /** Callback cuando hay error */
    onError?: (error: string) => void;
    /** Clase CSS adicional */
    className?: string;
}

interface CheckoutFormProps {
    orderCode: string;
    onSuccess: (orderCode: string) => void;
    onError?: (error: string) => void;
}

// ========================================
// FORMULARIO DE CHECKOUT (INTERNO)
// ========================================

/**
 * CheckoutForm - Formulario interno que usa los hooks de Stripe
 */
function CheckoutForm({ orderCode, onSuccess, onError }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    // Mutation para añadir el pago a la orden
    const [addPaymentToOrder] = useMutation(ADD_PAYMENT_TO_ORDER);

    /**
     * Manejar el envío del formulario de pago
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe aún no ha cargado
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Confirmar el pago con Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // URL de retorno después del 3D Secure
                    return_url: `${window.location.origin}/pedido/confirmacion?code=${orderCode}`,
                },
                redirect: 'if_required',
            });

            if (stripeError) {
                // Error de Stripe (tarjeta rechazada, etc.)
                const errorMessage = getStripeErrorMessage(stripeError.code || 'default');
                setError(errorMessage);
                onError?.(errorMessage);
                setProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Pago exitoso - añadir a la orden en Vendure
                const result = await addPaymentToOrder({
                    variables: {
                        input: {
                            method: 'stripe',
                            metadata: {
                                paymentIntentId: paymentIntent.id,
                            },
                        },
                    },
                });

                const orderResult = result.data?.addPaymentToOrder;

                if (orderResult?.errorCode) {
                    // Error al añadir pago a Vendure
                    setError(orderResult.message || 'Error al procesar el pedido');
                    onError?.(orderResult.message);
                } else {
                    // ¡Éxito!
                    setSucceeded(true);
                    onSuccess(orderResult?.code || orderCode);
                }
            } else if (paymentIntent && paymentIntent.status === 'requires_action') {
                // Se requiere autenticación 3D Secure - se maneja automáticamente
                setError('Se requiere autenticación adicional. Por favor, completa la verificación.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            const message = err instanceof Error ? err.message : 'Error al procesar el pago';
            setError(message);
            onError?.(message);
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Elemento de pago de Stripe */}
            <div className={styles.paymentElement}>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card'],
                        defaultValues: {
                            billingDetails: {
                                address: {
                                    country: 'ES',
                                },
                            },
                        },
                    }}
                />
            </div>

            {/* Mensaje de error */}
            {error && (
                <Alert type="error" className={styles.error}>
                    {error}
                </Alert>
            )}

            {/* Mensaje de éxito */}
            {succeeded && (
                <Alert type="success" className={styles.success}>
                    ¡Pago realizado con éxito! Redirigiendo...
                </Alert>
            )}

            {/* Información de seguridad */}
            <div className={styles.securityInfo}>
                <LockIcon />
                <span>Pago 100% seguro con encriptación SSL</span>
            </div>

            {/* Botón de pago */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={processing}
                disabled={!stripe || !elements || processing || succeeded}
            >
                {processing ? 'Procesando pago...' : 'Pagar ahora'}
            </Button>

            {/* Logos de tarjetas aceptadas */}
            <div className={styles.cardLogos}>
                <img src="/images/cards/visa.svg" alt="Visa" />
                <img src="/images/cards/mastercard.svg" alt="Mastercard" />
                <img src="/images/cards/amex.svg" alt="American Express" />
            </div>
        </form>
    );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

/**
 * StripePaymentForm - Wrapper con provider de Stripe
 */
export function StripePaymentForm({
    amount,
    currency = 'eur',
    orderCode,
    onSuccess,
    onError,
    className,
}: StripePaymentFormProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mutation para crear el PaymentIntent
    const [createPaymentIntent] = useMutation(CREATE_STRIPE_PAYMENT_INTENT);

    // Mutation para transicionar a ArrangingPayment
    const [transitionOrder] = useMutation(TRANSITION_ORDER_TO_STATE);

    /**
     * Inicializar el PaymentIntent al montar
     */
    useEffect(() => {
        const initializePayment = async () => {
            try {
                // Primero, transicionar la orden a ArrangingPayment
                const transitionResult = await transitionOrder({
                    variables: { state: 'ArrangingPayment' },
                });

                if (transitionResult.data?.transitionOrderToState?.errorCode) {
                    // Si ya está en ArrangingPayment, ignorar el error
                    if (transitionResult.data.transitionOrderToState.transitionError?.includes('ArrangingPayment')) {
                        // Ya está en el estado correcto
                    } else {
                        throw new Error(transitionResult.data.transitionOrderToState.message);
                    }
                }

                // Crear el PaymentIntent en Stripe
                const result = await createPaymentIntent();

                if (result.data?.createStripePaymentIntent) {
                    setClientSecret(result.data.createStripePaymentIntent);
                } else {
                    throw new Error('No se pudo crear el intento de pago');
                }
            } catch (err) {
                console.error('Error initializing payment:', err);
                const message = err instanceof Error 
                    ? err.message 
                    : 'Error al inicializar el pago. Por favor, recarga la página.';
                setError(message);
                onError?.(message);
            } finally {
                setLoading(false);
            }
        };

        initializePayment();
    }, [createPaymentIntent, transitionOrder, onError]);

    // Estado de carga
    if (loading) {
        return (
            <div className={`${styles.container} ${className || ''}`}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Inicializando pago seguro...</p>
                </div>
            </div>
        );
    }

    // Error al inicializar
    if (error || !clientSecret) {
        return (
            <div className={`${styles.container} ${className || ''}`}>
                <Alert type="error">
                    {error || 'Error al cargar el formulario de pago. Por favor, recarga la página.'}
                </Alert>
            </div>
        );
    }

    // Opciones para Stripe Elements
    const elementsOptions: StripeElementsOptions = {
        clientSecret,
        ...stripeElementsOptions,
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <h3 className={styles.title}>Pago con tarjeta</h3>
            <p className={styles.amount}>
                Total a pagar: <strong>{(amount / 100).toFixed(2)}€</strong>
            </p>

            <Elements stripe={getStripe()} options={elementsOptions}>
                <CheckoutForm
                    orderCode={orderCode}
                    onSuccess={onSuccess}
                    onError={onError}
                />
            </Elements>
        </div>
    );
}

// ========================================
// ICONOS
// ========================================

function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.lockIcon}
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export default StripePaymentForm;