'use client';

import { useState } from 'react';
import { Input, Button, Alert } from '@/components/core';
import styles from './page.module.css';

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simular envío del formulario
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSuccess(true);
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                asunto: '',
                mensaje: '',
            });
        } catch (err) {
            setError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Contacto</h1>
                <p className={styles.subtitle}>
                    ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
                </p>
            </div>

            <div className={styles.content}>
                <div className={styles.formSection}>
                    {success ? (
                        <Alert type="success">
                            ¡Mensaje enviado correctamente! Nos pondremos en contacto contigo lo antes posible.
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && (
                                <Alert type="error" dismissible onClose={() => setError(null)}>
                                    {error}
                                </Alert>
                            )}

                            <div className={styles.row}>
                                <Input
                                    label="Nombre completo"
                                    value={formData.nombre}
                                    onChange={(e) => handleChange('nombre', e.target.value)}
                                    required
                                    fullWidth
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className={styles.rowGroup}>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    fullWidth
                                    placeholder="tu@email.com"
                                />
                                <Input
                                    label="Teléfono (opcional)"
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => handleChange('telefono', e.target.value)}
                                    fullWidth
                                    placeholder="612 345 678"
                                />
                            </div>

                            <div className={styles.row}>
                                <Input
                                    label="Asunto"
                                    value={formData.asunto}
                                    onChange={(e) => handleChange('asunto', e.target.value)}
                                    required
                                    fullWidth
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>
                                    Mensaje <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    className={styles.textarea}
                                    value={formData.mensaje}
                                    onChange={(e) => handleChange('mensaje', e.target.value)}
                                    required
                                    rows={5}
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={loading}
                                fullWidth
                            >
                                Enviar mensaje
                            </Button>
                        </form>
                    )}
                </div>

                <aside className={styles.infoSection}>
                    <div className={styles.infoCard}>
                        <h3>Información de contacto</h3>

                        <div className={styles.infoItem}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <strong>Dirección</strong>
                                <p>Calle Example 123<br />28001 Madrid, España</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                                <strong>Teléfono</strong>
                                <p>+34 900 000 000</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <strong>Email</strong>
                                <p>info@uniclima.es</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <strong>Horario</strong>
                                <p>Lunes a Viernes: 9:00 - 18:00<br />Sábados: 9:00 - 14:00</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}