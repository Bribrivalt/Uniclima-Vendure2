'use client';

import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/auth-context';
import styles from './page.module.css';

export default function CuentaPage() {
    const { currentUser, logout } = useAuth();

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Mi Cuenta</h1>
                    <button onClick={logout} className={styles.logoutButton}>
                        Cerrar Sesión
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2>Información Personal</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <label>Nombre</label>
                                <p>{currentUser?.firstName}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Apellido</label>
                                <p>{currentUser?.lastName}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Email</label>
                                <p>{currentUser?.emailAddress}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label>Teléfono</label>
                                <p>{currentUser?.phoneNumber || 'No especificado'}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Acciones Rápidas</h2>
                        <div className={styles.actions}>
                            <a href="/pedidos" className={styles.actionCard}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>Mis Pedidos</span>
                            </a>
                            <a href="/direcciones" className={styles.actionCard}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Direcciones</span>
                            </a>
                            <a href="/perfil/editar" className={styles.actionCard}>
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Editar Perfil</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
