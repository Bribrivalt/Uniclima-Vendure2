import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Metadata SEO para la página de contacto
 */
export const metadata: Metadata = {
    title: 'Contacto | Uniclima',
    description: 'Contacta con Uniclima para consultas sobre climatización, aires acondicionados y calderas en Madrid. Presupuesto sin compromiso. Tel: 91 117 77 77',
    keywords: [
        'contacto uniclima',
        'presupuesto climatización',
        'instalación aire acondicionado madrid',
        'servicio técnico calderas',
        'consulta HVAC',
    ],
    alternates: {
        canonical: `${SITE_URL}/contacto`,
    },
    openGraph: {
        title: 'Contacto | Uniclima',
        description: 'Contacta con Uniclima para consultas sobre climatización. Presupuesto sin compromiso.',
        url: `${SITE_URL}/contacto`,
        siteName: 'Uniclima',
        type: 'website',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary',
        title: 'Contacto | Uniclima',
        description: 'Contacta con Uniclima para consultas sobre climatización. Presupuesto sin compromiso.',
    },
};

export default function ContactoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}