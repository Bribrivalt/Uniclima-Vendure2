import styles from './page.module.css';

export const metadata = {
    title: 'Política de Privacidad | Uniclima',
    description: 'Política de privacidad de Uniclima - Cómo protegemos tus datos personales',
};

export default function PrivacidadPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Política de Privacidad</h1>
            <p className={styles.updated}>Última actualización: 1 de diciembre de 2024</p>

            <section className={styles.section}>
                <h2>1. Información que recopilamos</h2>
                <p>
                    En Uniclima recopilamos información que nos proporcionas directamente cuando:
                </p>
                <ul>
                    <li>Creas una cuenta en nuestra plataforma</li>
                    <li>Realizas una compra o solicitas un presupuesto</li>
                    <li>Te suscribes a nuestro boletín</li>
                    <li>Contactas con nuestro servicio de atención al cliente</li>
                </ul>
                <p>
                    Esta información puede incluir tu nombre, dirección de correo electrónico,
                    dirección postal, número de teléfono e información de pago.
                </p>
            </section>

            <section className={styles.section}>
                <h2>2. Uso de la información</h2>
                <p>Utilizamos la información recopilada para:</p>
                <ul>
                    <li>Procesar y gestionar tus pedidos</li>
                    <li>Enviarte confirmaciones de pedidos y actualizaciones de envío</li>
                    <li>Responder a tus consultas y solicitudes</li>
                    <li>Enviarte comunicaciones comerciales (si has dado tu consentimiento)</li>
                    <li>Mejorar nuestros productos y servicios</li>
                    <li>Cumplir con obligaciones legales</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>3. Compartición de datos</h2>
                <p>
                    No vendemos ni alquilamos tu información personal a terceros.
                    Compartimos tu información únicamente con:
                </p>
                <ul>
                    <li>Proveedores de servicios de pago para procesar transacciones</li>
                    <li>Empresas de logística para la entrega de pedidos</li>
                    <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                    <li>Autoridades cuando sea requerido por ley</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>4. Seguridad de los datos</h2>
                <p>
                    Implementamos medidas de seguridad técnicas y organizativas para proteger
                    tu información personal contra acceso no autorizado, pérdida o alteración.
                    Utilizamos cifrado SSL en todas las transmisiones de datos sensibles.
                </p>
            </section>

            <section className={styles.section}>
                <h2>5. Tus derechos</h2>
                <p>De acuerdo con el RGPD, tienes derecho a:</p>
                <ul>
                    <li>Acceder a tus datos personales</li>
                    <li>Rectificar datos inexactos</li>
                    <li>Solicitar la eliminación de tus datos</li>
                    <li>Oponerte al tratamiento de tus datos</li>
                    <li>Solicitar la portabilidad de tus datos</li>
                    <li>Retirar tu consentimiento en cualquier momento</li>
                </ul>
                <p>
                    Para ejercer estos derechos, contacta con nosotros en:
                    <a href="mailto:privacidad@uniclima.es">privacidad@uniclima.es</a>
                </p>
            </section>

            <section className={styles.section}>
                <h2>6. Cookies</h2>
                <p>
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia
                    en nuestra web. Puedes gestionar tus preferencias de cookies en cualquier
                    momento a través de la configuración de tu navegador o nuestro panel de cookies.
                </p>
            </section>

            <section className={styles.section}>
                <h2>7. Contacto</h2>
                <p>
                    Si tienes preguntas sobre esta política de privacidad o sobre cómo
                    tratamos tus datos, puedes contactarnos en:
                </p>
                <address className={styles.address}>
                    <strong>Uniclima S.L.</strong><br />
                    Dirección: Calle Example 123, 28001 Madrid<br />
                    Email: <a href="mailto:privacidad@uniclima.es">privacidad@uniclima.es</a><br />
                    Teléfono: +34 900 000 000
                </address>
            </section>
        </div>
    );
}