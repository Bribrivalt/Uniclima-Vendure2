'use client';

import { useState } from 'react';
import { Button } from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import styles from './QuoteModal.module.css';

export interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    productSlug: string;
}

export interface QuoteFormData {
    nombre: string;
    email: string;
    telefono: string;
    comentario: string;
}

/**
 * QuoteModal - Modal para solicitar presupuesto de un producto
 */
export function QuoteModal({
    isOpen,
    onClose,
    productId,
    productName,
    productSlug,
}: QuoteModalProps) {
    const [formData, setFormData] = useState<QuoteFormData>({
        nombre: '',
        email: '',
        telefono: '',
        comentario: '',
    });
    const [errors, setErrors] = useState<Partial<QuoteFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const updateField = (field: keyof QuoteFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<QuoteFormData> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // TODO: Llamar a endpoint /api/presupuesto
            const response = await fetch('/api/presupuesto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    productName,
                    productSlug,
                    ...formData,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({
                        nombre: '',
                        email: '',
                        telefono: '',
                        comentario: '',
                    });
                }, 2000);
            } else {
                alert('Error al enviar la solicitud. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al enviar presupuesto:', error);
            alert('Error de conexión. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Solicitar Presupuesto</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.productInfo}>
                    <p className={styles.productLabel}>Producto:</p>
                    <p className={styles.productName}>{productName}</p>
                </div>

                {success ? (
                    <div className={styles.successMessage}>
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3>¡Solicitud enviada!</h3>
                        <p>Nos pondremos en contacto contigo pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            type="text"
                            label="Nombre completo"
                            placeholder="Juan Pérez"
                            value={formData.nombre}
                            onChange={(e) => updateField('nombre', e.target.value)}
                            error={errors.nombre}
                            required
                            fullWidth
                            disabled={isSubmitting}
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            error={errors.email}
                            required
                            fullWidth
                            disabled={isSubmitting}
                        />

                        <Input
                            type="tel"
                            label="Teléfono"
                            placeholder="+34 600 000 000"
                            value={formData.telefono}
                            onChange={(e) => updateField('telefono', e.target.value)}
                            error={errors.telefono}
                            required
                            fullWidth
                            disabled={isSubmitting}
                        />

                        <div className={styles.textareaWrapper}>
                            <label htmlFor="comentario">
                                Comentario (opcional)
                            </label>
                            <textarea
                                id="comentario"
                                placeholder="Cuéntanos más sobre lo que necesitas..."
                                value={formData.comentario}
                                onChange={(e) => updateField('comentario', e.target.value)}
                                rows={4}
                                disabled={isSubmitting}
                                className={styles.textarea}
                            />
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Enviar Solicitud
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
