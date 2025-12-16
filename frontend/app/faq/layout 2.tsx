import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Metadata SEO para la página de preguntas frecuentes
 */
export const metadata: Metadata = {
    title: 'Preguntas Frecuentes | Uniclima',
    description: 'Respuestas a las preguntas más frecuentes sobre climatización, instalación de aires acondicionados, mantenimiento de calderas y servicios de Uniclima.',
    keywords: [
        'preguntas frecuentes climatización',
        'FAQ aire acondicionado',
        'dudas instalación caldera',
        'consultas HVAC',
    ],
    alternates: {
        canonical: `${SITE_URL}/faq`,
    },
    openGraph: {
        title: 'Preguntas Frecuentes | Uniclima',
        description: 'Respuestas a las preguntas más frecuentes sobre climatización.',
        url: `${SITE_URL}/faq`,
        siteName: 'Uniclima',
        type: 'website',
        locale: 'es_ES',
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}