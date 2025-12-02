import styles from '../privacidad/page.module.css';

export const metadata = {
    title: 'Términos y Condiciones | Uniclima',
    description: 'Términos y condiciones de uso de Uniclima',
};

export default function TerminosPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Términos y Condiciones</h1>
            <p className={styles.updated}>Última actualización: 1 de diciembre de 2024</p>

            <section className={styles.section}>
                <h2>1. Aceptación de los términos</h2>
                <p>
                    Al acceder y utilizar el sitio web de Uniclima, aceptas cumplir con estos
                    términos y condiciones de uso. Si no estás de acuerdo con alguno de estos
                    términos, te rogamos que no utilices nuestro sitio web.
                </p>
            </section>

            <section className={styles.section}>
                <h2>2. Uso del sitio web</h2>
                <p>
                    Te comprometes a utilizar este sitio web únicamente para fines legales y
                    de una manera que no infrinja los derechos de terceros ni restrinja o
                    inhiba el uso y disfrute de este sitio web por parte de otros.
                </p>
                <p>Queda prohibido:</p>
                <ul>
                    <li>Usar el sitio web de manera fraudulenta</li>
                    <li>Transmitir material ilegal, amenazador, difamatorio u ofensivo</li>
                    <li>Intentar obtener acceso no autorizado a nuestros sistemas</li>
                    <li>Interferir con el funcionamiento normal del sitio web</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>3. Productos y precios</h2>
                <p>
                    Nos esforzamos por mostrar información precisa sobre nuestros productos
                    y precios. Sin embargo, pueden existir errores tipográficos o de otra
                    naturaleza. Nos reservamos el derecho de corregir cualquier error y de
                    cancelar pedidos afectados por estos errores.
                </p>
                <p>
                    Los precios mostrados incluyen IVA, salvo que se indique lo contrario.
                    Los gastos de envío se calcularán durante el proceso de compra.
                </p>
            </section>

            <section className={styles.section}>
                <h2>4. Proceso de compra</h2>
                <p>
                    Al realizar un pedido a través de nuestra web, estás haciendo una oferta
                    para comprar un producto. Te enviaremos un email confirmando la recepción
                    de tu pedido. El contrato de compraventa se perfecciona cuando te enviemos
                    la confirmación de envío.
                </p>
                <p>
                    Nos reservamos el derecho de rechazar cualquier pedido por motivos legítimos,
                    como falta de stock o problemas con el pago.
                </p>
            </section>

            <section className={styles.section}>
                <h2>5. Envíos y entregas</h2>
                <p>
                    Realizamos envíos a toda España peninsular. Los plazos de entrega indicados
                    son estimados y pueden variar según la disponibilidad del producto y la
                    localización de entrega.
                </p>
                <p>
                    El envío es gratuito para pedidos superiores a 100€. Para pedidos inferiores,
                    se aplicará un coste de envío que se mostrará antes de finalizar la compra.
                </p>
            </section>

            <section className={styles.section}>
                <h2>6. Devoluciones y garantías</h2>
                <p>
                    Tienes derecho a desistir del contrato en un plazo de 14 días naturales
                    desde la recepción del producto, sin necesidad de justificación. Para
                    ejercer este derecho, debes comunicárnoslo y devolver el producto en su
                    estado original.
                </p>
                <p>
                    Todos nuestros productos tienen una garantía mínima de 2 años conforme
                    a la legislación vigente. Las reclamaciones por garantía deben realizarse
                    aportando el comprobante de compra.
                </p>
            </section>

            <section className={styles.section}>
                <h2>7. Propiedad intelectual</h2>
                <p>
                    Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos,
                    iconos y software, es propiedad de Uniclima o de sus proveedores de contenido
                    y está protegido por las leyes de propiedad intelectual.
                </p>
            </section>

            <section className={styles.section}>
                <h2>8. Limitación de responsabilidad</h2>
                <p>
                    Uniclima no será responsable de daños indirectos, incidentales o
                    consecuentes derivados del uso de este sitio web o de la imposibilidad
                    de usarlo. En cualquier caso, nuestra responsabilidad estará limitada
                    al importe pagado por el producto.
                </p>
            </section>

            <section className={styles.section}>
                <h2>9. Modificaciones</h2>
                <p>
                    Nos reservamos el derecho de modificar estos términos y condiciones en
                    cualquier momento. Las modificaciones entrarán en vigor desde su
                    publicación en el sitio web. Te recomendamos revisar periódicamente
                    esta página.
                </p>
            </section>

            <section className={styles.section}>
                <h2>10. Legislación aplicable</h2>
                <p>
                    Estos términos y condiciones se rigen por la legislación española.
                    Para cualquier controversia, las partes se someten a los juzgados
                    y tribunales de Madrid, con renuncia expresa a cualquier otro fuero.
                </p>
            </section>

            <section className={styles.section}>
                <h2>11. Contacto</h2>
                <p>
                    Para cualquier consulta relacionada con estos términos y condiciones:
                </p>
                <address className={styles.address}>
                    <strong>Uniclima S.L.</strong><br />
                    Dirección: Calle Example 123, 28001 Madrid<br />
                    Email: <a href="mailto:legal@uniclima.es">legal@uniclima.es</a><br />
                    Teléfono: +34 900 000 000
                </address>
            </section>
        </div>
    );
}