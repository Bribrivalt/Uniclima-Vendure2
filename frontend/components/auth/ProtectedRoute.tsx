'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
}

/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación
 * 
 * @param children - Contenido a mostrar si el usuario está autenticado
 * @param redirectTo - Ruta a la que redirigir si no está autenticado (default: '/login')
 * @param requireAuth - Si requiere autenticación (default: true)
 * 
 * @example
 * ```tsx
 * // En una página protegida
 * export default function CuentaPage() {
 *     return (
 *         <ProtectedRoute>
 *             <h1>Mi Cuenta</h1>
 *             {/* Contenido protegido *\/}
 *         </ProtectedRoute>
 *     );
 * }
 * ```
 */
export function ProtectedRoute({
    children,
    redirectTo = '/login',
    requireAuth = true,
}: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        // Si requiere autenticación y no está autenticado, redirigir
        if (requireAuth && !loading && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                color: 'var(--color-text-secondary)',
            }}>
                <div>
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        style={{
                            animation: 'spin 1s linear infinite',
                        }}
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeWidth="4"
                            stroke="currentColor"
                            strokeOpacity="0.25"
                        />
                        <path
                            d="M12 2a10 10 0 0 1 10 10"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Si no requiere autenticación o está autenticado, mostrar contenido
    if (!requireAuth || isAuthenticated) {
        return <>{children}</>;
    }

    // Si requiere autenticación y no está autenticado, no mostrar nada
    // (la redirección se maneja en el useEffect)
    return null;
}

/**
 * withAuth - HOC para proteger componentes/páginas
 * 
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(MiCuentaPage);
 * export default ProtectedPage;
 * ```
 */
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    redirectTo: string = '/login'
) {
    return function WithAuthComponent(props: P) {
        return (
            <ProtectedRoute redirectTo={redirectTo}>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
}
