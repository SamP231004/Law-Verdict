/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongodb'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongodb: false,
        'mongodb-client-encryption': false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'child_process': false,
        'timers/promises': false,
        http: false,
        https: false,
        zlib: false,
        stream: false,
      };
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
};

module.exports = nextConfig;
