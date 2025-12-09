/** @type {import('next').NextConfig} */
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
                protocol: 'https',
                hostname: 'localhost',
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
}

// Bundle analyzer - usar con: ANALYZE=true npm run build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
