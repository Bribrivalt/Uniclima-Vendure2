/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/assets/**',
            },
            {
                protocol: 'https',
                hostname: 'localhost',
                port: '3000',
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
    async rewrites() {
        return [
            {
                source: '/shop-api/:path*',
                destination: 'http://localhost:3000/shop-api/:path*',
            },
            {
                source: '/admin-api/:path*',
                destination: 'http://localhost:3000/admin-api/:path*',
            },
            {
                source: '/assets/:path*',
                destination: 'http://localhost:3000/assets/:path*',
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
