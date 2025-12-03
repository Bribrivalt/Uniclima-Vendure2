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

module.exports = nextConfig
