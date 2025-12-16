'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        ¡Algo salió mal!
                    </h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                        Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#E53935',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                        }}
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </body>
        </html>
    );
}