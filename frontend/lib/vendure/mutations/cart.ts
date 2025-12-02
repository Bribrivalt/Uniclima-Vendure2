import { gql } from '@apollo/client';

/**
 * Mutation para añadir un item al carrito (order)
 */
export const ADD_ITEM_TO_ORDER = gql`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        code
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
          productVariant {
            id
            name
          }
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on OrderLimitError {
        errorCode
        message
      }
      ... on NegativeQuantityError {
        errorCode
        message
      }
      ... on InsufficientStockError {
        errorCode
        message
      }
    }
  }
`;

/**
 * Mutation para remover un item del carrito
 */
export const REMOVE_ORDER_LINE = gql`
  mutation RemoveOrderLine($orderLineId: ID!) {
    removeOrderLine(orderLineId: $orderLineId) {
      ... on Order {
        id
        code
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
    }
  }
`;

/**
 * Mutation para ajustar la cantidad de un item
 */
export const ADJUST_ORDER_LINE = gql`
  mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
      ... on Order {
        id
        code
        totalQuantity
        totalWithTax
        lines {
          id
          quantity
        }
      }
      ... on OrderModificationError {
        errorCode
        message
      }
      ... on InsufficientStockError {
        errorCode
        message
      }
      ... on NegativeQuantityError {
        errorCode
        message
      }
    }
  }
`;
