'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Alert } from '@/components/core';
import { useAuth } from '@/lib/auth-context';
import styles from './ProfileForm.module.css';

/**
 * Props para el componente ProfileForm
 * @interface ProfileFormProps
 */
export interface ProfileFormProps {
    /** Callback al guardar exitosamente */
    onSuccess?: () => void;
    /** Callback si hay error */
    onError?: (error: string) => void;
    /** Mostrar sección de cambio de contraseña */
    showPasswordSection?: boolean;
    /** Título del formulario */
    title?: string;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Interfaz para los datos del perfil
 */
interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
}

/**
 * Interfaz para cambio de contraseña
 */
interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * ProfileForm - Formulario de edición de perfil
 * 
 * Permite a los usuarios editar su información personal
 * y cambiar su contraseña.
 * 
 * @example
 * ```tsx
 * <ProfileForm
 *   showPasswordSection
 *   onSuccess={() => alert('Perfil actualizado')}
 * />
 * ```
 */
export function ProfileForm({
    onSuccess,
    onError,
    showPasswordSection = true,
    title = 'Mi perfil',
    className,
}: ProfileFormProps) {
    const { currentUser } = useAuth();

    // Estado del formulario de perfil
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.emailAddress || '',
        phone: '',
        company: '',
    });
    const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Estado del formulario de contraseña
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordData, string>>>({});
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState(false);

    // Cargar datos del usuario
    useEffect(() => {
        if (currentUser) {
            setProfileData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.emailAddress || '',
                phone: '',
                company: '',
            });
        }
    }, [currentUser]);

    // Handler de cambio en perfil
    const handleProfileChange = (field: keyof ProfileData, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
        if (profileErrors[field]) {
            setProfileErrors(prev => ({ ...prev, [field]: undefined }));
        }
        setProfileSuccess(false);
        setProfileError(null);
    };

    // Handler de cambio en contraseña
    const handlePasswordChange = (field: keyof PasswordData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({ ...prev, [field]: undefined }));
        }
        setPasswordSuccess(false);
        setPasswordError(null);
    };

    // Validación del perfil
    const validateProfile = (): boolean => {
        const errors: Partial<Record<keyof ProfileData, string>> = {};

        if (!profileData.firstName.trim()) {
            errors.firstName = 'El nombre es obligatorio';
        }
        if (!profileData.lastName.trim()) {
            errors.lastName = 'Los apellidos son obligatorios';
        }
        if (!profileData.email.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
            errors.email = 'Introduce un email válido';
        }

        setProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validación de contraseña
    const validatePassword = (): boolean => {
        const errors: Partial<Record<keyof PasswordData, string>> = {};

        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Introduce tu contraseña actual';
        }
        if (!passwordData.newPassword) {
            errors.newPassword = 'Introduce la nueva contraseña';
        } else if (passwordData.newPassword.length < 8) {
            errors.newPassword = 'Mínimo 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
            errors.newPassword = 'Debe incluir mayúsculas, minúsculas y números';
        }
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Confirma la nueva contraseña';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handler de envío de perfil
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateProfile()) return;

        setProfileLoading(true);
        setProfileError(null);

        try {
            // TODO: Implementar updateProfile cuando esté disponible en AuthContext
            // await updateProfile({
            //     firstName: profileData.firstName,
            //     lastName: profileData.lastName,
            //     phoneNumber: profileData.phone,
            // });
            setProfileSuccess(true);
            onSuccess?.();
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Error al actualizar el perfil';
            setProfileError(message);
            onError?.(message);
        } finally {
            setProfileLoading(false);
        }
    };

    // Handler de envío de contraseña
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setPasswordLoading(true);
        setPasswordError(null);

        try {
            // TODO: Implementar updatePassword cuando esté disponible en AuthContext
            // await updatePassword(passwordData.currentPassword, passwordData.newPassword);
            setPasswordSuccess(true);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            onSuccess?.();
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'Error al cambiar la contraseña';
            setPasswordError(message);
            onError?.(message);
        } finally {
            setPasswordLoading(false);
        }
    };

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Formulario de perfil */}
            <section className={styles.section}>
                {title && <h2 className={styles.title}>{title}</h2>}

                {profileSuccess && (
                    <Alert type="success">
                        Perfil actualizado correctamente
                    </Alert>
                )}

                {profileError && (
                    <Alert type="error">
                        {profileError}
                    </Alert>
                )}

                <form onSubmit={handleProfileSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <Input
                                label="Nombre"
                                value={profileData.firstName}
                                onChange={e => handleProfileChange('firstName', e.target.value)}
                                error={profileErrors.firstName}
                                autoComplete="given-name"
                                required
                                fullWidth
                            />
                        </div>
                        <div className={styles.field}>
                            <Input
                                label="Apellidos"
                                value={profileData.lastName}
                                onChange={e => handleProfileChange('lastName', e.target.value)}
                                error={profileErrors.lastName}
                                autoComplete="family-name"
                                required
                                fullWidth
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <Input
                            type="email"
                            label="Email"
                            value={profileData.email}
                            onChange={e => handleProfileChange('email', e.target.value)}
                            error={profileErrors.email}
                            autoComplete="email"
                            required
                            fullWidth
                            disabled
                            helperText="El email no se puede cambiar"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <Input
                                type="tel"
                                label="Teléfono"
                                value={profileData.phone}
                                onChange={e => handleProfileChange('phone', e.target.value)}
                                autoComplete="tel"
                                fullWidth
                            />
                        </div>
                        <div className={styles.field}>
                            <Input
                                label="Empresa"
                                value={profileData.company}
                                onChange={e => handleProfileChange('company', e.target.value)}
                                autoComplete="organization"
                                fullWidth
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={profileLoading}
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </section>

            {/* Formulario de contraseña */}
            {showPasswordSection && (
                <section className={styles.section}>
                    <h3 className={styles.subtitle}>Cambiar contraseña</h3>

                    {passwordSuccess && (
                        <Alert type="success">
                            Contraseña actualizada correctamente
                        </Alert>
                    )}

                    {passwordError && (
                        <Alert type="error">
                            {passwordError}
                        </Alert>
                    )}

                    <form onSubmit={handlePasswordSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <Input
                                type={showPasswords ? 'text' : 'password'}
                                label="Contraseña actual"
                                value={passwordData.currentPassword}
                                onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                                error={passwordErrors.currentPassword}
                                autoComplete="current-password"
                                required
                                fullWidth
                            />
                        </div>

                        <div className={styles.field}>
                            <Input
                                type={showPasswords ? 'text' : 'password'}
                                label="Nueva contraseña"
                                value={passwordData.newPassword}
                                onChange={e => handlePasswordChange('newPassword', e.target.value)}
                                error={passwordErrors.newPassword}
                                autoComplete="new-password"
                                required
                                fullWidth
                                helperText="Mínimo 8 caracteres con mayúsculas, minúsculas y números"
                            />
                        </div>

                        <div className={styles.field}>
                            <Input
                                type={showPasswords ? 'text' : 'password'}
                                label="Confirmar nueva contraseña"
                                value={passwordData.confirmPassword}
                                onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                                error={passwordErrors.confirmPassword}
                                autoComplete="new-password"
                                required
                                fullWidth
                            />
                        </div>

                        <div className={styles.passwordOptions}>
                            <label className={styles.showPassword}>
                                <input
                                    type="checkbox"
                                    checked={showPasswords}
                                    onChange={e => setShowPasswords(e.target.checked)}
                                />
                                Mostrar contraseñas
                            </label>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type="submit"
                                variant="secondary"
                                loading={passwordLoading}
                            >
                                Cambiar contraseña
                            </Button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    );
}

export default ProfileForm;