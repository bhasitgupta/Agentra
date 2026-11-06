import type { NextConfig } from 'next';

process.env.NEXT_TELEMETRY_DISABLED = '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@rainbow-me/rainbowkit',
      'viem',
      'wagmi',
      'three',
      'framer-motion',
    ],
  },
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      '@x402/evm/upto/client': false,
      '@x402/evm/exact/client': false,
      '@x402/core/client': false,
      '@x402/svm/exact/client': false,
      '@x402/evm': false,
      '@react-native-async-storage/async-storage': false,
    };
    config.externals = config.externals || [];
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@x402\//,
      })
    );
    return config;
  },
};

export default nextConfig;
