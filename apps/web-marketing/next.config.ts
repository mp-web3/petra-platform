import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@petra/ui', '@petra/types', '@petra/utils', '@petra/api-client'],
    reactStrictMode: true,
};

export default nextConfig;

