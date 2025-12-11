import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Metadata SEO para la página Conócenos
 */
export const metadata: Metadata = {
    title: 'Conócenos | Uniclima',
    description: 'Conoce a Uniclima: empresa especializada en climatización desde 2008. Más de 5000 instalaciones, equipo profesional y compromiso con la calidad en Madrid.',
    keywords: [
        'uniclima empresa',
        'climatización madrid',
        'sobre nosotros',
        'empresa instalación aire acondicionado',
        'historia uniclima',
    ],
    alternates: {
        canonical: `${SITE_URL}/conocenos`,
    },
    openGraph: {
        title: 'Conócenos | Uniclima',
        description: 'Conoce a Uniclima: empresa especializada en climatización desde 2008. Más de 5000 instalaciones en Madrid.',
        url: `${SITE_URL}/conocenos`,
        siteName: 'Uniclima',
        type: 'website',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary',
        title: 'Conócenos | Uniclima',
        description: 'Conoce a Uniclima: empresa especializada en climatización desde 2008.',
    },
};

export default function ConocenosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}