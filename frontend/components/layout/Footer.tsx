/**
 * Footer Component - Uniclima Solutions
 * 
 * Pie de página profesional con:
 * - Logo y descripción de empresa
 * - Enlaces de navegación organizados
 * - Información de contacto
 * - Redes sociales
 * - Enlaces legales
 * 
 * Estilo inspirado en uniclimasolutions.com
 * 
 * @author Frontend Team
 * @version 2.0.0
 */

import Link from 'next/link';
import styles from './Footer.module.css';

/**
 * Icono del logo Uniclima
 */
const UniclimLogoIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

/**
 * Icono de ubicación
 */
const MapPinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

/**
 * Icono de teléfono
 */
const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

/**
 * Icono de email
 */
const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

/**
 * Icono de Facebook
 */
const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

/**
 * Icono de Instagram
 */
const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

/**
 * Icono de LinkedIn
 */
const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

/**
 * Icono de WhatsApp
 */
const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer} role="contentinfo">
            {/* Sección principal */}
            <div className={styles.footerMain}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Columna de marca */}
                        <div className={styles.brandColumn}>
                            <Link href="/" className={styles.brandLogo} aria-label="Uniclima Solutions - Ir a inicio">
                                <div className={styles.logoIcon} aria-hidden="true">
                                    <UniclimLogoIcon />
                                </div>
                                <div className={styles.logoText}>
                                    <span className={styles.logoName}>UNICLIMA</span>
                                    <span className={styles.logoTagline}>SOLUTIONS</span>
                                </div>
                            </Link>

                            <p className={styles.brandDescription}>
                                Especialistas en climatización profesional. Instalación, mantenimiento y
                                reparación de sistemas de calefacción, aire acondicionado y aerotermia
                                con las mejores marcas del mercado.
                            </p>

                            <nav className={styles.socialLinks} aria-label="Redes sociales">
                                <a
                                    href="https://facebook.com/uniclima"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Síguenos en Facebook (abre en nueva ventana)"
                                >
                                    <FacebookIcon aria-hidden="true" />
                                </a>
                                <a
                                    href="https://instagram.com/uniclima"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Síguenos en Instagram (abre en nueva ventana)"
                                >
                                    <InstagramIcon aria-hidden="true" />
                                </a>
                                <a
                                    href="https://linkedin.com/company/uniclima"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Síguenos en LinkedIn (abre en nueva ventana)"
                                >
                                    <LinkedInIcon aria-hidden="true" />
                                </a>
                                <a
                                    href="https://wa.me/34911177777"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label="Contáctanos por WhatsApp (abre en nueva ventana)"
                                >
                                    <WhatsAppIcon aria-hidden="true" />
                                </a>
                            </nav>
                        </div>

                        {/* Enlaces rápidos */}
                        <nav className={styles.column} aria-labelledby="footer-nav-empresa">
                            <h3 className={styles.columnTitle} id="footer-nav-empresa">Empresa</h3>
                            <ul className={styles.linkList} role="list">
                                <li className={styles.linkItem}>
                                    <Link href="/conocenos" className={styles.link}>Sobre Nosotros</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/servicios" className={styles.link}>Servicios</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/blog" className={styles.link}>Blog</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/contacto" className={styles.link}>Contacto</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/faq" className={styles.link}>Preguntas Frecuentes</Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Servicios */}
                        <nav className={styles.column} aria-labelledby="footer-nav-servicios">
                            <h3 className={styles.columnTitle} id="footer-nav-servicios">Servicios</h3>
                            <ul className={styles.linkList} role="list">
                                <li className={styles.linkItem}>
                                    <Link href="/servicios#instalacion" className={styles.link}>Instalación</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/servicios#mantenimiento" className={styles.link}>Mantenimiento</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/servicios#reparacion" className={styles.link}>Reparación</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/repuestos" className={styles.link}>Repuestos</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/productos" className={styles.link}>Tienda Online</Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Contacto */}
                        <section className={styles.column} aria-labelledby="footer-contacto">
                            <h3 className={styles.columnTitle} id="footer-contacto">Contacto</h3>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon} aria-hidden="true">
                                    <MapPinIcon />
                                </div>
                                <div className={styles.contactText}>
                                    <span className={styles.contactLabel}>Dirección</span>
                                    <span className={styles.contactValue}>Madrid, España</span>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon} aria-hidden="true">
                                    <PhoneIcon />
                                </div>
                                <div className={styles.contactText}>
                                    <span className={styles.contactLabel}>Teléfono</span>
                                    <a href="tel:+34911177777" className={styles.contactLink}>
                                        <span className={styles.contactValue}>91 117 77 77</span>
                                    </a>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon} aria-hidden="true">
                                    <MailIcon />
                                </div>
                                <div className={styles.contactText}>
                                    <span className={styles.contactLabel}>Email</span>
                                    <a href="mailto:info@uniclima.com" className={styles.contactLink}>
                                        <span className={styles.contactValue}>info@uniclima.com</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Sección inferior */}
            <div className={styles.footerBottom}>
                <div className={styles.container}>
                    <div className={styles.bottomContent}>
                        <p className={styles.copyright}>
                            © {currentYear} <Link href="/">Uniclima Solutions</Link>. Todos los derechos reservados.
                        </p>

                        <nav className={styles.legalLinks} aria-label="Enlaces legales">
                            <Link href="/privacidad" className={styles.legalLink}>
                                Política de Privacidad
                            </Link>
                            <Link href="/terminos" className={styles.legalLink}>
                                Términos y Condiciones
                            </Link>
                            <Link href="/cookies" className={styles.legalLink}>
                                Política de Cookies
                            </Link>
                            <Link href="/aviso-legal" className={styles.legalLink}>
                                Aviso Legal
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}
