import React from 'react';
import { Accordion, Breadcrumb } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para pregunta frecuente
 */
interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

/**
 * Interfaz para categoría de FAQ
 */
interface FAQCategory {
    id: string;
    name: string;
    icon: string;
}

/**
 * Categorías de preguntas frecuentes
 */
const categories: FAQCategory[] = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'pedidos', name: 'Pedidos y Envíos', icon: '📦' },
    { id: 'pagos', name: 'Pagos', icon: '💳' },
    { id: 'productos', name: 'Productos', icon: '🔧' },
    { id: 'devoluciones', name: 'Devoluciones', icon: '↩️' },
    { id: 'cuenta', name: 'Mi Cuenta', icon: '👤' },
];

/**
 * Preguntas frecuentes
 */
const faqs: FAQItem[] = [
    // General
    {
        id: '1',
        question: '¿Qué es Uniclima?',
        answer: 'Uniclima es una empresa especializada en la venta de equipos de climatización, calefacción y ventilación. Ofrecemos productos de las mejores marcas del mercado, tanto para profesionales como para particulares.',
        category: 'general',
    },
    {
        id: '2',
        question: '¿Puedo comprar como particular?',
        answer: 'Sí, vendemos tanto a profesionales como a particulares. Si eres profesional, puedes registrarte como tal para acceder a precios especiales y condiciones de pago adaptadas.',
        category: 'general',
    },
    {
        id: '3',
        question: '¿Ofrecen servicio de instalación?',
        answer: 'No realizamos instalaciones directamente, pero podemos ponerte en contacto con instaladores autorizados en tu zona. Te recomendamos que la instalación la realice siempre un profesional cualificado.',
        category: 'general',
    },

    // Pedidos y Envíos
    {
        id: '4',
        question: '¿Cuánto tarda en llegar mi pedido?',
        answer: 'Los pedidos de productos en stock se envían en 24-48 horas laborables. El tiempo de entrega depende de tu ubicación, pero normalmente oscila entre 2 y 5 días laborables para península. Para Baleares, Canarias y Ceuta/Melilla los plazos pueden ser mayores.',
        category: 'pedidos',
    },
    {
        id: '5',
        question: '¿Cuáles son los gastos de envío?',
        answer: 'Los gastos de envío dependen del peso y volumen del pedido. Para pedidos superiores a 500€ (sin IVA) en península, el envío es gratuito. Puedes consultar los gastos de envío exactos en el carrito antes de finalizar la compra.',
        category: 'pedidos',
    },
    {
        id: '6',
        question: '¿Puedo hacer seguimiento de mi pedido?',
        answer: 'Sí, una vez enviado tu pedido recibirás un email con el número de seguimiento y un enlace para poder rastrear tu envío en tiempo real.',
        category: 'pedidos',
    },
    {
        id: '7',
        question: '¿Hacen envíos internacionales?',
        answer: 'Actualmente solo realizamos envíos dentro de España (península, Baleares, Canarias, Ceuta y Melilla). Si necesitas envío a otro país, contáctanos y estudiaremos tu caso.',
        category: 'pedidos',
    },

    // Pagos
    {
        id: '8',
        question: '¿Qué métodos de pago aceptan?',
        answer: 'Aceptamos pago con tarjeta de crédito/débito (Visa, Mastercard), PayPal, transferencia bancaria y financiación a través de nuestro partner financiero para pedidos superiores a 300€.',
        category: 'pagos',
    },
    {
        id: '9',
        question: '¿Es seguro pagar en vuestra web?',
        answer: 'Absolutamente. Nuestra web cuenta con certificado SSL y todos los pagos se procesan a través de pasarelas de pago seguras. Nunca almacenamos los datos completos de tu tarjeta.',
        category: 'pagos',
    },
    {
        id: '10',
        question: '¿Puedo pagar a plazos?',
        answer: 'Sí, ofrecemos financiación para pedidos superiores a 300€. Puedes financiar tu compra en 3, 6, 12 o hasta 24 meses. Las condiciones exactas se te mostrarán durante el proceso de checkout.',
        category: 'pagos',
    },

    // Productos
    {
        id: '11',
        question: '¿Los productos tienen garantía?',
        answer: 'Todos nuestros productos tienen garantía oficial del fabricante, que suele ser de 2 a 5 años según el producto y marca. Además, como consumidor tienes garantía legal de 3 años.',
        category: 'productos',
    },
    {
        id: '12',
        question: '¿Cómo sé qué equipo necesito?',
        answer: 'En cada ficha de producto encontrarás especificaciones detalladas y recomendaciones de uso. Si tienes dudas, puedes contactar con nuestro equipo técnico que te asesorará sin compromiso sobre el equipo más adecuado para tus necesidades.',
        category: 'productos',
    },
    {
        id: '13',
        question: '¿Vendéis repuestos y accesorios?',
        answer: 'Sí, disponemos de una amplia gama de repuestos y accesorios para la mayoría de marcas y modelos. Puedes buscarlos en nuestra sección de Repuestos o contactarnos si no encuentras lo que necesitas.',
        category: 'productos',
    },

    // Devoluciones
    {
        id: '14',
        question: '¿Puedo devolver un producto?',
        answer: 'Sí, tienes 14 días desde la recepción del pedido para solicitar la devolución de cualquier producto sin necesidad de justificación. El producto debe estar en perfecto estado, sin usar y con su embalaje original.',
        category: 'devoluciones',
    },
    {
        id: '15',
        question: '¿Cómo solicito una devolución?',
        answer: 'Puedes solicitar la devolución desde tu área de cliente, sección "Mis pedidos", o contactando con nuestro servicio de atención al cliente. Te enviaremos una etiqueta de envío y las instrucciones para proceder con la devolución.',
        category: 'devoluciones',
    },
    {
        id: '16',
        question: '¿Quién paga los gastos de devolución?',
        answer: 'Si la devolución es por desistimiento (cambio de opinión), los gastos de envío corren a cargo del cliente. Si el producto es defectuoso o no corresponde con lo pedido, nosotros asumimos los gastos.',
        category: 'devoluciones',
    },

    // Cuenta
    {
        id: '17',
        question: '¿Es necesario crear una cuenta para comprar?',
        answer: 'No es obligatorio, puedes comprar como invitado. Sin embargo, crear una cuenta te permite hacer seguimiento de tus pedidos, guardar tus direcciones, acceder a tu historial de compras y recibir ofertas exclusivas.',
        category: 'cuenta',
    },
    {
        id: '18',
        question: '¿Cómo me registro como profesional?',
        answer: 'Durante el registro, selecciona la opción "Soy profesional" y completa los datos de tu empresa (NIF/CIF, nombre comercial, etc.). Nuestro equipo verificará tus datos y activará tu cuenta profesional en 24-48 horas.',
        category: 'cuenta',
    },
    {
        id: '19',
        question: '¿Qué ventajas tienen los profesionales?',
        answer: 'Los profesionales registrados tienen acceso a precios especiales, condiciones de pago adaptadas (pago a 30 días), atención prioritaria y promociones exclusivas.',
        category: 'cuenta',
    },
];

/**
 * FAQPage - Página de preguntas frecuentes
 * 
 * Muestra las preguntas frecuentes organizadas por categorías
 * con un sistema de acordeón para las respuestas.
 */
export default function FAQPage() {
    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Preguntas Frecuentes' },
    ];

    // Agrupar FAQs por categoría
    const faqsByCategory = categories.map(category => ({
        ...category,
        items: faqs.filter(faq => faq.category === category.id),
    }));

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Preguntas Frecuentes</h1>
                <p className={styles.subtitle}>
                    Encuentra respuestas a las preguntas más comunes sobre nuestros
                    productos, pedidos, envíos y más.
                </p>
            </header>

            {/* Índice de categorías */}
            <nav className={styles.categoryNav} aria-label="Categorías de FAQ">
                <ul className={styles.categoryList}>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <a href={`#${category.id}`} className={styles.categoryLink}>
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <span>{category.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Secciones de FAQ */}
            <div className={styles.faqSections}>
                {faqsByCategory.map((category) => (
                    <section
                        key={category.id}
                        id={category.id}
                        className={styles.faqSection}
                    >
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>{category.icon}</span>
                            {category.name}
                        </h2>

                        <div className={styles.faqList}>
                            <Accordion
                                items={category.items.map(faq => ({
                                    id: faq.id,
                                    title: faq.question,
                                    content: (
                                        <p className={styles.answer}>{faq.answer}</p>
                                    ),
                                }))}
                                allowMultiple
                            />
                        </div>
                    </section>
                ))}
            </div>

            {/* Sección de contacto */}
            <section className={styles.contactSection}>
                <h2 className={styles.contactTitle}>¿No encuentras lo que buscas?</h2>
                <p className={styles.contactText}>
                    Si no has encontrado la respuesta a tu pregunta, no dudes en contactar
                    con nuestro equipo de atención al cliente.
                </p>
                <div className={styles.contactOptions}>
                    <a href="/contacto" className={styles.contactButton}>
                        <span className={styles.contactIcon}>✉️</span>
                        <span>Contactar</span>
                    </a>
                    <a href="tel:+34900000000" className={styles.contactButton}>
                        <span className={styles.contactIcon}>📞</span>
                        <span>900 000 000</span>
                    </a>
                </div>
            </section>
        </div>
    );
}