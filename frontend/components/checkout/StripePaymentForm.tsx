/**
 * StripePaymentForm - Formulario de pago con Stripe Elements
 * 
 * @description Componente que integra Stripe Payment Element para procesar pagos
 * con tarjeta de crédito/débito de forma segura.
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, stripeElementsOptions, getStripeErrorMessage } from '@/lib/stripe/config';
import { 
    CREATE_STRIPE_PAYMENT_INTENT, 
    ADD_PAYMENT_TO_ORDER,
    TRANSITION_ORDER_TO_STATE,
    GET_ELIGIBLE_PAYMENT_METHODS 
} from '@/lib/vendure/mutations/stripe';
import { Button, Alert } from '@/components/core';
import styles from './StripePaymentForm.module.css';

// ========================================
// INTERFACES
// ========================================

export interface StripePaymentFormProps {
    /** Código de la orden actual */
    orderCode: string;
    /** Total de la orden en céntimos */
    orderTotal: number;
    /** Callback cuando el pago es exitoso */
    onSuccess: (orderCode: string) => void;
    /** Callback cuando hay un error */
    onError: (error: string) => void;
    /** Callback para volver al paso anterior */
    onBack?: () => void;
}

// ========================================
// COMPONENTE WRAPPER
// ========================================

/**
 * Componente wrapper que carga Stripe y obtiene el clientSecret
 */
export function StripePaymentForm({
    orderCode,
    orderTotal,
    onSuccess,
    onError,
    onBack,
}: StripePaymentFormProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stripeAvailable, setStripeAvailable] = useState<boolean | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    // Verificar si Stripe está disponible como método de pago
    const { data: paymentMethodsData, loading: loadingPaymentMethods, error: paymentMethodsError } = useQuery(GET_ELIGIBLE_PAYMENT_METHODS);
    
    // Mutation para crear el PaymentIntent
    const [createPaymentIntent] = useMutation(CREATE_STRIPE_PAYMENT_INTENT);
    
    // Mutation para transicionar la orden a ArrangingPayment
    const [transitionOrder] = useMutation(TRANSITION_ORDER_TO_STATE);

    // Debug: mostrar métodos de pago disponibles
    useEffect(() => {
        if (paymentMethodsData) {
            console.log('💳 Métodos de pago disponibles:', paymentMethodsData.eligiblePaymentMethods);
            setDebugInfo(`Métodos: ${JSON.stringify(paymentMethodsData.eligiblePaymentMethods?.map((m: any) => m.code) || [])}`);
        }
        if (paymentMethodsError) {
            console.error('❌ Error obteniendo métodos de pago:', paymentMethodsError);
            setDebugInfo(`Error: ${paymentMethodsError.message}`);
        }
    }, [paymentMethodsData, paymentMethodsError]);

    // Inicializar el pago - solo ejecutar una vez
    const [initialized, setInitialized] = useState(false);
    
    useEffect(() => {
        // Evitar ejecutar múltiples veces
        if (initialized || !paymentMethodsData || loadingPaymentMethods) {
            return;
        }
        
        async function initializePayment() {
            try {
                setInitialized(true);
                setIsLoading(true);
                setError(null);

                console.log('🔄 Inicializando pago...');
                console.log('📋 Métodos de pago:', paymentMethodsData?.eligiblePaymentMethods);

                // Verificar si Stripe está disponible
                const stripeMethod = paymentMethodsData?.eligiblePaymentMethods?.find(
                    (m: any) => m.code === 'stripe'
                );
                
                if (!stripeMethod) {
                    console.warn('⚠️ Método stripe no encontrado en:', paymentMethodsData?.eligiblePaymentMethods);
                    setStripeAvailable(false);
                    setError('El método de pago con tarjeta no está disponible. Asegúrate de que esté configurado en el panel de administración.');
                    setIsLoading(false);
                    return;
                }
                
                console.log('✅ Método Stripe encontrado:', stripeMethod);
                setStripeAvailable(true);

                // La transición a ArrangingPayment ya se hace en el paso de envío
                // Solo crear el PaymentIntent
                console.log('🔄 Creando PaymentIntent...');
                const { data, errors } = await createPaymentIntent();
                
                console.log('📋 Resultado PaymentIntent:', data, errors);

                if (errors && errors.length > 0) {
                    throw new Error(errors[0].message);
                }
                
                if (data?.createStripePaymentIntent) {
                    console.log('✅ PaymentIntent creado, clientSecret:', data.createStripePaymentIntent.substring(0, 20) + '...');
                    setClientSecret(data.createStripePaymentIntent);
                } else {
                    throw new Error('No se pudo crear el intent de pago. Verifica que Stripe esté configurado correctamente en el Dashboard de Vendure.');
                }
            } catch (err: any) {
                console.error('❌ Error initializing payment:', err);
                setError(err.message || 'Error al inicializar el pago');
                onError(err.message || 'Error al inicializar el pago');
            } finally {
                setIsLoading(false);
            }
        }

        initializePayment();
    }, [paymentMethodsData, loadingPaymentMethods, initialized]);

    // Estado de carga
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p>Preparando el pago seguro...</p>
            </div>
        );
    }

    // Error o Stripe no disponible
    if (error || !stripeAvailable) {
        return (
            <div className={styles.errorContainer}>
                <Alert type="error">{error || 'El pago con tarjeta no está disponible'}</Alert>
                {onBack && (
                    <Button variant="outline" onClick={onBack} className={styles.backButton}>
                        ← Volver
                    </Button>
                )}
            </div>
        );
    }

    // Verificar que tenemos clientSecret
    if (!clientSecret) {
        return (
            <div className={styles.errorContainer}>
                <Alert type="error">No se pudo iniciar el proceso de pago</Alert>
                {onBack && (
                    <Button variant="outline" onClick={onBack}>
                        ← Volver
                    </Button>
                )}
            </div>
        );
    }

    // Renderizar el formulario de pago con Elements
    return (
        <div className={styles.container}>
            <Elements
                stripe={getStripe()}
                options={{
                    clientSecret,
                    appearance: stripeElementsOptions.appearance,
                    locale: 'es',
                }}
            >
                <PaymentForm
                    orderCode={orderCode}
                    orderTotal={orderTotal}
                    onSuccess={onSuccess}
                    onError={onError}
                    onBack={onBack}
                />
            </Elements>
        </div>
    );
}

// ========================================
// COMPONENTE DEL FORMULARIO
// ========================================

interface PaymentFormProps {
    orderCode: string;
    orderTotal: number;
    onSuccess: (orderCode: string) => void;
    onError: (error: string) => void;
    onBack?: () => void;
}

function PaymentForm({ orderCode, orderTotal, onSuccess, onError, onBack }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // Mutation para añadir el pago a la orden
    const [addPayment] = useMutation(ADD_PAYMENT_TO_ORDER);

    /**
     * Manejar el envío del formulario de pago
     */
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            // Confirmar el pago con Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/pedido/confirmacion?code=${orderCode}`,
                },
                redirect: 'if_required', // Solo redirigir si es necesario (3D Secure)
            });

            if (stripeError) {
                // Error de Stripe
                const errorMessage = getStripeErrorMessage(stripeError.code || 'default');
                setPaymentError(errorMessage);
                onError(errorMessage);
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Pago exitoso - añadir el pago a la orden en Vendure
                const { data: paymentData } = await addPayment({
                    variables: {
                        input: {
                            method: 'stripe',
                            metadata: {
                                paymentIntentId: paymentIntent.id,
                            },
                        },
                    },
                });

                if (paymentData?.addPaymentToOrder?.errorCode) {
                    throw new Error(paymentData.addPaymentToOrder.message);
                }

                // Éxito
                onSuccess(orderCode);
            } else if (paymentIntent && paymentIntent.status === 'requires_action') {
                // Requiere acción adicional (3D Secure) - Stripe manejará la redirección
                // No hacer nada aquí, el usuario será redirigido
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            const errorMessage = err.message || 'Error al procesar el pago';
            setPaymentError(errorMessage);
            onError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    }, [stripe, elements, orderCode, addPayment, onSuccess, onError]);

    return (
        <form onSubmit={handleSubmit} className={styles.paymentForm}>
            {/* Encabezado con información */}
            <div className={styles.header}>
                <h3 className={styles.title}>Pago con tarjeta</h3>
                <p className={styles.subtitle}>
                    Total a pagar: <strong>{(orderTotal / 100).toFixed(2)}€</strong>
                </p>
            </div>

            {/* Stripe Payment Element */}
            <div className={styles.paymentElementWrapper}>
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card'],
                    }}
                />
            </div>

            {/* Error de pago */}
            {paymentError && (
                <div className={styles.paymentError}>
                    <Alert type="error">
                        {paymentError}
                    </Alert>
                </div>
            )}

            {/* Badge de seguridad */}
            <div className={styles.securityBadge}>
                <svg
                    className={styles.lockIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span>Pago 100% seguro con encriptación SSL</span>
            </div>

            {/* Botones */}
            <div className={styles.actions}>
                {onBack && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isProcessing}
                    >
                        ← Volver
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isProcessing}
                    disabled={!stripe || !elements || isProcessing}
                    className={styles.payButton}
                >
                    {isProcessing ? 'Procesando...' : 'Pagar ahora'}
                </Button>
            </div>

            {/* Logos de tarjetas aceptadas */}
            <div className={styles.cardLogos}>
                <div className={styles.logos}>
                    {/* Visa */}
                    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                        <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                        <path d="M15.5 16L17.2 8H19.5L17.8 16H15.5Z" fill="white"/>
                        <path d="M25.3 8.2C24.8 8 24 7.8 23 7.8C20.5 7.8 18.7 9.1 18.7 11C18.7 12.4 20 13.2 21 13.7C22 14.2 22.4 14.5 22.4 15C22.4 15.7 21.5 16 20.7 16C19.6 16 19 15.8 18 15.4L17.6 15.2L17.2 17.5C18 17.9 19.3 18.2 20.7 18.2C23.4 18.2 25.1 16.9 25.1 14.9C25.1 13.8 24.4 12.9 22.9 12.2C22 11.7 21.4 11.4 21.4 10.9C21.4 10.5 21.9 10 22.9 10C23.8 10 24.4 10.2 24.9 10.4L25.1 10.5L25.5 8.3L25.3 8.2Z" fill="white"/>
                        <path d="M29.1 8H27.2C26.6 8 26.1 8.2 25.9 8.8L22 16H24.7L25.2 14.6H28.5L28.8 16H31.2L29.1 8ZM26 12.6L27.2 9.5L27.9 12.6H26Z" fill="white"/>
                        <path d="M14 8L11.5 13.8L11.2 12.3C10.7 10.7 9.2 9 7.5 8.1L9.8 16H12.5L16.7 8H14Z" fill="white"/>
                        <path d="M9.5 8H5.5L5.5 8.2C8.7 9 10.8 10.9 11.5 13L10.7 8.9C10.6 8.3 10.1 8 9.5 8Z" fill="#F9A51A"/>
                    </svg>
                    {/* Mastercard */}
                    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                        <rect width="38" height="24" rx="4" fill="#F5F5F5"/>
                        <circle cx="14" cy="12" r="7" fill="#EA001B"/>
                        <circle cx="24" cy="12" r="7" fill="#FFA200"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M19 17.5C20.5 16.3 21.5 14.3 21.5 12C21.5 9.7 20.5 7.7 19 6.5C17.5 7.7 16.5 9.7 16.5 12C16.5 14.3 17.5 16.3 19 17.5Z" fill="#FF5F01"/>
                    </svg>
                    {/* Amex */}
                    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
                        <rect width="38" height="24" rx="4" fill="#006FCF"/>
                        <path d="M7 10.5L8.8 15H10.5L12.3 10.5V15H14V8.5H11.2L9.7 12.8L8.2 8.5H5.5V15H7V10.5Z" fill="white"/>
                        <path d="M15.5 8.5V15H22V13.5H17.2V12.3H21.8V10.8H17.2V10H22V8.5H15.5Z" fill="white"/>
                        <path d="M23 8.5L25.2 11.5L27.4 8.5H29.5L26.3 12.3L29.5 15.5H27.3L25.2 12.8L23 15.5H21L24 12.3L21 8.5H23Z" fill="white"/>
                    </svg>
                </div>
            </div>
        </form>
    );
}

export default StripePaymentForm;