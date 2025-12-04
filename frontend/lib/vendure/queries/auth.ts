import { gql } from '@apollo/client';

/**
 * Query para obtener el cliente activo (usuario autenticado)
 */
export const GET_ACTIVE_CUSTOMER = gql`
  query GetActiveCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
    }
  }
`;

/**
 * Query para obtener el cliente activo con sus direcciones
 */
export const GET_ACTIVE_CUSTOMER_WITH_ADDRESSES = gql`
  query GetActiveCustomerWithAddresses {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          code
          name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`;

/**
 * Fragment para datos de error
 */
export const ERROR_RESULT_FRAGMENT = gql`
  fragment ErrorResult on ErrorResult {
    errorCode
    message
  }
`;
