/**
 * Apollo Client para Vendure Shop API
 *
 * Configuración con:
 * - Persistencia de sesión del carrito mediante vendure-token
 * - Autenticación mediante Bearer token
 * - Manejo global de errores
 * - Cache optimizado para queries frecuentes
 *
 * @author Frontend Team
 * @version 1.1.0
 */

import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// ========================================
// CONSTANTES
// ========================================

/** Endpoint de Vendure Shop API */
const VENDURE_SHOP_API = process.env.NEXT_PUBLIC_VENDURE_SHOP_API || 'http://localhost:3001/shop-api';

/** Clave para guardar el token de sesión de Vendure en localStorage */
const VENDURE_TOKEN_KEY = 'vendure-token';

/** Clave para guardar el token de autenticación en localStorage */
const AUTH_TOKEN_KEY = 'vendure-auth-token';

// ========================================
// HELPERS
// ========================================

/**
 * Obtiene un valor de localStorage de forma segura (SSR compatible)
 * @param key - Clave del item a obtener
 * @returns El valor almacenado o null si no existe o estamos en servidor
 */
const getStorageItem = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

/**
 * Guarda un valor en localStorage de forma segura (SSR compatible)
 * @param key - Clave del item a guardar
 * @param value - Valor a almacenar
 */
const setStorageItem = (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, value);
    } catch {
        console.warn(`[Storage] No se pudo guardar ${key}`);
    }
};

// ========================================
// APOLLO LINKS
// ========================================

/**
 * HttpLink - Conexión con Vendure Shop API
 * credentials: 'include' permite que las cookies de sesión se envíen
 */
const httpLink = new HttpLink({
    uri: VENDURE_SHOP_API,
    credentials: 'include',
});

/**
 * AuthLink - Añade tokens de autenticación y sesión en los headers
 *
 * Headers enviados:
 * - vendure-token: Token de sesión para persistir el carrito
 * - authorization: Bearer token para usuarios autenticados
 */
const authLink = setContext((_, { headers }) => {
    // Obtener token de sesión (para carrito)
    const vendureToken = getStorageItem(VENDURE_TOKEN_KEY);
    // Obtener token de autenticación (para usuario)
    const authToken = getStorageItem(AUTH_TOKEN_KEY);

    return {
        headers: {
            ...headers,
            // Token de sesión de Vendure (persistencia del carrito)
            ...(vendureToken ? { 'vendure-token': vendureToken } : {}),
            // Token de autenticación del usuario
            ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
        },
    };
});

/**
 * AfterwareLink - Captura el token de sesión de las respuestas
 *
 * Vendure devuelve un header 'vendure-token' que identifica la sesión.
 * Este token permite que el carrito persista entre recargas de página.
 */
const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
        // Obtener el contexto de la respuesta
        const context = operation.getContext();
        const responseHeaders = context.response?.headers;

        if (responseHeaders) {
            // Capturar el token de sesión de Vendure
            const vendureToken = responseHeaders.get('vendure-token');
            if (vendureToken) {
                // Guardar en localStorage para futuras peticiones
                setStorageItem(VENDURE_TOKEN_KEY, vendureToken);
            }
        }

        return response;
    });
});

/**
 * ErrorLink - Manejo global de errores GraphQL y de red
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}, Operation: ${operation.operationName}`
            );
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError.message}`);
    }
});

// ========================================
// CACHE CONFIGURATION
// ========================================

/**
 * Configuración del cache de Apollo
 *
 * Políticas de tipo:
 * - Order: Se usa el campo 'id' para identificar órdenes únicas
 * - Product: Se usa el campo 'id' para productos
 * - activeOrder: Siempre mezcla los datos entrantes con los existentes
 */
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // El carrito activo siempre debe actualizarse con nuevos datos
                activeOrder: {
                    merge(existing, incoming) {
                        return incoming;
                    },
                },
            },
        },
        // Configuración para identificar Orders correctamente
        Order: {
            keyFields: ['id'],
            fields: {
                // Las líneas del pedido se mezclan por ID
                lines: {
                    merge(existing = [], incoming) {
                        return incoming;
                    },
                },
            },
        },
        // Configuración para identificar Products correctamente
        Product: {
            keyFields: ['id'],
        },
        // Configuración para identificar ProductVariants correctamente
        ProductVariant: {
            keyFields: ['id'],
        },
    },
});

// ========================================
// APOLLO CLIENT
// ========================================

/**
 * Cliente Apollo configurado para Vendure
 *
 * Cadena de links:
 * 1. errorLink - Captura y loggea errores
 * 2. afterwareLink - Captura el token de sesión de las respuestas
 * 3. authLink - Añade tokens de autenticación en las peticiones
 * 4. httpLink - Realiza la petición HTTP a Vendure
 */
export const apolloClient = new ApolloClient({
    link: from([errorLink, afterwareLink, authLink, httpLink]),
    cache,
    defaultOptions: {
        // Para queries observadas (useQuery)
        watchQuery: {
            fetchPolicy: 'cache-and-network', // Usa cache pero actualiza desde red
            errorPolicy: 'all', // Muestra datos parciales aunque haya errores
        },
        // Para queries únicas
        query: {
            fetchPolicy: 'network-only', // Siempre va a la red
            errorPolicy: 'all',
        },
        // Para mutations
        mutate: {
            errorPolicy: 'all',
        },
    },
});

// ========================================
// EXPORTS ADICIONALES
// ========================================

/**
 * Limpia los tokens de sesión (útil para logout completo)
 */
export const clearVendureSession = (): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(VENDURE_TOKEN_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
        console.warn('[Storage] No se pudieron eliminar los tokens');
    }
};

/**
 * Obtiene el token de sesión actual (útil para debugging)
 */
export const getVendureToken = (): string | null => {
    return getStorageItem(VENDURE_TOKEN_KEY);
};
