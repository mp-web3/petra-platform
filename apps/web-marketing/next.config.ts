import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@chakra-ui/react', '@petra/types', '@petra/utils', '@petra/api-client'],
    reactStrictMode: true,
};

export default nextConfig;

