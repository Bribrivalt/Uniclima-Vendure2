/** @type {import('next').NextConfig} */

// URL del backend - en Docker usa el nombre del servicio, fuera usa localhost
// VENDURE_INTERNAL_API es para comunicación servidor->servidor dentro de Docker
const VENDURE_BACKEND_URL = process.env.VENDURE_INTERNAL_API || 'http://localhost:3001';

const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/assets/**',
            },
            {
                protocol: 'http',
                hostname: 'backend',
                port: '3001',
                pathname: '/assets/**',
            },
            // Para producción, añadir el dominio real
            // {
            //     protocol: 'https',
            //     hostname: 'api.uniclima.es',
            //     pathname: '/assets/**',
            // },
        ],
    },
    // Proxy API requests to Vendure backend
    // Esto permite que las peticiones del servidor (SSR) lleguen al backend
    async rewrites() {
        return [
            {
                source: '/shop-api/:path*',
                destination: `${VENDURE_BACKEND_URL}/shop-api/:path*`,
            },
            {
                source: '/admin-api/:path*',
                destination: `${VENDURE_BACKEND_URL}/admin-api/:path*`,
            },
            {
                source: '/assets/:path*',
                destination: `${VENDURE_BACKEND_URL}/assets/:path*`,
            },
        ];
    },
}

// Bundle analyzer - usar con: ANALYZE=true npm run build
// Solo cargar si la variable de entorno está activa
const withBundleAnalyzer = process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({ enabled: true })
    : (config) => config;

module.exports = withBundleAnalyzer(nextConfig)
