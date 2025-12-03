'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import styles from './CookieBanner.module.css';

/**
 * Tipos de cookies que el usuario puede gestionar
 */
export interface CookiePreferences {
    /** Cookies necesarias para el funcionamiento del sitio (siempre activas) */
    necessary: boolean;
    /** Cookies de análisis y estadísticas */
    analytics: boolean;
    /** Cookies de marketing y publicidad */
    marketing: boolean;
    /** Cookies de preferencias del usuario */
    preferences: boolean;
}

/**
 * Props del componente CookieBanner
 */
export interface CookieBannerProps {
    /** Nombre de la cookie para almacenar el consentimiento */
    cookieName?: string;
    /** Días de expiración de la cookie de consentimiento */
    expirationDays?: number;
    /** Callback cuando el usuario acepta todas las cookies */
    onAcceptAll?: (preferences: CookiePreferences) => void;
    /** Callback cuando el usuario rechaza cookies opcionales */
    onRejectAll?: (preferences: CookiePreferences) => void;
    /** Callback cuando el usuario guarda preferencias personalizadas */
    onSavePreferences?: (preferences: CookiePreferences) => void;
    /** Enlace a la política de cookies */
    cookiePolicyUrl?: string;
    /** Clases CSS adicionales */
    className?: string;
}

/**
 * Preferencias de cookies por defecto (solo necesarias)
 */
const DEFAULT_PREFERENCES: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
};

/**
 * Preferencias con todas las cookies aceptadas
 */
const ALL_ACCEPTED: CookiePreferences = {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
};

/**
 * CookieBanner - Componente de banner de consentimiento de cookies (GDPR)
 * 
 * Muestra un banner para que el usuario gestione sus preferencias de cookies
 * según la normativa GDPR/LOPD.
 * 
 * @example
 * ```tsx
 * <CookieBanner
 *   cookiePolicyUrl="/cookies"
 *   onAcceptAll={(prefs) => console.log('Accepted:', prefs)}
 * />
 * ```
 */
export const CookieBanner: React.FC<CookieBannerProps> = ({
    cookieName = 'uniclima_cookie_consent',
    expirationDays = 365,
    onAcceptAll,
    onRejectAll,
    onSavePreferences,
    cookiePolicyUrl = '/cookies',
    className,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

    /**
     * Lee el consentimiento almacenado en cookies
     */
    const getStoredConsent = useCallback((): CookiePreferences | null => {
        if (typeof window === 'undefined') return null;

        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`));

        if (cookie) {
            try {
                return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
            } catch {
                return null;
            }
        }
        return null;
    }, [cookieName]);

    /**
     * Guarda el consentimiento en una cookie
     */
    const saveConsent = useCallback((prefs: CookiePreferences) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);

        document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(prefs))}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
    }, [cookieName, expirationDays]);

    /**
     * Comprueba si el usuario ya ha dado su consentimiento
     */
    useEffect(() => {
        const storedConsent = getStoredConsent();
        if (storedConsent) {
            setPreferences(storedConsent);
            setIsVisible(false);
        } else {
            // Pequeño delay para evitar flash en el SSR
            const timer = setTimeout(() => setIsVisible(true), 500);
            return () => clearTimeout(timer);
        }
    }, [getStoredConsent]);

    /**
     * Acepta todas las cookies
     */
    const handleAcceptAll = () => {
        saveConsent(ALL_ACCEPTED);
        setPreferences(ALL_ACCEPTED);
        setIsVisible(false);
        onAcceptAll?.(ALL_ACCEPTED);
    };

    /**
     * Rechaza todas las cookies opcionales
     */
    const handleRejectAll = () => {
        saveConsent(DEFAULT_PREFERENCES);
        setPreferences(DEFAULT_PREFERENCES);
        setIsVisible(false);
        onRejectAll?.(DEFAULT_PREFERENCES);
    };

    /**
     * Guarda las preferencias personalizadas
     */
    const handleSavePreferences = () => {
        saveConsent(preferences);
        setIsVisible(false);
        setShowSettings(false);
        onSavePreferences?.(preferences);
    };

    /**
     * Cambia una preferencia individual
     */
    const handleTogglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Las necesarias siempre están activas

        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // No renderizar si no es visible
    if (!isVisible) return null;

    return (
        <div
            className={`${styles.banner} ${className || ''}`}
            role="dialog"
            aria-labelledby="cookie-banner-title"
            aria-describedby="cookie-banner-description"
        >
            <div className={styles.container}>
                {!showSettings ? (
                    /* Vista principal del banner */
                    <>
                        <div className={styles.content}>
                            <h2 id="cookie-banner-title" className={styles.title}>
                                🍪 Usamos cookies
                            </h2>
                            <p id="cookie-banner-description" className={styles.description}>
                                Utilizamos cookies propias y de terceros para mejorar tu experiencia,
                                analizar el tráfico y mostrarte contenido personalizado.
                                Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias.
                            </p>
                            <a
                                href={cookiePolicyUrl}
                                className={styles.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Más información sobre nuestra política de cookies
                            </a>
                        </div>
                        <div className={styles.actions}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSettings(true)}
                                className={styles.settingsButton}
                            >
                                Configurar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRejectAll}
                                className={styles.rejectButton}
                            >
                                Rechazar
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleAcceptAll}
                                className={styles.acceptButton}
                            >
                                Aceptar todas
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Vista de configuración de cookies */
                    <>
                        <div className={styles.content}>
                            <h2 id="cookie-banner-title" className={styles.title}>
                                ⚙️ Configurar cookies
                            </h2>
                            <p id="cookie-banner-description" className={styles.description}>
                                Selecciona qué tipos de cookies deseas aceptar:
                            </p>

                            <div className={styles.cookieTypes}>
                                {/* Cookies necesarias */}
                                <div className={styles.cookieType}>
                                    <div className={styles.cookieInfo}>
                                        <label className={styles.cookieLabel}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.necessary}
                                                disabled
                                                className={styles.checkbox}
                                            />
                                            <span className={styles.cookieName}>Cookies necesarias</span>
                                        </label>
                                        <span className={styles.required}>(Obligatorias)</span>
                                    </div>
                                    <p className={styles.cookieDescription}>
                                        Esenciales para el funcionamiento del sitio. Incluyen sesión,
                                        carrito de compra y seguridad.
                                    </p>
                                </div>

                                {/* Cookies de análisis */}
                                <div className={styles.cookieType}>
                                    <div className={styles.cookieInfo}>
                                        <label className={styles.cookieLabel}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.analytics}
                                                onChange={() => handleTogglePreference('analytics')}
                                                className={styles.checkbox}
                                            />
                                            <span className={styles.cookieName}>Cookies de análisis</span>
                                        </label>
                                    </div>
                                    <p className={styles.cookieDescription}>
                                        Nos ayudan a entender cómo usas el sitio para mejorarlo.
                                        Incluyen Google Analytics.
                                    </p>
                                </div>

                                {/* Cookies de marketing */}
                                <div className={styles.cookieType}>
                                    <div className={styles.cookieInfo}>
                                        <label className={styles.cookieLabel}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.marketing}
                                                onChange={() => handleTogglePreference('marketing')}
                                                className={styles.checkbox}
                                            />
                                            <span className={styles.cookieName}>Cookies de marketing</span>
                                        </label>
                                    </div>
                                    <p className={styles.cookieDescription}>
                                        Permiten mostrarte anuncios relevantes basados en tus intereses.
                                    </p>
                                </div>

                                {/* Cookies de preferencias */}
                                <div className={styles.cookieType}>
                                    <div className={styles.cookieInfo}>
                                        <label className={styles.cookieLabel}>
                                            <input
                                                type="checkbox"
                                                checked={preferences.preferences}
                                                onChange={() => handleTogglePreference('preferences')}
                                                className={styles.checkbox}
                                            />
                                            <span className={styles.cookieName}>Cookies de preferencias</span>
                                        </label>
                                    </div>
                                    <p className={styles.cookieDescription}>
                                        Recuerdan tus preferencias como idioma, región o tema visual.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSettings(false)}
                                className={styles.backButton}
                            >
                                ← Volver
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSavePreferences}
                                className={styles.saveButton}
                            >
                                Guardar preferencias
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CookieBanner;