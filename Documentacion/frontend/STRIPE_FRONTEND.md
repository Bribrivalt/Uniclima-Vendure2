# 💳 Guía de Integración Stripe - Frontend

## Descripción

Esta guía explica cómo implementar el flujo de pago con Stripe en el frontend de Uniclima.

## Estado de la Configuración

✅ **Config Stripe** - `lib/stripe/config.ts`  
✅ **Mutations GraphQL** - `lib/vendure/mutations/stripe.ts`  
✅ **Variables de entorno** - `.env.local.example`  
⏳ **Pendiente** - Implementar componentes de checkout

## Configuración Inicial

### 1. Configurar Variables de Entorno

Copia `.env.local.example` a `.env.local` y añade tu clave pública de Stripe:

```bash
# frontend/.env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

> ⚠️ La clave debe empezar con `pk_test_` (desarrollo) o `pk_live_` (producción)

### 2. Instalar Dependencias

Si no están instaladas:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Archivos Existentes

### `lib/stripe/config.ts`

```typescript
import { loadStripe } from '@stripe/stripe-js';

// Obtener instancia de Stripe (singleton)
export const getStripe = () => loadStripe(STRIPE_PUBLIC_KEY, { locale: 'es' });

// Estilos para Stripe Elements
export const stripeElementsOptions = { /* ... */ };

// Mensajes de error en español
export const getStripeErrorMessage = (code: string) => { /* ... */ };
```

### `lib/vendure/mutations/stripe.ts`

| Mutation/Query | Descripción |
|----------------|-------------|
| `CREATE_STRIPE_PAYMENT_INTENT` | Crear PaymentIntent y obtener clientSecret |
| `ADD_PAYMENT_TO_ORDER` | Registrar pago en Vendure |
| `TRANSITION_ORDER_TO_STATE` | Cambiar estado de la orden |
| `GET_ELIGIBLE_PAYMENT_METHODS` | Obtener métodos de pago disponibles |
| `GET_ORDER_BY_CODE` | Obtener orden para página de confirmación |

## Implementación del Checkout

### Paso 1: Transicionar Orden a "ArrangingPayment"

Antes de mostrar el formulario de pago:

```typescript
import { useMutation } from '@apollo/client';
import { TRANSITION_ORDER_TO_STATE } from '@/lib/vendure/mutations/stripe';

function Checkout() {
    const [transitionOrder] = useMutation(TRANSITION_ORDER_TO_STATE);

    const prepareForPayment = async () => {
        const { data } = await transitionOrder({
            variables: { state: 'ArrangingPayment' }
        });
        
        if (data.transitionOrderToState.__typename === 'Order') {
            // Orden lista para pago
            return data.transitionOrderToState;
        } else {
            // Error de transición
            console.error(data.transitionOrderToState.message);
        }
    };
}
```

### Paso 2: Crear PaymentIntent

```typescript
import { useMutation } from '@apollo/client';
import { CREATE_STRIPE_PAYMENT_INTENT } from '@/lib/vendure/mutations/stripe';

function PaymentStep() {
    const [createPaymentIntent] = useMutation(CREATE_STRIPE_PAYMENT_INTENT);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        async function initPayment() {
            const { data } = await createPaymentIntent();
            if (data?.createStripePaymentIntent) {
                setClientSecret(data.createStripePaymentIntent);
            }
        }
        initPayment();
    }, []);

    if (!clientSecret) return <Loading />;
    
    return <StripePaymentForm clientSecret={clientSecret} />;
}
```

### Paso 3: Componente de Pago con Stripe Elements

```typescript
'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, stripeElementsOptions, getStripeErrorMessage } from '@/lib/stripe/config';

interface StripePaymentFormProps {
    clientSecret: string;
    orderCode: string;
}

export function StripePaymentForm({ clientSecret, orderCode }: StripePaymentFormProps) {
    return (
        <Elements 
            stripe={getStripe()} 
            options={{ 
                clientSecret,
                ...stripeElementsOptions 
            }}
        >
            <CheckoutForm orderCode={orderCode} />
        </Elements>
    );
}

function CheckoutForm({ orderCode }: { orderCode: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/pedido/confirmacion?code=${orderCode}`,
            },
        });

        if (stripeError) {
            setError(getStripeErrorMessage(stripeError.code || 'default'));
            setLoading(false);
        }
        // Si no hay error, Stripe redirige automáticamente a return_url
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={!stripe || loading}
            >
                {loading ? 'Procesando...' : 'Pagar ahora'}
            </button>
        </form>
    );
}
```

### Paso 4: Página de Confirmación

```typescript
// app/pedido/confirmacion/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ORDER_BY_CODE } from '@/lib/vendure/mutations/stripe';

export default function OrderConfirmation() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    const { data, loading, error } = useQuery(GET_ORDER_BY_CODE, {
        variables: { code },
        skip: !code,
    });

    if (loading) return <div>Cargando...</div>;
    
    if (error || !data?.orderByCode) {
        return <div>Error al cargar el pedido</div>;
    }

    const order = data.orderByCode;
    const isPaymentSuccessful = redirectStatus === 'succeeded';

    return (
        <div>
            {isPaymentSuccessful ? (
                <>
                    <h1>¡Gracias por tu compra!</h1>
                    <p>Tu pedido #{order.code} ha sido confirmado.</p>
                </>
            ) : (
                <>
                    <h1>Pago no completado</h1>
                    <p>Hubo un problema con tu pago. Por favor, inténtalo de nuevo.</p>
                </>
            )}
            
            {/* Detalles del pedido */}
            <div>
                <h2>Resumen del pedido</h2>
                <p>Total: {(order.totalWithTax / 100).toFixed(2)}€</p>
                {/* ... más detalles */}
            </div>
        </div>
    );
}
```

## Flujo Completo de Checkout

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUJO DE PAGO                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Carrito → Checkout                                          │
│     └── Usuario revisa carrito y hace clic en "Continuar"       │
│                                                                 │
│  2. Dirección de envío                                          │
│     └── setOrderShippingAddress()                               │
│                                                                 │
│  3. Método de envío                                             │
│     └── setOrderShippingMethod()                                │
│                                                                 │
│  4. Preparar para pago                                          │
│     └── transitionOrderToState({ state: 'ArrangingPayment' })   │
│                                                                 │
│  5. Crear PaymentIntent                                         │
│     └── createStripePaymentIntent() → clientSecret              │
│                                                                 │
│  6. Mostrar formulario de Stripe                                │
│     └── <Elements><PaymentElement /></Elements>                 │
│                                                                 │
│  7. Usuario completa pago                                       │
│     └── stripe.confirmPayment() → redirect a confirmación       │
│                                                                 │
│  8. Webhook procesa pago (backend)                              │
│     └── Vendure recibe payment_intent.succeeded                 │
│                                                                 │
│  9. Página de confirmación                                      │
│     └── orderByCode() → Mostrar detalles del pedido             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Estilos CSS Sugeridos

```css
/* components/checkout/StripePayment.module.css */

.paymentForm {
    max-width: 500px;
    margin: 0 auto;
}

.paymentElement {
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    margin-bottom: 20px;
}

.submitButton {
    width: 100%;
    padding: 16px;
    background: #0052CC;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.submitButton:hover:not(:disabled) {
    background: #003d99;
}

.submitButton:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.errorMessage {
    background: #fee;
    border: 1px solid #fcc;
    color: #c00;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
}
```

## Pruebas

### Tarjetas de Prueba

| Resultado | Número | CVC | Fecha |
|-----------|--------|-----|-------|
| ✅ Exitoso | `4242 4242 4242 4242` | 123 | 12/34 |
| 🔐 3D Secure | `4000 0025 0000 3155` | 123 | 12/34 |
| ❌ Rechazada | `4000 0000 0000 9995` | 123 | 12/34 |

### Verificar Integración

1. Añadir producto al carrito
2. Ir a checkout
3. Completar dirección y envío
4. Usar tarjeta de prueba `4242 4242 4242 4242`
5. Verificar redirección a página de confirmación
6. Verificar que el pedido aparece en Dashboard de Vendure

## Troubleshooting

### "Stripe public key not configured"
- Verifica que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` esté en `.env.local`
- Reinicia el servidor de desarrollo después de añadir la variable

### PaymentElement no aparece
- Verifica que `clientSecret` no sea null/undefined
- Revisa la consola para errores de Stripe.js

### Pago se confirma pero no redirige
- Verifica que `return_url` sea una URL válida y absoluta
- Revisa que el código de orden esté incluido en la URL

### Error "No active order"
- El usuario puede haber perdido la sesión
- Implementa persistencia de carrito o muestra mensaje de error

## Enlaces Útiles

- [Stripe Elements React](https://stripe.com/docs/stripe-js/react)
- [Payment Element](https://stripe.com/docs/payments/payment-element)
- [Testing Stripe](https://stripe.com/docs/testing)
- [Stripe.js Reference](https://stripe.com/docs/js)

---

*Última actualización: 16/12/2025*