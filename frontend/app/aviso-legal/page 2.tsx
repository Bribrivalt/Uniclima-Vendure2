import React from 'react';
import { Breadcrumb } from '@/components/core';
import styles from './page.module.css';

/**
 * Metadata para SEO
 */
export const metadata = {
    title: 'Aviso Legal | Uniclima',
    description: 'Aviso legal y condiciones de uso del sitio web de Uniclima',
};

/**
 * AvisoLegalPage - Página de aviso legal
 * 
 * Contiene la información legal obligatoria según la LSSI-CE.
 */
export default function AvisoLegalPage() {
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Aviso Legal' },
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <article className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Aviso Legal</h1>
                    <p className={styles.lastUpdated}>Última actualización: Diciembre 2024</p>
                </header>

                <section className={styles.section}>
                    <h2>1. Datos identificativos</h2>
                    <p>
                        En cumplimiento con el deber de información recogido en el artículo 10 de la
                        Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y
                        del Comercio Electrónico (LSSI-CE), a continuación se reflejan los siguientes datos:
                    </p>
                    <ul className={styles.dataList}>
                        <li><strong>Denominación social:</strong> Uniclima S.L.</li>
                        <li><strong>CIF:</strong> B12345678</li>
                        <li><strong>Domicilio:</strong> Calle Principal 123, 28001 Madrid, España</li>
                        <li><strong>Teléfono:</strong> +34 900 000 000</li>
                        <li><strong>Email:</strong> info@uniclima.es</li>
                        <li><strong>Inscripción:</strong> Registro Mercantil de Madrid, Tomo XXXXX, Folio XX, Hoja M-XXXXXX</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>2. Objeto</h2>
                    <p>
                        El presente aviso legal regula el uso del sitio web www.uniclima.es (en adelante,
                        "el sitio web"), del que es titular Uniclima S.L.
                    </p>
                    <p>
                        La navegación por el sitio web atribuye la condición de usuario del mismo e implica
                        la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas
                        en este Aviso Legal.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Condiciones de acceso y uso</h2>
                    <p>
                        El acceso al sitio web es gratuito salvo en lo relativo al coste de la conexión
                        a través de la red de telecomunicaciones suministrada por el proveedor de acceso
                        contratado por el usuario.
                    </p>
                    <p>El usuario se compromete a:</p>
                    <ul>
                        <li>Hacer un uso adecuado de los contenidos y servicios del sitio web.</li>
                        <li>No realizar actividades ilícitas o contrarias a la buena fe y al ordenamiento legal.</li>
                        <li>No difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico,
                            de apología del terrorismo o atentatorio contra los derechos humanos.</li>
                        <li>No provocar daños en los sistemas físicos y lógicos del sitio web, de sus proveedores
                            o de terceras personas.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Propiedad intelectual e industrial</h2>
                    <p>
                        Todos los contenidos del sitio web (incluyendo, sin carácter limitativo, bases de datos,
                        imágenes, dibujos, gráficos, archivos de texto, audio, vídeo y software) son propiedad
                        de Uniclima S.L. o de terceros que han autorizado su uso.
                    </p>
                    <p>
                        Quedan reservados todos los derechos de propiedad intelectual e industrial sobre los
                        contenidos del sitio web. Queda prohibida la reproducción, distribución, comunicación
                        pública, transformación o cualquier otra forma de explotación de los contenidos sin
                        autorización previa y expresa.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Responsabilidad</h2>
                    <p>
                        Uniclima S.L. no se hace responsable de los daños y perjuicios de cualquier naturaleza
                        que pudieran ocasionarse por la falta de disponibilidad, continuidad o calidad del
                        funcionamiento del sitio web y sus servicios.
                    </p>
                    <p>
                        Asimismo, Uniclima S.L. no garantiza la ausencia de virus u otros elementos en los
                        contenidos que puedan producir alteraciones en el sistema informático del usuario.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>6. Enlaces</h2>
                    <p>
                        El sitio web puede contener enlaces a páginas web de terceros. Uniclima S.L. no asume
                        ninguna responsabilidad por el contenido, informaciones o servicios que pudieran
                        aparecer en dichos sitios.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>7. Legislación aplicable y jurisdicción</h2>
                    <p>
                        Para la resolución de todas las controversias o cuestiones relacionadas con el presente
                        sitio web, será de aplicación la legislación española, a la que se someten expresamente
                        las partes, siendo competentes para la resolución de todos los conflictos los Juzgados
                        y Tribunales de Madrid.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>8. Contacto</h2>
                    <p>
                        Para cualquier consulta relacionada con este aviso legal, puede ponerse en contacto
                        con nosotros a través de:
                    </p>
                    <ul className={styles.dataList}>
                        <li><strong>Email:</strong> legal@uniclima.es</li>
                        <li><strong>Teléfono:</strong> +34 900 000 000</li>
                        <li><strong>Dirección:</strong> Calle Principal 123, 28001 Madrid, España</li>
                    </ul>
                </section>
            </article>
        </div>
    );
}