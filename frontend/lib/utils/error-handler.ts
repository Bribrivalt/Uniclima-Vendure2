/**
 * Utilidades para manejo centralizado de errores
 * 
 * Proporciona funciones helper para convertir errores de GraphQL
 * en mensajes user-friendly en español.
 */

import { ApolloError } from '@apollo/client';

/**
 * Maneja errores de GraphQL y retorna mensaje user-friendly
 */
export function handleGraphQLError(error: ApolloError): string {
    // Error de red
    if (error.networkError) {
        return 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.';
    }

    // Errores de GraphQL
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const firstError = error.graphQLErrors[0];

        // Mapear códigos de error comunes a mensajes en español
        const errorCode = (firstError.extensions?.code as string) || '';

        switch (errorCode) {
            case 'UNAUTHENTICATED':
                return 'Debes iniciar sesión para realizar esta acción.';
            case 'FORBIDDEN':
                return 'No tienes permisos para realizar esta acción.';
            case 'NOT_FOUND':
                return 'El recurso solicitado no fue encontrado.';
            case 'INVALID_CREDENTIALS':
                return 'Email o contraseña incorrectos.';
            case 'EMAIL_ALREADY_EXISTS':
                return 'Este email ya está registrado.';
            case 'PASSWORD_VALIDATION_ERROR':
                return 'La contraseña no cumple con los requisitos mínimos.';
            default:
                return firstError.message || 'Ha ocurrido un error. Por favor, intenta de nuevo.';
        }
    }

    // Error genérico
    return 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';
}

/**
 * Maneja errores generales y retorna mensaje user-friendly
 */
export function handleError(error: unknown): string {
    if (error instanceof ApolloError) {
        return handleGraphQLError(error);
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';
}

/**
 * Valida si un error es de autenticación
 */
export function isAuthError(error: ApolloError): boolean {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const errorCode = error.graphQLErrors[0].extensions?.code as string;
        return errorCode === 'UNAUTHENTICATED' || errorCode === 'INVALID_CREDENTIALS';
    }
    return false;
}

/**
 * Extrae el código de error de un ApolloError
 */
export function getErrorCode(error: ApolloError): string | null {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        return (error.graphQLErrors[0].extensions?.code as string) || null;
    }
    return null;
}
