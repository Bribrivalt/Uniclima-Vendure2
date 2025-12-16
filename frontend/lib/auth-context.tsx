/**
 * Auth Context - Contexto de autenticación para Uniclima
 *
 * Proporciona:
 * - Estado del usuario actual
 * - Métodos de login, logout y registro
 * - Verificación de autenticación
 * - Limpieza de sesión del carrito al cerrar sesión
 *
 * @author Frontend Team
 * @version 1.1.0
 */
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, LOGOUT_MUTATION, REGISTER_MUTATION, UPDATE_CUSTOMER_MUTATION, UPDATE_CUSTOMER_PASSWORD_MUTATION } from './vendure/mutations/auth';
import { GET_ACTIVE_CUSTOMER } from './vendure/queries/auth';
import { clearVendureSession } from './vendure/client';

// ========================================
// TIPOS
// ========================================

export interface Customer {
    id: string;
    title?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
}

export interface RegisterInput {
    title?: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber?: string;
    password: string;
}

export interface UpdateProfileInput {
    title?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export interface AuthContextType {
    currentUser: Customer | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
    checkAuth: () => Promise<void>;
    updateProfile: (input: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

// ========================================
// CONTEXTO
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// PROVIDER
// ========================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    // Query para obtener usuario activo
    const { data: customerData, error: customerError, refetch: refetchCustomer } = useQuery(GET_ACTIVE_CUSTOMER, {
        fetchPolicy: 'network-only',
    });

    // Manejar cambios en customerData (reemplaza onCompleted/onError deprecados)
    useEffect(() => {
        if (customerData?.activeCustomer) {
            setCurrentUser(customerData.activeCustomer);
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    }, [customerData]);

    // Manejar errores en la query
    useEffect(() => {
        if (customerError) {
            setCurrentUser(null);
            setLoading(false);
        }
    }, [customerError]);

    // Mutations
    const [loginMutation] = useMutation(LOGIN_MUTATION);
    const [logoutMutation] = useMutation(LOGOUT_MUTATION);
    const [registerMutation] = useMutation(REGISTER_MUTATION);
    const [updateCustomerMutation] = useMutation(UPDATE_CUSTOMER_MUTATION);
    const [updatePasswordMutation] = useMutation(UPDATE_CUSTOMER_PASSWORD_MUTATION);

    // ========================================
    // MÉTODOS
    // ========================================

    /**
     * Login de usuario
     */
    const login = useCallback(
        async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
            try {
                const { data } = await loginMutation({
                    variables: { email, password },
                });

                const result = data?.login;

                // Verificar si hay error
                if (result?.errorCode) {
                    return {
                        success: false,
                        error: result.message || 'Credenciales inválidas',
                    };
                }

                // Login exitoso
                if (result?.id) {
                    // Refetch para obtener datos completos del usuario
                    await refetchCustomer();
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Error desconocido al iniciar sesión',
                };
            } catch (error) {
                console.error('Error en login:', error);
                return {
                    success: false,
                    error: 'Error de conexión. Por favor, intenta de nuevo.',
                };
            }
        },
        [loginMutation, refetchCustomer]
    );

    /**
     * Registro de nuevo usuario
     */
    const register = useCallback(
        async (input: RegisterInput): Promise<{ success: boolean; error?: string }> => {
            try {
                const { data } = await registerMutation({
                    variables: { input },
                });

                const result = data?.registerCustomerAccount;

                // Verificar si hay error
                if (result?.errorCode) {
                    return {
                        success: false,
                        error: result.message || 'Error al registrar usuario',
                    };
                }

                // Registro exitoso
                if (result?.success) {
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Error desconocido al registrar usuario',
                };
            } catch (error) {
                console.error('Error en registro:', error);
                return {
                    success: false,
                    error: 'Error de conexión. Por favor, intenta de nuevo.',
                };
            }
        },
        [registerMutation]
    );

    /**
     * Logout de usuario
     *
     * Realiza:
     * 1. Mutation de logout en Vendure
     * 2. Limpia el estado del usuario
     * 3. Limpia todos los tokens de sesión (auth + carrito)
     *
     * Nota: El carrito se limpia porque puede contener datos del usuario
     */
    const logout = useCallback(async () => {
        try {
            // Llamar al endpoint de logout de Vendure
            await logoutMutation();
            // Limpiar estado del usuario
            setCurrentUser(null);
            // Limpiar todos los tokens de sesión (auth + vendure-token)
            clearVendureSession();
        } catch (error) {
            console.error('Error en logout:', error);
            // Aún así limpiar los datos locales
            setCurrentUser(null);
            clearVendureSession();
        }
    }, [logoutMutation]);

    /**
     * Verificar autenticación actual
     */
    const checkAuth = useCallback(async () => {
        try {
            await refetchCustomer();
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            setCurrentUser(null);
        }
    }, [refetchCustomer]);

    /**
     * Actualizar perfil de usuario
     */
    const updateProfile = useCallback(
        async (input: UpdateProfileInput): Promise<{ success: boolean; error?: string }> => {
            try {
                const { data } = await updateCustomerMutation({
                    variables: { input },
                });

                if (data?.updateCustomer) {
                    // Actualizar estado local con los nuevos datos
                    setCurrentUser(data.updateCustomer);
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Error al actualizar el perfil',
                };
            } catch (error) {
                console.error('Error al actualizar perfil:', error);
                return {
                    success: false,
                    error: 'Error de conexión. Por favor, intenta de nuevo.',
                };
            }
        },
        [updateCustomerMutation]
    );

    /**
     * Actualizar contraseña
     */
    const updatePassword = useCallback(
        async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
            try {
                const { data } = await updatePasswordMutation({
                    variables: { currentPassword, newPassword },
                });

                const result = data?.updateCustomerPassword;

                // Verificar si hay error
                if (result?.errorCode) {
                    return {
                        success: false,
                        error: result.message || 'Error al cambiar la contraseña',
                    };
                }

                // Cambio exitoso
                if (result?.success) {
                    return { success: true };
                }

                return {
                    success: false,
                    error: 'Error desconocido al cambiar la contraseña',
                };
            } catch (error) {
                console.error('Error al cambiar contraseña:', error);
                return {
                    success: false,
                    error: 'Error de conexión. Por favor, intenta de nuevo.',
                };
            }
        },
        [updatePasswordMutation]
    );

    // ========================================
    // VALOR DEL CONTEXTO
    // ========================================

    const value: AuthContextType = {
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        logout,
        register,
        checkAuth,
        updateProfile,
        updatePassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ========================================
// HOOK PERSONALIZADO
// ========================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
};
