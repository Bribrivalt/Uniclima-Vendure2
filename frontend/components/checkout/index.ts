/**
 * Barrel export para componentes del checkout
 *
 * Este archivo centraliza todas las exportaciones de los componentes
 * relacionados con el proceso de checkout.
 */

// Componentes existentes
export { CheckoutSteps, DEFAULT_CHECKOUT_STEPS } from './CheckoutSteps';
export { ShippingForm } from './ShippingForm';
export { OrderSummary } from './OrderSummary';

// Nuevos componentes - Lista 2.5
export { AddressForm } from './AddressForm';
export { ShippingMethodSelector } from './ShippingMethodSelector';
export { PaymentMethodSelector } from './PaymentMethodSelector';
export { OrderReview } from './OrderReview';

// Componente de pago Stripe - Comentado temporalmente para desarrollo
// export { StripePaymentForm } from './StripePaymentForm';

// Tipos existentes
export type { CheckoutStepsProps, CheckoutStep } from './CheckoutSteps';
export type { ShippingFormProps, ShippingAddress } from './ShippingForm';
export type { OrderSummaryProps, OrderLineItem } from './OrderSummary';

// Tipos nuevos - Lista 2.5
export type { AddressFormProps, Address } from './AddressForm';
export type { ShippingMethodSelectorProps, ShippingMethod } from './ShippingMethodSelector';
export type { PaymentMethodSelectorProps, PaymentMethod } from './PaymentMethodSelector';
export type { OrderReviewProps, OrderReviewItem } from './OrderReview';