import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from '@/lib/providers'
import Header from '@/components/layout/Header'
import { TopBar } from '@/components/layout/TopBar'
import Footer from '@/components/layout/Footer'
import { generateDefaultMetadata } from '@/lib/seo/metadata'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
})

/**
 * Metadata SEO global del sitio
 * Usa generateDefaultMetadata() para consistencia
 */
export const metadata: Metadata = {
    ...generateDefaultMetadata(),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://uniclima.es'),
    icons: {
        icon: '/favicon.svg',
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Uniclima',
    },
    formatDetection: {
        telephone: true,
        email: true,
        address: true,
    },
}

/**
 * Configuración del viewport para móviles
 */
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#E53935' },
        { media: '(prefers-color-scheme: dark)', color: '#C62828' },
    ],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <head>
                {/* Preconnect a recursos externos para mejor performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* DNS prefetch para el backend */}
                <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_VENDURE_API_URL || 'http://localhost:3000'} />
                {/* PWA: Apple-specific meta tags */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Uniclima" />
                {/* PWA: Microsoft Tiles */}
                <meta name="msapplication-TileColor" content="#E53935" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
            </head>
            <body className={inter.className}>
                {/* Skip to content para accesibilidad - usa clase .skip-link de globals.css */}
                <a href="#main-content" className="skip-link">
                    Saltar al contenido principal
                </a>
                <Providers>
                    <TopBar />
                    <Header />
                    <main id="main-content" role="main">{children}</main>
                    <Footer />
                </Providers>
                
                {/* Service Worker Registration */}
                <Script
                    id="sw-register"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js')
                                        .then(function(registration) {
                                            console.log('SW registered:', registration.scope);
                                        })
                                        .catch(function(error) {
                                            console.log('SW registration failed:', error);
                                        });
                                });
                            }
                        `,
                    }}
                />
            </body>
        </html>
    )
}
