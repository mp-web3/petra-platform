import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@chakra-ui/react', '@petra/types', '@petra/utils', '@petra/api-client'],
    reactStrictMode: true,

    // Simple webpack optimization to reduce cache warnings
    webpack: (config) => {
        config.cache = {
            type: 'filesystem',
            compression: 'gzip',
        };
        return config;
    },

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    },
};

export default nextConfig;

