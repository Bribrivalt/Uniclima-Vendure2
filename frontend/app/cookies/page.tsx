import styles from '../privacidad/page.module.css';

export const metadata = {
    title: 'Política de Cookies | Uniclima',
    description: 'Política de cookies de Uniclima - Información sobre las cookies que utilizamos',
};

export default function CookiesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Política de Cookies</h1>
            <p className={styles.updated}>Última actualización: 1 de diciembre de 2024</p>

            <section className={styles.section}>
                <h2>1. ¿Qué son las cookies?</h2>
                <p>
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
                    cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y
                    preferencias durante un período de tiempo, para que no tengas que volver a
                    introducirlos cada vez que vuelvas al sitio o navegues de una página a otra.
                </p>
            </section>

            <section className={styles.section}>
                <h2>2. Tipos de cookies que utilizamos</h2>

                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    Cookies estrictamente necesarias
                </h3>
                <p>
                    Son esenciales para el funcionamiento del sitio web. Sin ellas, no podrías
                    navegar por el sitio ni utilizar sus funciones básicas como el carrito de compra.
                </p>
                <ul>
                    <li><strong>session_id:</strong> Mantiene tu sesión activa durante la navegación</li>
                    <li><strong>cart_token:</strong> Guarda los productos de tu carrito</li>
                    <li><strong>csrf_token:</strong> Protección contra ataques de falsificación</li>
                </ul>

                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    Cookies de preferencias
                </h3>
                <p>
                    Permiten que el sitio recuerde tus preferencias y opciones para ofrecerte
                    una experiencia más personalizada.
                </p>
                <ul>
                    <li><strong>language:</strong> Guarda tu preferencia de idioma</li>
                    <li><strong>currency:</strong> Guarda tu preferencia de moneda</li>
                    <li><strong>cookie_consent:</strong> Guarda tu preferencia de cookies</li>
                </ul>

                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    Cookies analíticas
                </h3>
                <p>
                    Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web,
                    permitiéndonos mejorar su funcionamiento y contenido.
                </p>
                <ul>
                    <li><strong>_ga:</strong> Google Analytics - distingue usuarios únicos</li>
                    <li><strong>_gid:</strong> Google Analytics - distingue usuarios</li>
                    <li><strong>_gat:</strong> Google Analytics - limita la tasa de peticiones</li>
                </ul>

                <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    Cookies de marketing
                </h3>
                <p>
                    Se utilizan para mostrar anuncios relevantes y medir la efectividad de
                    nuestras campañas publicitarias.
                </p>
                <ul>
                    <li><strong>_fbp:</strong> Facebook Pixel - seguimiento de conversiones</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>3. Duración de las cookies</h2>
                <p>
                    Las cookies pueden ser de sesión o persistentes:
                </p>
                <ul>
                    <li>
                        <strong>Cookies de sesión:</strong> Se eliminan automáticamente cuando
                        cierras el navegador.
                    </li>
                    <li>
                        <strong>Cookies persistentes:</strong> Permanecen en tu dispositivo
                        durante un período determinado o hasta que las elimines manualmente.
                    </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>4. Gestión de cookies</h2>
                <p>
                    Puedes gestionar tus preferencias de cookies de varias maneras:
                </p>
                <ul>
                    <li>
                        <strong>Panel de cookies:</strong> Utiliza nuestro panel de configuración
                        de cookies que aparece cuando visitas el sitio por primera vez.
                    </li>
                    <li>
                        <strong>Configuración del navegador:</strong> La mayoría de navegadores
                        te permiten rechazar todas las cookies, aceptar solo algunas o eliminar
                        las cookies que ya se han instalado.
                    </li>
                </ul>
                <p>
                    Ten en cuenta que si rechazas las cookies necesarias, es posible que algunas
                    funciones del sitio web no funcionen correctamente.
                </p>
            </section>

            <section className={styles.section}>
                <h2>5. Cómo gestionar cookies en tu navegador</h2>
                <ul>
                    <li>
                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                            Google Chrome
                        </a>
                    </li>
                    <li>
                        <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                            Mozilla Firefox
                        </a>
                    </li>
                    <li>
                        <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                            Safari
                        </a>
                    </li>
                    <li>
                        <a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">
                            Microsoft Edge
                        </a>
                    </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>6. Actualizaciones de esta política</h2>
                <p>
                    Podemos actualizar esta política de cookies periódicamente para reflejar
                    cambios en las cookies que utilizamos o por otros motivos operativos,
                    legales o regulatorios. Te recomendamos visitar esta página regularmente
                    para estar informado sobre el uso de cookies.
                </p>
            </section>

            <section className={styles.section}>
                <h2>7. Contacto</h2>
                <p>
                    Si tienes preguntas sobre nuestra política de cookies:
                </p>
                <address className={styles.address}>
                    <strong>Uniclima S.L.</strong><br />
                    Email: <a href="mailto:privacidad@uniclima.es">privacidad@uniclima.es</a><br />
                    Teléfono: +34 900 000 000
                </address>
            </section>
        </div>
    );
}