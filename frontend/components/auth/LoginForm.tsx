'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Alert, Checkbox } from '@/components/core';
import { useAuth } from '@/lib/auth-context';
import styles from './LoginForm.module.css';

/**
 * Props para el componente LoginForm
 * @interface LoginFormProps
 */
export interface LoginFormProps {
    /** URL a la que redirigir tras login exitoso */
    redirectTo?: string;
    /** Callback al completar login */
    onSuccess?: () => void;
    /** Callback si hay error */
    onError?: (error: string) => void;
    /** Mostrar opción "Recordarme" */
    showRememberMe?: boolean;
    /** Mostrar enlace "Olvidé mi contraseña" */
    showForgotPassword?: boolean;
    /** Mostrar enlace de registro */
    showRegisterLink?: boolean;
    /** Título del formulario */
    title?: string;
    /** Subtítulo o descripción */
    subtitle?: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de email
 */
const EmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

/**
 * Icono de candado
 */
const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

/**
 * LoginForm - Formulario de inicio de sesión
 * 
 * Formulario completo para autenticación de usuarios con email y contraseña.
 * Incluye validación, manejo de errores y opciones adicionales.
 * 
 * @example
 * ```tsx
 * <LoginForm
 *   redirectTo="/cuenta"
 *   showRememberMe
 *   showForgotPassword
 *   showRegisterLink
 * />
 * ```
 */
export function LoginForm({
    redirectTo = '/cuenta',
    onSuccess,
    onError,
    showRememberMe = true,
    showForgotPassword = true,
    showRegisterLink = true,
    title = 'Iniciar sesión',
    subtitle = 'Accede a tu cuenta para gestionar tus pedidos',
    className,
}: LoginFormProps) {
    const router = useRouter();
    const { login } = useAuth();

    // Estado del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estado de validación y carga
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Validación del formulario
    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Introduce un email válido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler de envío
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            await login(email, password);
            onSuccess?.();
            router.push(redirectTo);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Error al iniciar sesión. Verifica tus credenciales.';
            setGeneralError(message);
            onError?.(message);
        } finally {
            setLoading(false);
        }
    };

    // Limpiar error al modificar campos
    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
        if (generalError) setGeneralError(null);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
        if (generalError) setGeneralError(null);
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Header */}
            <header className={styles.header}>
                {title && <h2 className={styles.title} id="login-form-title">{title}</h2>}
                {subtitle && <p className={styles.subtitle} id="login-form-desc">{subtitle}</p>}
            </header>

            {/* Error general - región live para lectores de pantalla */}
            <div aria-live="polite" aria-atomic="true">
                {generalError && (
                    <Alert type="error" role="alert">
                        {generalError}
                    </Alert>
                )}
            </div>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className={styles.form}
                aria-labelledby="login-form-title"
                aria-describedby="login-form-desc"
                noValidate
            >
                {/* Email */}
                <div className={styles.field}>
                    <Input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={e => handleEmailChange(e.target.value)}
                        error={errors.email}
                        placeholder="tu@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        icon={<EmailIcon />}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                </div>

                {/* Contraseña */}
                <div className={styles.field}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Contraseña"
                        value={password}
                        onChange={e => handlePasswordChange(e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        fullWidth
                        icon={<LockIcon />}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                </div>

                {/* Opciones adicionales */}
                {(showRememberMe || showForgotPassword) && (
                    <div className={styles.options}>
                        {showRememberMe && (
                            <Checkbox
                                checked={rememberMe}
                                onChange={e => setRememberMe(e.target.checked)}
                                label="Recordarme"
                            />
                        )}
                        {showForgotPassword && (
                            <Link href="/recuperar-password" className={styles.forgotLink}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                )}

                {/* Botón de envío */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                >
                    Iniciar sesión
                </Button>
            </form>

            {/* Enlace de registro */}
            {showRegisterLink && (
                <p className={styles.registerLink}>
                    ¿No tienes cuenta?{' '}
                    <Link href="/registro">Regístrate aquí</Link>
                </p>
            )}
        </div>
    );
}

export default LoginForm;