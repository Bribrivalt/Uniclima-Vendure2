'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Button, Alert } from '@/components/core';
import styles from './ForgotPasswordForm.module.css';

/**
 * Props para el componente ForgotPasswordForm
 * @interface ForgotPasswordFormProps
 */
export interface ForgotPasswordFormProps {
    /** Callback al enviar solicitud exitosamente */
    onSuccess?: (email: string) => void;
    /** Callback si hay error */
    onError?: (error: string) => void;
    /** Mostrar enlace de login */
    showLoginLink?: boolean;
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
 * Icono de check/éxito
 */
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
);

/**
 * ForgotPasswordForm - Formulario de recuperación de contraseña
 * 
 * Permite a los usuarios solicitar un enlace para restablecer
 * su contraseña mediante su email.
 * 
 * @example
 * ```tsx
 * <ForgotPasswordForm
 *   onSuccess={(email) => console.log('Email sent to:', email)}
 *   showLoginLink
 * />
 * ```
 */
export function ForgotPasswordForm({
    onSuccess,
    onError,
    showLoginLink = true,
    title = 'Recuperar contraseña',
    subtitle = 'Introduce tu email y te enviaremos un enlace para restablecer tu contraseña',
    className,
}: ForgotPasswordFormProps) {
    // Estado del formulario
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Validación del email
    const validateEmail = (value: string): boolean => {
        if (!value.trim()) {
            setEmailError('El email es obligatorio');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Introduce un email válido');
            return false;
        }
        return true;
    };

    // Handler de cambio de email
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) setEmailError(null);
        if (generalError) setGeneralError(null);
    };

    // Handler de envío
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError(null);

        if (!validateEmail(email)) return;

        setLoading(true);

        try {
            // TODO: Integrar con mutation de Vendure para resetPassword
            // Por ahora simulamos el envío
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular éxito
            setSuccess(true);
            onSuccess?.(email);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Error al enviar el email. Inténtalo de nuevo.';
            setGeneralError(message);
            onError?.(message);
        } finally {
            setLoading(false);
        }
    };

    // Handler para reintentar
    const handleRetry = () => {
        setSuccess(false);
        setEmail('');
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    // Vista de éxito
    if (success) {
        return (
            <div className={containerClasses}>
                <div className={styles.successContainer}>
                    <div className={styles.successIcon}>
                        <CheckIcon />
                    </div>
                    <h2 className={styles.successTitle}>¡Email enviado!</h2>
                    <p className={styles.successText}>
                        Hemos enviado un enlace de recuperación a{' '}
                        <strong>{email}</strong>
                    </p>
                    <p className={styles.successNote}>
                        Si no recibes el email en unos minutos, revisa tu carpeta de spam.
                    </p>
                    <div className={styles.successActions}>
                        <Button
                            variant="outline"
                            onClick={handleRetry}
                        >
                            Usar otro email
                        </Button>
                        {showLoginLink && (
                            <Link href="/login" className={styles.backLink}>
                                Volver a inicio de sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            {/* Error general */}
            {generalError && (
                <Alert type="error">
                    {generalError}
                </Alert>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Email */}
                <div className={styles.field}>
                    <Input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError ?? undefined}
                        placeholder="tu@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        leftIcon={<EmailIcon />}
                    />
                </div>

                {/* Botón de envío */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                >
                    Enviar enlace de recuperación
                </Button>
            </form>

            {/* Enlace de login */}
            {showLoginLink && (
                <p className={styles.loginLink}>
                    ¿Recordaste tu contraseña?{' '}
                    <Link href="/login">Inicia sesión</Link>
                </p>
            )}
        </div>
    );
}

export default ForgotPasswordForm;