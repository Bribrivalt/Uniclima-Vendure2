'use client';

import React, { useState } from 'react';
import styles from './MaintenanceForm.module.css';

interface FormState {
    name: string;
    email: string;
    phone: string;
    brand: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}

export const MaintenanceForm = () => {
    const [state, setState] = useState<FormState>({
        name: '',
        email: '',
        phone: '',
        brand: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!state.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
            isValid = false;
        }

        if (!state.email.trim()) {
            newErrors.email = 'El email es obligatorio';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
            newErrors.email = 'El email no es válido';
            isValid = false;
        }

        if (!state.phone.trim()) {
            newErrors.phone = 'El teléfono es obligatorio';
            isValid = false;
        } else if (!/^\d{9,}$/.test(state.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Introduce un teléfono válido';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
        // Clean error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Simulator API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form data:', state);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className={styles.successMessage}>
                <h3 className={styles.successTitle}>¡Solicitud Recibida!</h3>
                <p className={styles.successText}>
                    Gracias por contactarnos, {state.name}. Un especialista se pondrá en contacto contigo pronto.
                </p>
                <div className={styles.actions}>
                    <button
                        onClick={() => window.location.href = '/'}
                        className={styles.secondaryButton}
                    >
                        Volver a la tienda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                    Nombre completo <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Tu nombre"
                    disabled={isSubmitting}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                    Email <span className={styles.required}>*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="ejemplo@correo.com"
                    disabled={isSubmitting}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            {/* Teléfono */}
            <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                    Teléfono <span className={styles.required}>*</span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={state.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="600 000 000"
                    disabled={isSubmitting}
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>

            {/* Marca/Modelo */}
            <div className={styles.formGroup}>
                <label htmlFor="brand" className={styles.label}>
                    Marca / Modelo (Opcional)
                </label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={state.brand}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ej: Daikin, Mitsubishi..."
                    disabled={isSubmitting}
                />
            </div>

            {/* Mensaje */}
            <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                    Mensaje (Opcional)
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={state.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Descríbenos qué necesitas..."
                    disabled={isSubmitting}
                />
            </div>

            {/* Botones */}
            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Información'}
                </button>
                <a href="tel:+34900000000" className={styles.secondaryButton}>
                    Llamar ahora
                </a>
            </div>
        </form>
    );
};
