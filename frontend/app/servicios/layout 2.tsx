import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Metadata SEO para la página de servicios
 */
export const metadata: Metadata = {
    title: 'Servicios de Climatización | Uniclima',
    description: 'Servicios profesionales de instalación, mantenimiento y reparación de aires acondicionados, calderas y sistemas de aerotermia en Madrid. Garantía oficial.',
    keywords: [
        'instalación aire acondicionado',
        'mantenimiento climatización',
        'reparación calderas madrid',
        'servicio técnico HVAC',
        'aerotermia instalación',
    ],
    alternates: {
        canonical: `${SITE_URL}/servicios`,
    },
    openGraph: {
        title: 'Servicios de Climatización | Uniclima',
        description: 'Servicios profesionales de instalación, mantenimiento y reparación de sistemas de climatización en Madrid.',
        url: `${SITE_URL}/servicios`,
        siteName: 'Uniclima',
        type: 'website',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary',
        title: 'Servicios de Climatización | Uniclima',
        description: 'Servicios profesionales de instalación, mantenimiento y reparación de sistemas de climatización.',
    },
};

export default function ServiciosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}