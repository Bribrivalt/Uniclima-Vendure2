import { MaintenanceForm } from '@/components/forms/MaintenanceForm';
import styles from './page.module.css';

export const metadata = {
    title: 'Contratos de Mantenimiento | Uniclima Solutions',
    description: 'Encuentra el plan de mantenimiento ideal para tu sistema de climatización.',
};

export default function MaintenancePage() {
    return (
        <main className={styles.main}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>Mantenimiento a tu Medida</h1>
                    <p className={styles.subtitle}>
                        Asegura la vida útil de tus equipos con nuestros planes especializados.
                        Tranquilidad total para tu hogar o negocio.
                    </p>
                </div>
            </section>

            <div className={styles.container}>
                {/* Intro Section */}
                <section className={styles.intro}>
                    <h2>¿Por qué contratar un mantenimiento?</h2>
                    <p>
                        Un mantenimiento preventivo regular evita averías costosas,
                        mejora el rendimiento energético y garantiza aire limpio y saludable.
                    </p>
                </section>

                {/* Benefits Grid */}
                <div className={styles.benefits}>
                    <div className={styles.benefitCard}>
                        <div className={styles.benefitIcon}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className={styles.benefitTitle}>Ahorro Energético</h3>
                        <p className={styles.benefitText}>
                            Equipos limpios y ajustados consumen hasta un 30% menos de energía.
                        </p>
                    </div>

                    <div className={styles.benefitCard}>
                        <div className={styles.benefitIcon}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className={styles.benefitTitle}>Mayor Durabilidad</h3>
                        <p className={styles.benefitText}>
                            Extiende la vida útil de tu instalación y evita reemplazos prematuros.
                        </p>
                    </div>

                    <div className={styles.benefitCard}>
                        <div className={styles.benefitIcon}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className={styles.benefitTitle}>Prioridad en Averías</h3>
                        <p className={styles.benefitText}>
                            Nuestros clientes con contrato tienen atención preferente en caso de urgencia.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <section className={styles.formSection} id="contacto">
                    <div className={styles.intro}>
                        <h2>Encuentra tu plan ideal</h2>
                        <p style={{ marginBottom: '2rem' }}>
                            Déjanos tus datos y te contactaremos para ofrecerte la mejor solución personalizada.
                        </p>
                    </div>
                    <MaintenanceForm />
                </section>
            </div>
        </main>
    );
}
