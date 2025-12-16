# 💳 Configuración de Stripe - Uniclima Vendure

## Descripción

Este documento explica cómo configurar la integración de pagos con Stripe en el proyecto Uniclima Vendure.

## Estado Actual

✅ **StripePlugin habilitado** en `vendure-config.ts`  
✅ **Endpoint webhook** configurado en `/payments/stripe`  
✅ **Script de configuración** disponible  
⏳ **Pendiente**: Configurar claves de Stripe reales

## Arquitectura de la Integración

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Frontend     │     │     Backend      │     │     Stripe      │
│   (Next.js)     │     │    (Vendure)     │     │      API        │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                        │
         │ 1. createStripePaymentIntent                   │
         │ ──────────────────────>                        │
         │                       │ 2. Create PaymentIntent│
         │                       │ ───────────────────────>
         │                       │                        │
         │                       │ 3. Return clientSecret │
         │                       │ <───────────────────────
         │ 4. Return clientSecret│                        │
         │ <──────────────────────                        │
         │                       │                        │
         │ 5. confirmPayment (Stripe.js)                  │
         │ ───────────────────────────────────────────────>
         │                       │                        │
         │                       │ 6. Webhook: payment_intent.succeeded
         │                       │ <───────────────────────
         │                       │                        │
         │ 7. Redirect to confirmation                    │
         │ <───────────────────────────────────────────────
```

## Configuración Paso a Paso

### 1. Obtener Claves de Stripe

1. Crea una cuenta en [Stripe Dashboard](https://dashboard.stripe.com)
2. Ve a **Developers → API keys**
3. Copia:
   - **Publishable key** (`pk_test_...` para desarrollo, `pk_live_...` para producción)
   - **Secret key** (`sk_test_...` para desarrollo, `sk_live_...` para producción)

> ⚠️ **IMPORTANTE**: Las claves de prueba (`pk_test_`, `sk_test_`) NO procesan pagos reales.

### 2. Configurar Variables de Entorno

#### Backend (`backend/.env`)

```bash
# Stripe - Claves de API
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Frontend (`frontend/.env.local`)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Configurar Webhook (Desarrollo Local)

Para recibir eventos de Stripe en desarrollo local, usa Stripe CLI:

```bash
# Instalar Stripe CLI
# Windows (chocolatey):
choco install stripe-cli

# macOS (homebrew):
brew install stripe/stripe-cli/stripe

# Autenticarse
stripe login

# Reenviar webhooks a localhost
stripe listen --forward-to localhost:3001/payments/stripe
```

El CLI mostrará un webhook signing secret (`whsec_...`) que debes copiar a `.env`.

### 4. Crear Método de Pago en Vendure

#### Opción A: Usar el script automático

```bash
cd backend
npx tsx scripts/seed-stripe-payment-method.ts
```

#### Opción B: Crear manualmente en el Dashboard

1. Ve a http://localhost:3001/dashboard
2. Navega a **Settings → Payment methods**
3. Clic en **Create new payment method**
4. Configura:
   - **Name**: `Tarjeta de crédito/débito`
   - **Code**: `stripe`
   - **Payment Handler**: Selecciona `Stripe payments`
   - **API Key**: Tu secret key (`sk_test_...`)
   - **Webhook Secret**: Tu webhook signing secret (`whsec_...`)
   - **Enabled**: ✓
5. Clic en **Create**

## Configuración del Frontend

El frontend ya tiene preparadas las siguientes utilidades:

### Configuración de Stripe (`lib/stripe/config.ts`)

```typescript
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const getStripe = () => {
    return loadStripe(STRIPE_PUBLIC_KEY, { locale: 'es' });
};
```

### Mutations GraphQL (`lib/vendure/mutations/stripe.ts`)

- `CREATE_STRIPE_PAYMENT_INTENT` - Crear intento de pago
- `ADD_PAYMENT_TO_ORDER` - Añadir pago a la orden
- `TRANSITION_ORDER_TO_STATE` - Cambiar estado de la orden

## Pruebas

### Tarjetas de Prueba

| Resultado | Número de Tarjeta |
|-----------|-------------------|
| ✅ Pago exitoso | `4242 4242 4242 4242` |
| ✅ Mastercard | `5555 5555 5555 4444` |
| 🔐 3D Secure | `4000 0025 0000 3155` |
| ❌ Rechazada (fondos) | `4000 0000 0000 9995` |
| ❌ Rechazada (genérica) | `4000 0000 0000 0002` |

> Para todas las tarjetas de prueba: CVC = 3 dígitos, Fecha = cualquier fecha futura

### Probar Webhook Localmente

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3001/payments/stripe

# Terminal 3: Trigger evento de prueba
stripe trigger payment_intent.succeeded
```

## Configuración de Producción

### Webhook en Stripe Dashboard

1. Ve a [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Clic en **Add endpoint**
3. Configura:
   - **Endpoint URL**: `https://tu-dominio.com/payments/stripe`
   - **Events**:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Copia el **Signing secret** y actualiza `STRIPE_WEBHOOK_SECRET`

### Checklist de Producción

- [ ] Cambiar a claves live (`pk_live_`, `sk_live_`)
- [ ] Configurar webhook apuntando al dominio de producción
- [ ] Actualizar `STRIPE_WEBHOOK_SECRET` en el servidor
- [ ] Probar un pago de prueba
- [ ] Verificar emails de confirmación

## Troubleshooting

### "Stripe payments" no aparece en el selector de Payment Handler

- Asegúrate de que el backend esté reiniciado después de añadir StripePlugin
- Verifica que veas en los logs: `Mapped {/payments/stripe, POST} route`

### Error: "Webhook signature verification failed"

- Verifica que `STRIPE_WEBHOOK_SECRET` sea correcto
- En desarrollo, asegúrate de que `stripe listen` esté corriendo

### Error: "API Key not valid"

- Verifica que estés usando la clave correcta (test vs live)
- Asegúrate de usar `sk_test_` en desarrollo

### Los pagos no se reflejan en Vendure

- Verifica que el webhook esté configurado correctamente
- Revisa los logs del backend para ver si llegan los eventos
- Usa `stripe logs tail` para ver eventos en tiempo real

## Enlaces Útiles

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Vendure Stripe Plugin](https://docs.vendure.io/reference/core-plugins/payments-plugin/stripe-plugin/)
- [Testing Stripe](https://stripe.com/docs/testing)

---

*Última actualización: 16/12/2025*