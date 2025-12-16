import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sin conexión - Uniclima Solutions',
    description: 'Estás sin conexión. Verifica tu conexión a internet e intenta de nuevo.',
};

export default function OfflineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}