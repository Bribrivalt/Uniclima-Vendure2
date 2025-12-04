import { gql } from '@apollo/client';
import { ERROR_RESULT_FRAGMENT } from '../queries/auth';

/**
 * Mutation para autenticar usuario
 */
export const LOGIN_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation Login($email: String!, $password: String!) {
    login(username: $email, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para registrar nuevo cliente
 */
export const REGISTER_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation RegisterCustomerAccount($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on MissingPasswordError {
        ...ErrorResult
      }
      ... on PasswordValidationError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para cerrar sesión
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

/**
 * Mutation para verificar email (si aplica)
 */
export const VERIFY_EMAIL_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation VerifyCustomerAccount($token: String!) {
    verifyCustomerAccount(token: $token) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on VerificationTokenInvalidError {
        ...ErrorResult
      }
      ... on VerificationTokenExpiredError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para solicitar reset de contraseña
 */
export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation RequestPasswordReset($emailAddress: String!) {
    requestPasswordReset(emailAddress: $emailAddress) {
      ... on Success {
        success
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para actualizar datos del cliente
 */
export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      title
      firstName
      lastName
      phoneNumber
      emailAddress
    }
  }
`;

/**
 * Mutation para cambiar contraseña (usuario autenticado)
 */
export const UPDATE_CUSTOMER_PASSWORD_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation UpdateCustomerPassword($currentPassword: String!, $newPassword: String!) {
    updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      ... on Success {
        success
      }
      ... on InvalidCredentialsError {
        ...ErrorResult
      }
      ... on PasswordValidationError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para actualizar dirección del cliente
 */
export const UPDATE_CUSTOMER_ADDRESS_MUTATION = gql`
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
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
`;

/**
 * Mutation para crear nueva dirección del cliente
 */
export const CREATE_CUSTOMER_ADDRESS_MUTATION = gql`
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
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
`;

/**
 * Mutation para eliminar dirección del cliente
 */
export const DELETE_CUSTOMER_ADDRESS_MUTATION = gql`
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`;

/**
 * Mutation para resetear contraseña
 */
export const RESET_PASSWORD_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on PasswordResetTokenInvalidError {
        ...ErrorResult
      }
      ... on PasswordResetTokenExpiredError {
        ...ErrorResult
      }
      ... on PasswordValidationError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;
