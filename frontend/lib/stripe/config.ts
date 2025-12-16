/**
 * Configuración de Stripe
 *
 * @description Configuración y utilidades para la integración con Stripe
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Clave pública de Stripe (se configura en variables de entorno)
// En desarrollo, se usa un fallback para asegurar que funcione en Docker
const getStripePublicKey = (): string => {
    const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (envKey) {
        console.log('✅ Stripe key loaded from environment');
        return envKey;
    }
    
    // Fallback para desarrollo - SOLO PARA TESTING
    // En producción, esto debe venir de las variables de entorno
    const fallbackKey = 'pk_test_51SecYUBDg8deGHo12bLs55V7jj7ukBg7faIyk0pSS9r1JR80AMXJlYstepyzdrdZRdC0i9AKj7XdXduTfWDnTY5x00PsU9k5tR';
    console.warn('⚠️ Using fallback Stripe key - ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in production');
    return fallbackKey;
};

const STRIPE_PUBLIC_KEY = getStripePublicKey();

// Instancia singleton de Stripe
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Obtener instancia de Stripe (lazy loading)
 * @returns Promise con la instancia de Stripe
 */
export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        if (!STRIPE_PUBLIC_KEY) {
            console.error('❌ Stripe public key not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
            return Promise.resolve(null);
        }
        console.log('🔄 Loading Stripe with key:', STRIPE_PUBLIC_KEY.substring(0, 20) + '...');
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY, {
            locale: 'es',
        });
    }
    return stripePromise;
};

/**
 * Opciones de apariencia para Stripe Elements
 */
export const stripeElementsOptions = {
    appearance: {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0052CC',
            colorBackground: '#ffffff',
            colorText: '#1a1a2e',
            colorDanger: '#dc3545',
            fontFamily: '"Inter", system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
        rules: {
            '.Input': {
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                padding: '12px 16px',
            },
            '.Input:focus': {
                border: '1px solid #0052CC',
                boxShadow: '0 0 0 3px rgba(0, 82, 204, 0.1)',
            },
            '.Input--invalid': {
                border: '1px solid #dc3545',
            },
            '.Label': {
                fontWeight: '500',
                marginBottom: '8px',
            },
            '.Error': {
                color: '#dc3545',
                fontSize: '14px',
                marginTop: '4px',
            },
        },
    },
};

/**
 * Códigos de error de Stripe traducidos al español
 */
export const stripeErrorMessages: Record<string, string> = {
    'card_declined': 'Tu tarjeta ha sido rechazada. Por favor, usa otra tarjeta.',
    'expired_card': 'Tu tarjeta ha expirado. Por favor, usa otra tarjeta.',
    'incorrect_cvc': 'El código de seguridad (CVC) es incorrecto.',
    'incorrect_number': 'El número de tarjeta es incorrecto.',
    'invalid_expiry_month': 'El mes de expiración es inválido.',
    'invalid_expiry_year': 'El año de expiración es inválido.',
    'invalid_number': 'El número de tarjeta no es válido.',
    'processing_error': 'Error al procesar el pago. Inténtalo de nuevo.',
    'insufficient_funds': 'Fondos insuficientes. Por favor, usa otra tarjeta.',
    'authentication_required': 'Se requiere autenticación adicional.',
    'default': 'Ha ocurrido un error con el pago. Por favor, inténtalo de nuevo.',
};

/**
 * Obtener mensaje de error en español
 */
export const getStripeErrorMessage = (code: string): string => {
    return stripeErrorMessages[code] || stripeErrorMessages.default;
};