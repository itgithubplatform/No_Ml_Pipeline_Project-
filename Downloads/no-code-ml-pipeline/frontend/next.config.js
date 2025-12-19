/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Next.js 16 optimizations
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },

    // Environment variables
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    },

    // API rewrites
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/api/v1/:path*`,
            },
        ];
    },

    // Performance optimizations
    poweredByHeader: false,
    compress: true,

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [],
    },
};

export default nextConfig;
