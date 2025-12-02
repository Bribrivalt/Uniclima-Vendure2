'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './vendure/client';
import { AuthProvider } from './auth-context';
import { ToastProvider } from '@/components/ui/Toast';

/**
 * Providers wrapper para la aplicación
 * Combina Apollo Client, Auth Context y Toast notifications
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={apolloClient}>
            <ToastProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ToastProvider>
        </ApolloProvider>
    );
}
