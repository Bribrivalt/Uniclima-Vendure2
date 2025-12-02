import { gql } from '@apollo/client';

/**
 * Fragment para información completa de la orden
 */
const ORDER_FRAGMENT = gql`
    fragment OrderFields on Order {
        id
        code
        state
        active
        totalQuantity
        subTotal
        subTotalWithTax
        shipping
        shippingWithTax
        total
        totalWithTax
        currencyCode
        customer {
            id
            firstName
            lastName
            emailAddress
        }
        shippingAddress {
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country
            phoneNumber
        }
        billingAddress {
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country
            phoneNumber
        }
        lines {
            id
            quantity
            linePrice
            linePriceWithTax
            productVariant {
                id
                name
                sku
                priceWithTax
                featuredAsset {
                    preview
                }
            }
        }
        shippingLines {
            shippingMethod {
                id
                name
                description
            }
            priceWithTax
        }
        payments {
            id
            method
            amount
            state
        }
    }
`;

/**
 * Mutation para establecer el email del cliente (guest checkout)
 */
export const SET_CUSTOMER_FOR_ORDER = gql`
    ${ORDER_FRAGMENT}
    mutation SetCustomerForOrder($input: CreateCustomerInput!) {
        setCustomerForOrder(input: $input) {
            ... on Order {
                ...OrderFields
            }
            ... on AlreadyLoggedInError {
                errorCode
                message
            }
            ... on EmailAddressConflictError {
                errorCode
                message
            }
            ... on NoActiveOrderError {
                errorCode
                message
            }
            ... on GuestCheckoutError {
                errorCode
                message
            }
        }
    }
`;

/**
 * Mutation para establecer la dirección de envío
 */
export const SET_ORDER_SHIPPING_ADDRESS = gql`
    ${ORDER_FRAGMENT}
    mutation SetOrderShippingAddress($input: CreateAddressInput!) {
        setOrderShippingAddress(input: $input) {
            ... on Order {
                ...OrderFields
            }
            ... on NoActiveOrderError {
                errorCode
                message
            }
        }
    }
`;

/**
 * Mutation para establecer la dirección de facturación
 */
export const SET_ORDER_BILLING_ADDRESS = gql`
    ${ORDER_FRAGMENT}
    mutation SetOrderBillingAddress($input: CreateAddressInput!) {
        setOrderBillingAddress(input: $input) {
            ... on Order {
                ...OrderFields
            }
            ... on NoActiveOrderError {
                errorCode
                message
            }
        }
    }
`;

/**
 * Query para obtener métodos de envío disponibles
 */
export const GET_ELIGIBLE_SHIPPING_METHODS = gql`
    query GetEligibleShippingMethods {
        eligibleShippingMethods {
            id
            name
            description
            price
            priceWithTax
            metadata
        }
    }
`;

/**
 * Mutation para establecer el método de envío
 */
export const SET_ORDER_SHIPPING_METHOD = gql`
    ${ORDER_FRAGMENT}
    mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
        setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
            ... on Order {
                ...OrderFields
            }
            ... on OrderModificationError {
                errorCode
                message
            }
            ... on IneligibleShippingMethodError {
                errorCode
                message
            }
            ... on NoActiveOrderError {
                errorCode
                message
            }
        }
    }
`;

/**
 * Query para obtener métodos de pago disponibles
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
 * Mutation para agregar un pago a la orden
 */
export const ADD_PAYMENT_TO_ORDER = gql`
    ${ORDER_FRAGMENT}
    mutation AddPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            ... on Order {
                ...OrderFields
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
 * Mutation para transicionar el estado de la orden
 */
export const TRANSITION_ORDER_TO_STATE = gql`
    ${ORDER_FRAGMENT}
    mutation TransitionOrderToState($state: String!) {
        transitionOrderToState(state: $state) {
            ... on Order {
                ...OrderFields
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
 * Mutation para aplicar código de cupón
 */
export const APPLY_COUPON_CODE = gql`
    ${ORDER_FRAGMENT}
    mutation ApplyCouponCode($couponCode: String!) {
        applyCouponCode(couponCode: $couponCode) {
            ... on Order {
                ...OrderFields
                couponCodes
                discounts {
                    type
                    description
                    amountWithTax
                }
            }
            ... on CouponCodeInvalidError {
                errorCode
                message
                couponCode
            }
            ... on CouponCodeExpiredError {
                errorCode
                message
                couponCode
            }
            ... on CouponCodeLimitError {
                errorCode
                message
                couponCode
                limit
            }
        }
    }
`;

/**
 * Mutation para eliminar código de cupón
 */
export const REMOVE_COUPON_CODE = gql`
    ${ORDER_FRAGMENT}
    mutation RemoveCouponCode($couponCode: String!) {
        removeCouponCode(couponCode: $couponCode) {
            ... on Order {
                ...OrderFields
                couponCodes
            }
        }
    }
`;

/**
 * Query para obtener orden por código
 */
export const GET_ORDER_BY_CODE = gql`
    ${ORDER_FRAGMENT}
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            ...OrderFields
        }
    }
`;

/**
 * Query para obtener historial de pedidos del cliente
 */
export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($options: OrderListOptions) {
        activeCustomer {
            id
            orders(options: $options) {
                items {
                    id
                    code
                    state
                    totalWithTax
                    createdAt
                    updatedAt
                    lines {
                        id
                        quantity
                        productVariant {
                            name
                            featuredAsset {
                                preview
                            }
                        }
                    }
                }
                totalItems
            }
        }
    }
`;