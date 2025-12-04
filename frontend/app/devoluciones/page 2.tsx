import React from 'react';
import { Breadcrumb } from '@/components/core';
import styles from './page.module.css';

/**
 * Metadata para SEO
 */
export const metadata = {
    title: 'Política de Devoluciones | Uniclima',
    description: 'Conoce nuestra política de devoluciones y cómo solicitar un reembolso',
};

/**
 * DevolucionesPage - Página de política de devoluciones
 * 
 * Información sobre devoluciones y reembolsos.
 */
export default function DevolucionesPage() {
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Política de Devoluciones' },
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <article className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Política de Devoluciones</h1>
                    <p className={styles.lastUpdated}>Última actualización: Diciembre 2024</p>
                </header>

                <section className={styles.section}>
                    <h2>1. Derecho de desistimiento</h2>
                    <p>
                        De conformidad con la legislación vigente, dispones de un plazo de <strong>14 días
                            naturales</strong> desde la recepción del pedido para ejercer tu derecho de desistimiento
                        sin necesidad de justificación.
                    </p>
                    <p>
                        Para ejercer este derecho, deberás comunicarnos tu decisión de forma clara e inequívoca
                        mediante uno de los siguientes medios:
                    </p>
                    <ul>
                        <li>Email: devoluciones@uniclima.es</li>
                        <li>Teléfono: +34 900 000 000</li>
                        <li>Formulario de contacto en nuestra web</li>
                        <li>A través de tu área de cliente</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>2. Condiciones para la devolución</h2>
                    <p>Para que la devolución sea aceptada, el producto debe:</p>
                    <ul>
                        <li>Estar sin usar y en las mismas condiciones en que se recibió</li>
                        <li>Conservar el embalaje original</li>
                        <li>Incluir todos los accesorios, manuales y documentación</li>
                        <li>No presentar signos de instalación o uso</li>
                        <li>Conservar las etiquetas y precintos originales</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. Excepciones al derecho de desistimiento</h2>
                    <p>No se admiten devoluciones en los siguientes casos:</p>
                    <ul>
                        <li>Productos precintados que hayan sido desprecintados</li>
                        <li>Productos personalizados o fabricados según especificaciones del cliente</li>
                        <li>Productos que puedan deteriorarse o caducar con rapidez</li>
                        <li>Productos que por razones de higiene no puedan ser devueltos</li>
                        <li>Servicios ya ejecutados</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Proceso de devolución</h2>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>1</span>
                            <div className={styles.stepContent}>
                                <h3>Solicita la devolución</h3>
                                <p>Contacta con nosotros dentro del plazo de 14 días indicando tu número de pedido.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>2</span>
                            <div className={styles.stepContent}>
                                <h3>Recibe la etiqueta de envío</h3>
                                <p>Te enviaremos una etiqueta prepagada para el envío de devolución.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>3</span>
                            <div className={styles.stepContent}>
                                <h3>Empaqueta el producto</h3>
                                <p>Embala el producto de forma segura, preferiblemente en su embalaje original.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>4</span>
                            <div className={styles.stepContent}>
                                <h3>Envía el paquete</h3>
                                <p>Entrega el paquete en el punto de recogida indicado.</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>5</span>
                            <div className={styles.stepContent}>
                                <h3>Recibe el reembolso</h3>
                                <p>Una vez verificado el producto, procesaremos el reembolso en 7-14 días.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>5. Gastos de devolución</h2>
                    <ul>
                        <li><strong>Desistimiento (cambio de opinión):</strong> Los gastos de envío de devolución corren a cargo del cliente (aproximadamente 15-25€ dependiendo del tamaño).</li>
                        <li><strong>Producto defectuoso:</strong> Nosotros asumimos todos los gastos de envío.</li>
                        <li><strong>Error en el pedido:</strong> Nosotros asumimos todos los gastos de envío.</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Reembolso</h2>
                    <p>
                        El reembolso se realizará utilizando el mismo método de pago empleado para la compra
                        en un plazo máximo de <strong>14 días</strong> desde la recepción y verificación del producto.
                    </p>
                    <p>
                        Se reembolsará el importe total del producto. Los gastos de envío originales solo se
                        reembolsarán si la devolución se debe a un error nuestro o a un producto defectuoso.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>7. Productos defectuosos o dañados</h2>
                    <p>
                        Si recibes un producto defectuoso o dañado durante el transporte, por favor:
                    </p>
                    <ul>
                        <li>Comunícanoslo en las primeras 48 horas</li>
                        <li>Conserva el embalaje original</li>
                        <li>Toma fotografías del daño</li>
                        <li>No intentes reparar el producto</li>
                    </ul>
                    <p>
                        Nos haremos cargo de todos los gastos y te enviaremos un producto de sustitución
                        o procederemos al reembolso, según tu preferencia.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>8. Garantía</h2>
                    <p>
                        Todos nuestros productos cuentan con la garantía legal de 3 años (para consumidores)
                        más la garantía del fabricante (habitualmente 2-5 años adicionales según marca y producto).
                    </p>
                    <p>
                        Para hacer uso de la garantía, conserva el ticket de compra y contacta con nosotros
                        indicando el número de pedido y el problema detectado.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>9. Contacto</h2>
                    <p>Para cualquier consulta sobre devoluciones:</p>
                    <ul className={styles.dataList}>
                        <li><strong>Email:</strong> devoluciones@uniclima.es</li>
                        <li><strong>Teléfono:</strong> +34 900 000 000</li>
                        <li><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</li>
                    </ul>
                </section>
            </article>
        </div>
    );
}