import styles from './page.module.css';
import Link from 'next/link';

// Services data
const SERVICES = [
    {
        id: 'instalacion',
        title: 'Instalación de Aire Acondicionado',
        description: 'Instalación profesional de equipos de climatización con garantía de 2 años en mano de obra. Nuestros técnicos certificados garantizan una instalación perfecta.',
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        features: [
            'Estudio previo del espacio',
            'Instalación de split, multisplit y conductos',
            'Puesta en marcha y pruebas',
            'Garantía de 2 años en mano de obra',
        ],
        price: 'Desde 250€',
    },
    {
        id: 'mantenimiento',
        title: 'Mantenimiento Preventivo',
        description: 'Servicio de mantenimiento periódico para alargar la vida útil de tu equipo y asegurar su máximo rendimiento. Incluye limpieza de filtros, revisión de gas y diagnóstico.',
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        features: [
            'Limpieza de filtros y componentes',
            'Revisión de niveles de gas',
            'Comprobación eléctrica',
            'Informe de estado del equipo',
        ],
        price: 'Desde 75€',
    },
    {
        id: 'reparacion',
        title: 'Reparación de Averías',
        description: 'Servicio técnico urgente para todo tipo de averías. Diagnóstico rápido y reparación eficiente de cualquier problema en tu sistema de climatización.',
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        ),
        features: [
            'Diagnóstico de averías',
            'Reparación de fugas de gas',
            'Cambio de componentes',
            'Servicio urgente disponible',
        ],
        price: 'Desde 60€',
    },
    {
        id: 'calderas',
        title: 'Servicio de Calderas',
        description: 'Instalación, mantenimiento y reparación de calderas de gas y biomasa. Cumplimos con toda la normativa vigente y ofrecemos certificados oficiales.',
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
        ),
        features: [
            'Instalación homologada',
            'Revisión anual obligatoria',
            'Reparación de todo tipo de calderas',
            'Certificados de instalación',
        ],
        price: 'Consultar',
    },
    {
        id: 'recarga-gas',
        title: 'Recarga de Gas Refrigerante',
        description: 'Servicio de recarga de gas refrigerante con detección previa de fugas. Utilizamos gases ecológicos como R32 y R290 cuando es posible.',
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        features: [
            'Detección de fugas',
            'Gases ecológicos R32, R290',
            'Certificado de recarga',
            'Garantía del servicio',
        ],
        price: 'Desde 120€',
    },
    {
        id: 'presupuesto',
        title: 'Presupuesto Gratuito',
        description: 'Te visitamos sin compromiso para evaluar tus necesidades y ofrecerte un presupuesto personalizado ajustado a tu espacio y presupuesto.',
        icon: (
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        features: [
            'Visita sin compromiso',
            'Estudio de necesidades',
            'Presupuesto detallado',
            'Asesoramiento profesional',
        ],
        price: 'Gratis',
    },
];

const BRANDS_WORKED = [
    'Daikin',
    'Mitsubishi Electric',
    'LG',
    'Fujitsu',
    'Samsung',
    'Panasonic',
    'Carrier',
    'Toshiba',
];

export default function ServiciosPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Servicios de Climatización</h1>
                    <p className={styles.heroSubtitle}>
                        Expertos en instalación, mantenimiento y reparación de sistemas de climatización
                    </p>
                    <Link href="/contacto" className={styles.ctaButton}>
                        Solicitar Presupuesto
                    </Link>
                </div>
            </section>

            {/* Services Grid */}
            <section className={styles.servicesSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
                    <p className={styles.sectionSubtitle}>
                        Ofrecemos soluciones completas para todas tus necesidades de climatización
                    </p>
                </div>

                <div className={styles.servicesGrid}>
                    {SERVICES.map((service) => (
                        <article key={service.id} className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>{service.icon}</div>
                            <h3 className={styles.serviceTitle}>{service.title}</h3>
                            <p className={styles.serviceDescription}>{service.description}</p>
                            <ul className={styles.serviceFeatures}>
                                {service.features.map((feature, index) => (
                                    <li key={index}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.serviceFooter}>
                                <span className={styles.servicePrice}>{service.price}</span>
                                <Link href="/contacto" className={styles.serviceLink}>
                                    Solicitar →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className={styles.whySection}>
                <div className={styles.whyContent}>
                    <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
                    <div className={styles.whyGrid}>
                        <div className={styles.whyItem}>
                            <div className={styles.whyNumber}>15+</div>
                            <div className={styles.whyLabel}>Años de experiencia</div>
                        </div>
                        <div className={styles.whyItem}>
                            <div className={styles.whyNumber}>5000+</div>
                            <div className={styles.whyLabel}>Instalaciones realizadas</div>
                        </div>
                        <div className={styles.whyItem}>
                            <div className={styles.whyNumber}>98%</div>
                            <div className={styles.whyLabel}>Clientes satisfechos</div>
                        </div>
                        <div className={styles.whyItem}>
                            <div className={styles.whyNumber}>24h</div>
                            <div className={styles.whyLabel}>Servicio urgente</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className={styles.brandsSection}>
                <h2 className={styles.brandsSectionTitle}>Trabajamos con las mejores marcas</h2>
                <div className={styles.brandsGrid}>
                    {BRANDS_WORKED.map((brand, index) => (
                        <div key={index} className={styles.brandItem}>
                            {brand}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>¿Necesitas un servicio de climatización?</h2>
                <p className={styles.ctaText}>
                    Contacta con nosotros y te asesoraremos sin compromiso
                </p>
                <div className={styles.ctaButtons}>
                    <Link href="/contacto" className={styles.ctaPrimary}>
                        Contactar Ahora
                    </Link>
                    <a href="tel:+34900123456" className={styles.ctaSecondary}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        900 123 456
                    </a>
                </div>
            </section>
        </div>
    );
}