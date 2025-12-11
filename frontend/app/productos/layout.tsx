import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es';

/**
 * Metadata SEO para el catálogo de productos
 */
export const metadata: Metadata = {
    title: 'Productos de Climatización | Uniclima',
    description: 'Catálogo de aires acondicionados, calderas, aerotermia y repuestos HVAC. Las mejores marcas: Daikin, Mitsubishi, Fujitsu. Envío a toda España.',
    keywords: [
        'aire acondicionado comprar',
        'calderas gas',
        'aerotermia precio',
        'split aire acondicionado',
        'bomba calor',
        'repuestos climatización',
        'daikin',
        'mitsubishi electric',
    ],
    alternates: {
        canonical: `${SITE_URL}/productos`,
    },
    openGraph: {
        title: 'Productos de Climatización | Uniclima',
        description: 'Catálogo de aires acondicionados, calderas, aerotermia y repuestos HVAC. Las mejores marcas.',
        url: `${SITE_URL}/productos`,
        siteName: 'Uniclima',
        type: 'website',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Productos de Climatización | Uniclima',
        description: 'Catálogo de aires acondicionados, calderas, aerotermia y repuestos HVAC.',
    },
};

export default function ProductosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}