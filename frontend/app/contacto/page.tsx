'use client';

import { useState } from 'react';
import { Alert } from '@/components/core';
import styles from './page.module.css';

/**
 * Metadata SEO para la página de contacto
 * NOTA: Como es un 'use client', la metadata se define en un archivo separado
 * Ver: frontend/app/contacto/metadata.ts
 */

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: 'general',
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
                asunto: 'general',
                mensaje: '',
            });
        } catch (err) {
            setError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroPattern} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Contacta con Nosotros</h1>
                    <p className={styles.heroSubtitle}>
                        ¿Tienes alguna pregunta sobre nuestros productos o servicios?
                        Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Form Section */}
                    <div className={styles.formSection}>
                        <h2 className={styles.formTitle}>Envíanos un mensaje</h2>
                        <p className={styles.formSubtitle}>
                            Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
                        </p>

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
                                    <label className={styles.label}>
                                        Nombre completo <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.nombre}
                                        onChange={(e) => handleChange('nombre', e.target.value)}
                                        required
                                        placeholder="Tu nombre completo"
                                    />
                                </div>

                                <div className={styles.rowGroup}>
                                    <div className={styles.row}>
                                        <label className={styles.label}>
                                            Email <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className={styles.input}
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            required
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    <div className={styles.row}>
                                        <label className={styles.label}>Teléfono</label>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            value={formData.telefono}
                                            onChange={(e) => handleChange('telefono', e.target.value)}
                                            placeholder="612 345 678"
                                        />
                                    </div>
                                </div>

                                <div className={styles.row}>
                                    <label className={styles.label}>
                                        Asunto <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        className={styles.select}
                                        value={formData.asunto}
                                        onChange={(e) => handleChange('asunto', e.target.value)}
                                        required
                                    >
                                        <option value="general">Consulta general</option>
                                        <option value="productos">Información sobre productos</option>
                                        <option value="pedidos">Estado de pedido</option>
                                        <option value="devoluciones">Devoluciones y garantías</option>
                                        <option value="servicios">Servicios técnicos</option>
                                        <option value="otros">Otros</option>
                                    </select>
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

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 2L11 13" />
                                                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                            </svg>
                                            Enviar mensaje
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info Section */}
                    <aside className={styles.infoSection}>
                        {/* Contact Info Card */}
                        <div className={styles.infoCard}>
                            <h3 className={styles.infoTitle}>Información de contacto</h3>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Dirección</span>
                                    <p className={styles.infoValue}>
                                        Calle de la Climatización 123<br />
                                        28001 Madrid, España
                                    </p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Teléfono</span>
                                    <p className={styles.infoValue}>
                                        <a href="tel:+34911177777" className={styles.infoLink}>91 117 77 77</a>
                                    </p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Email</span>
                                    <p className={styles.infoValue}>
                                        <a href="mailto:info@uniclimasolutions.com" className={styles.infoLink}>info@uniclimasolutions.com</a>
                                    </p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Horario</span>
                                    <p className={styles.infoValue}>
                                        Lunes a Viernes: 9:00 - 18:00<br />
                                        Sábados: 9:00 - 14:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Contact Card */}
                        <div className={styles.quickCard}>
                            <h3 className={styles.quickTitle}>¿Necesitas ayuda urgente?</h3>
                            <p className={styles.quickText}>
                                Contáctanos por WhatsApp para una respuesta inmediata
                            </p>
                            <a
                                href="https://wa.me/34911177777"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.quickButton}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Contactar por WhatsApp
                            </a>
                        </div>
                    </aside>
                </div>

                {/* Map Section */}
                <section className={styles.mapSection}>
                    <h2 className={styles.mapTitle}>Encuéntranos</h2>
                    <div className={styles.mapWrapper}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6127924695935!2d-3.7037902!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d66c15d8d%3A0x5d0c9f7f11a67f9a!2sMadrid%2C%20Spain!5e0!3m2!1sen!2sus!4v1628000000000!5m2!1sen!2sus"
                            title="Ubicación de Uniclima Solutions"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </section>
            </div>
        </>
    );
}