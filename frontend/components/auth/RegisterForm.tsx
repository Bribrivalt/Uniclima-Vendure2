'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Alert, Checkbox } from '@/components/core';
import { useAuth } from '@/lib/auth-context';
import styles from './RegisterForm.module.css';

/**
 * Props para el componente RegisterForm
 * @interface RegisterFormProps
 */
export interface RegisterFormProps {
    /** URL a la que redirigir tras registro exitoso */
    redirectTo?: string;
    /** Callback al completar registro */
    onSuccess?: () => void;
    /** Callback si hay error */
    onError?: (error: string) => void;
    /** Mostrar enlace de login */
    showLoginLink?: boolean;
    /** Requerir aceptación de términos */
    requireTerms?: boolean;
    /** Título del formulario */
    title?: string;
    /** Subtítulo o descripción */
    subtitle?: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Interfaz para los datos del formulario
 */
interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company?: string;
    phone?: string;
}

/**
 * Icono de usuario
 */
const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

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
 * RegisterForm - Formulario de registro de usuario
 * 
 * Formulario completo para crear nuevas cuentas de usuario.
 * Incluye validación de campos y aceptación de términos.
 * 
 * @example
 * ```tsx
 * <RegisterForm
 *   redirectTo="/cuenta"
 *   requireTerms
 *   showLoginLink
 * />
 * ```
 */
export function RegisterForm({
    redirectTo = '/cuenta',
    onSuccess,
    onError,
    showLoginLink = true,
    requireTerms = true,
    title = 'Crear cuenta',
    subtitle = 'Regístrate para acceder a todas las funcionalidades',
    className,
}: RegisterFormProps) {
    const router = useRouter();
    const { register } = useAuth();

    // Estado del formulario
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        phone: '',
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estado de validación y carga
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData | 'terms', string>>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Actualizar campo
    const handleChange = (field: keyof RegisterFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        if (generalError) setGeneralError(null);
    };

    // Validación del formulario
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof RegisterFormData | 'terms', string>> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Los apellidos son obligatorios';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Introduce un email válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Debe incluir mayúsculas, minúsculas y números';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (requireTerms && !acceptTerms) {
            newErrors.terms = 'Debes aceptar los términos y condiciones';
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
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.email,
                password: formData.password,
            });
            onSuccess?.();
            router.push(redirectTo);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Error al crear la cuenta. Inténtalo de nuevo.';
            setGeneralError(message);
            onError?.(message);
        } finally {
            setLoading(false);
        }
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

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
                {/* Nombre y Apellidos */}
                <div className={styles.row}>
                    <div className={styles.field}>
                        <Input
                            label="Nombre"
                            value={formData.firstName}
                            onChange={e => handleChange('firstName', e.target.value)}
                            error={errors.firstName}
                            placeholder="Juan"
                            autoComplete="given-name"
                            required
                            fullWidth
                            leftIcon={<UserIcon />}
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            label="Apellidos"
                            value={formData.lastName}
                            onChange={e => handleChange('lastName', e.target.value)}
                            error={errors.lastName}
                            placeholder="García López"
                            autoComplete="family-name"
                            required
                            fullWidth
                        />
                    </div>
                </div>

                {/* Email */}
                <div className={styles.field}>
                    <Input
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        error={errors.email}
                        placeholder="tu@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        leftIcon={<EmailIcon />}
                    />
                </div>

                {/* Empresa y Teléfono (opcionales) */}
                <div className={styles.row}>
                    <div className={styles.field}>
                        <Input
                            label="Empresa (opcional)"
                            value={formData.company}
                            onChange={e => handleChange('company', e.target.value)}
                            placeholder="Tu empresa"
                            autoComplete="organization"
                            fullWidth
                        />
                    </div>
                    <div className={styles.field}>
                        <Input
                            type="tel"
                            label="Teléfono (opcional)"
                            value={formData.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            placeholder="612 345 678"
                            autoComplete="tel"
                            fullWidth
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div className={styles.field}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Contraseña"
                        value={formData.password}
                        onChange={e => handleChange('password', e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        fullWidth
                        leftIcon={<LockIcon />}
                        helperText="Mínimo 8 caracteres con mayúsculas, minúsculas y números"
                        rightElement={
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        }
                    />
                </div>

                {/* Confirmar Contraseña */}
                <div className={styles.field}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Confirmar contraseña"
                        value={formData.confirmPassword}
                        onChange={e => handleChange('confirmPassword', e.target.value)}
                        error={errors.confirmPassword}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        fullWidth
                        leftIcon={<LockIcon />}
                    />
                </div>

                {/* Términos y condiciones */}
                {requireTerms && (
                    <div className={styles.terms}>
                        <Checkbox
                            checked={acceptTerms}
                            onChange={e => {
                                setAcceptTerms(e.target.checked);
                                if (errors.terms) {
                                    setErrors(prev => ({ ...prev, terms: undefined }));
                                }
                            }}
                            label={
                                <span className={styles.termsText}>
                                    Acepto los{' '}
                                    <Link href="/terminos" target="_blank">términos y condiciones</Link>
                                    {' '}y la{' '}
                                    <Link href="/privacidad" target="_blank">política de privacidad</Link>
                                </span>
                            }
                        />
                        {errors.terms && (
                            <span className={styles.termsError}>{errors.terms}</span>
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
                    Crear cuenta
                </Button>
            </form>

            {/* Enlace de login */}
            {showLoginLink && (
                <p className={styles.loginLink}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login">Inicia sesión</Link>
                </p>
            )}
        </div>
    );
}

export default RegisterForm;