import styles from './page.module.css';
import Link from 'next/link';

// Team members
const TEAM = [
    {
        name: 'Carlos García',
        role: 'Director General',
        description: 'Más de 20 años de experiencia en el sector de la climatización.',
        image: null,
    },
    {
        name: 'María López',
        role: 'Directora Comercial',
        description: 'Especialista en soluciones de climatización para empresas.',
        image: null,
    },
    {
        name: 'Antonio Martínez',
        role: 'Jefe de Instalaciones',
        description: 'Técnico certificado con amplia experiencia en proyectos complejos.',
        image: null,
    },
    {
        name: 'Laura Sánchez',
        role: 'Atención al Cliente',
        description: 'Comprometida con la satisfacción y fidelización de nuestros clientes.',
        image: null,
    },
];

// Company values
const VALUES = [
    {
        title: 'Profesionalidad',
        description: 'Trabajamos con los más altos estándares de calidad y certificaciones oficiales.',
        icon: (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
    },
    {
        title: 'Compromiso',
        description: 'Nos comprometemos con cada proyecto como si fuera el nuestro propio.',
        icon: (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        title: 'Innovación',
        description: 'Siempre a la vanguardia de las últimas tecnologías en climatización.',
        icon: (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'Sostenibilidad',
        description: 'Apostamos por soluciones eficientes y respetuosas con el medio ambiente.',
        icon: (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

// Timeline / History
const TIMELINE = [
    {
        year: '2008',
        title: 'Fundación',
        description: 'Uniclima nace con la visión de ofrecer soluciones de climatización profesionales.',
    },
    {
        year: '2012',
        title: 'Expansión',
        description: 'Ampliamos nuestro equipo y comenzamos a trabajar con las principales marcas.',
    },
    {
        year: '2016',
        title: 'Certificaciones',
        description: 'Obtenemos las certificaciones oficiales de instalador autorizado.',
    },
    {
        year: '2020',
        title: 'Digitalización',
        description: 'Lanzamos nuestra plataforma online para facilitar el acceso a nuestros servicios.',
    },
    {
        year: '2024',
        title: 'Actualidad',
        description: 'Más de 5000 instalaciones realizadas y un equipo de 15 profesionales.',
    },
];

export default function ConocenosPage() {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Conócenos</h1>
                    <p className={styles.heroSubtitle}>
                        Tu socio de confianza en climatización desde 2008
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <div className={styles.aboutText}>
                        <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
                        <p className={styles.aboutParagraph}>
                            Uniclima es una empresa especializada en la venta, instalación y mantenimiento
                            de sistemas de climatización. Desde nuestra fundación en 2008, hemos trabajado
                            incansablemente para convertirnos en referentes del sector en la región.
                        </p>
                        <p className={styles.aboutParagraph}>
                            Nuestro compromiso con la calidad y la satisfacción del cliente nos ha permitido
                            crecer de manera sostenida, trabajando con las mejores marcas del mercado y
                            formando un equipo de profesionales altamente cualificados.
                        </p>
                        <p className={styles.aboutParagraph}>
                            Hoy, con más de 5000 instalaciones realizadas, seguimos fieles a nuestra misión:
                            ofrecer soluciones de climatización que mejoren el confort y la eficiencia
                            energética de hogares y empresas.
                        </p>
                    </div>
                    <div className={styles.aboutImage}>
                        <div className={styles.imagePlaceholder}>
                            <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Uniclima</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
                <div className={styles.valuesGrid}>
                    {VALUES.map((value, index) => (
                        <div key={index} className={styles.valueCard}>
                            <div className={styles.valueIcon}>{value.icon}</div>
                            <h3 className={styles.valueTitle}>{value.title}</h3>
                            <p className={styles.valueDescription}>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timeline Section */}
            <section className={styles.timelineSection}>
                <h2 className={styles.sectionTitle}>Nuestra Trayectoria</h2>
                <div className={styles.timeline}>
                    {TIMELINE.map((item, index) => (
                        <div key={index} className={styles.timelineItem}>
                            <div className={styles.timelineYear}>{item.year}</div>
                            <div className={styles.timelineContent}>
                                <h3 className={styles.timelineTitle}>{item.title}</h3>
                                <p className={styles.timelineDescription}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className={styles.teamSection}>
                <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
                <p className={styles.sectionSubtitle}>
                    Profesionales comprometidos con tu confort
                </p>
                <div className={styles.teamGrid}>
                    {TEAM.map((member, index) => (
                        <div key={index} className={styles.teamCard}>
                            <div className={styles.teamAvatar}>
                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className={styles.teamName}>{member.name}</h3>
                            <span className={styles.teamRole}>{member.role}</span>
                            <p className={styles.teamDescription}>{member.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>¿Quieres saber más?</h2>
                <p className={styles.ctaText}>
                    Estamos aquí para resolver todas tus dudas
                </p>
                <div className={styles.ctaButtons}>
                    <Link href="/contacto" className={styles.ctaPrimary}>
                        Contactar
                    </Link>
                    <Link href="/servicios" className={styles.ctaSecondary}>
                        Ver Servicios
                    </Link>
                </div>
            </section>
        </div>
    );
}