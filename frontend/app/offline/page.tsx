/**
 * Offline Page - Uniclima Solutions PWA
 *
 * Página que se muestra cuando el usuario no tiene conexión
 * y la página solicitada no está en caché.
 */
'use client';

import styles from './page.module.css';

export default function OfflinePage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Icono de sin conexión */}
                <div className={styles.iconWrapper}>
                    <svg
                        className={styles.icon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                        <line x1="12" y1="20" x2="12.01" y2="20" />
                    </svg>
                </div>

                {/* Mensaje */}
                <h1 className={styles.title}>Sin conexión a Internet</h1>
                <p className={styles.description}>
                    Parece que no tienes conexión a internet en este momento.
                    Algunas funciones de Uniclima pueden no estar disponibles.
                </p>

                {/* Sugerencias */}
                <div className={styles.suggestions}>
                    <h2 className={styles.suggestionsTitle}>¿Qué puedes hacer?</h2>
                    <ul className={styles.suggestionsList}>
                        <li>Verifica que tu WiFi o datos móviles estén activados</li>
                        <li>Comprueba la intensidad de tu señal</li>
                        <li>Intenta reiniciar tu router o dispositivo</li>
                        <li>Espera unos momentos y vuelve a intentar</li>
                    </ul>
                </div>

                {/* Botón de reintentar */}
                <button
                    className={styles.retryButton}
                    onClick={() => typeof window !== 'undefined' && window.location.reload()}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Reintentar conexión
                </button>

                {/* Info adicional */}
                <p className={styles.infoText}>
                    Las páginas que has visitado anteriormente pueden estar disponibles
                    desde la caché de tu navegador.
                </p>
            </div>
        </div>
    );
}