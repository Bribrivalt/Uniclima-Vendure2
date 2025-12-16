import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
        }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#E53935', margin: 0 }}>
                404
            </h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Página no encontrada
            </h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '400px' }}>
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Link
                href="/"
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#E53935',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                }}
            >
                Volver al inicio
            </Link>
        </div>
    );
}