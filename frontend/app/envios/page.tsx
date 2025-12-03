import React from 'react';
import { Breadcrumb } from '@/components/core';
import styles from './page.module.css';

/**
 * Metadata para SEO
 */
export const metadata = {
    title: 'Política de Envíos | Uniclima',
    description: 'Información sobre métodos de envío, plazos de entrega y gastos de envío',
};

/**
 * EnviosPage - Página de política de envíos
 * 
 * Información detallada sobre los envíos.
 */
export default function EnviosPage() {
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Política de Envíos' },
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <article className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Política de Envíos</h1>
                    <p className={styles.lastUpdated}>Última actualización: Diciembre 2024</p>
                </header>

                <section className={styles.section}>
                    <h2>1. Zonas de envío</h2>
                    <p>Realizamos envíos a toda España:</p>
                    <div className={styles.zonesTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Zona</th>
                                    <th>Plazo de entrega</th>
                                    <th>Coste*</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Península</td>
                                    <td>2-5 días laborables</td>
                                    <td>Desde 9,95€</td>
                                </tr>
                                <tr>
                                    <td>Baleares</td>
                                    <td>4-7 días laborables</td>
                                    <td>Desde 19,95€</td>
                                </tr>
                                <tr>
                                    <td>Canarias</td>
                                    <td>5-10 días laborables</td>
                                    <td>Desde 29,95€</td>
                                </tr>
                                <tr>
                                    <td>Ceuta y Melilla</td>
                                    <td>5-10 días laborables</td>
                                    <td>Consultar</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className={styles.tableNote}>
                            * Los gastos varían según peso y volumen del pedido.
                            Consulta el coste exacto en el carrito antes de finalizar la compra.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>2. Envío gratuito</h2>
                    <div className={styles.freeShipping}>
                        <span className={styles.freeShippingIcon}>🚚</span>
                        <div>
                            <h3>¡Envío GRATIS a península!</h3>
                            <p>En pedidos superiores a <strong>500€</strong> (sin IVA)</p>
                        </div>
                    </div>
                    <p>
                        El envío gratuito se aplica automáticamente a pedidos que cumplan las condiciones
                        y se envíen a direcciones de la península ibérica española.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. Métodos de envío</h2>
                    <div className={styles.shippingMethods}>
                        <div className={styles.method}>
                            <h3>📦 Envío estándar</h3>
                            <p>Entrega en 2-5 días laborables mediante agencia de transporte.</p>
                            <ul>
                                <li>Seguimiento online</li>
                                <li>Entrega en domicilio</li>
                                <li>Intento de entrega con aviso previo</li>
                            </ul>
                        </div>
                        <div className={styles.method}>
                            <h3>⚡ Envío express</h3>
                            <p>Entrega en 24-48 horas (disponible en península).</p>
                            <ul>
                                <li>Pedidos antes de las 14:00</li>
                                <li>Coste adicional según destino</li>
                                <li>Seguimiento en tiempo real</li>
                            </ul>
                        </div>
                        <div className={styles.method}>
                            <h3>🏪 Recogida en punto</h3>
                            <p>Recoge tu pedido en un punto de conveniencia cercano.</p>
                            <ul>
                                <li>Red de más de 3.000 puntos</li>
                                <li>Horarios ampliados</li>
                                <li>Sin coste adicional</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>4. Plazos de preparación</h2>
                    <ul>
                        <li><strong>Productos en stock:</strong> Preparación en 24-48 horas laborables</li>
                        <li><strong>Productos bajo pedido:</strong> Plazo indicado en la ficha del producto</li>
                        <li><strong>Equipos especiales:</strong> Consultar plazo de disponibilidad</li>
                    </ul>
                    <p>
                        Los plazos de entrega indicados comienzan a contar desde la salida del almacén,
                        una vez preparado el pedido.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Seguimiento del pedido</h2>
                    <p>
                        Una vez enviado tu pedido, recibirás un email con:
                    </p>
                    <ul>
                        <li>Número de seguimiento</li>
                        <li>Enlace para rastrear el envío</li>
                        <li>Información del transportista</li>
                        <li>Fecha estimada de entrega</li>
                    </ul>
                    <p>
                        También puedes consultar el estado de tu pedido en cualquier momento
                        desde tu área de cliente.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>6. Recepción del pedido</h2>
                    <p>Al recibir tu pedido, te recomendamos:</p>
                    <ul>
                        <li>Verificar que el número de bultos coincide con el albarán</li>
                        <li>Comprobar el estado del embalaje</li>
                        <li>En caso de daños visibles, indicarlo en el albarán de entrega</li>
                        <li>Revisar el contenido en las primeras 48 horas</li>
                        <li>Comunicar cualquier incidencia inmediatamente</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>7. Entregas especiales</h2>
                    <p>
                        Para equipos de climatización voluminosos o que requieran manipulación especial,
                        ofrecemos servicios adicionales:
                    </p>
                    <ul>
                        <li><strong>Entrega en planta baja:</strong> El transportista entrega en portal o planta baja</li>
                        <li><strong>Entrega en piso:</strong> Subida a piso con coste adicional (consultar)</li>
                        <li><strong>Entrega en obra:</strong> Coordinación con responsable de obra</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>8. Problemas con la entrega</h2>
                    <p>Si experimentas algún problema con tu entrega:</p>
                    <ul className={styles.dataList}>
                        <li><strong>Email:</strong> envios@uniclima.es</li>
                        <li><strong>Teléfono:</strong> +34 900 000 000</li>
                        <li><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</li>
                    </ul>
                </section>
            </article>
        </div>
    );
}