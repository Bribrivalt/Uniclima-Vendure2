/**
 * Mutations y Queries para integración con Stripe en Vendure
 * 
 * @description Operaciones GraphQL para el proceso de pago con Stripe
 */

import { gql } from '@apollo/client';

/**
 * Crear intento de pago de Stripe
 * Esta mutation crea el PaymentIntent en Stripe y devuelve el client secret
 */
export const CREATE_STRIPE_PAYMENT_INTENT = gql`
    mutation CreateStripePaymentIntent {
        createStripePaymentIntent
    }
`;

/**
 * Añadir pago a la orden usando Stripe
 * Se llama después de que el cliente confirme el pago en Stripe
 */
export const ADD_PAYMENT_TO_ORDER = gql`
    mutation AddPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            ... on Order {
                id
                code
                state
                totalWithTax
                payments {
                    id
                    method
                    amount
                    state
                    transactionId
                    errorMessage
                }
            }
            ... on OrderPaymentStateError {
                errorCode
                message
            }
            ... on IneligiblePaymentMethodError {
                errorCode
                message
            }
            ... on PaymentFailedError {
                errorCode
                message
                paymentErrorMessage
            }
            ... on PaymentDeclinedError {
                errorCode
                message
                paymentErrorMessage
            }
            ... on OrderStateTransitionError {
                errorCode
                message
                transitionError
            }
            ... on NoActiveOrderError {
                errorCode
                message
            }
        }
    }
`;

/**
 * Obtener métodos de pago elegibles
 * Debe incluir el método de pago Stripe configurado
 */
export const GET_ELIGIBLE_PAYMENT_METHODS = gql`
    query GetEligiblePaymentMethods {
        eligiblePaymentMethods {
            id
            code
            name
            description
            isEligible
            eligibilityMessage
        }
    }
`;

/**
 * Transicionar el estado del pedido
 * Usado para mover la orden a ArrangingPayment antes de procesar el pago
 */
export const TRANSITION_ORDER_TO_STATE = gql`
    mutation TransitionOrderToState($state: String!) {
        transitionOrderToState(state: $state) {
            ... on Order {
                id
                code
                state
                totalWithTax
            }
            ... on OrderStateTransitionError {
                errorCode
                message
                transitionError
                fromState
                toState
            }
        }
    }
`;

/**
 * Obtener orden por código (para página de confirmación)
 */
export const GET_ORDER_BY_CODE = gql`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            id
            code
            state
            createdAt
            totalWithTax
            shippingWithTax
            subTotalWithTax
            customer {
                firstName
                lastName
                emailAddress
            }
            shippingAddress {
                fullName
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
            }
            shippingLines {
                shippingMethod {
                    name
                    description
                }
                priceWithTax
            }
            lines {
                id
                quantity
                linePriceWithTax
                productVariant {
                    name
                    sku
                    featuredAsset {
                        preview
                    }
                }
            }
            payments {
                id
                method
                amount
                state
                transactionId
            }
        }
    }
`;