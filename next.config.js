/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: false },
  experimental: {
    workerThreads: true,
    cpus: 1,
  },
};

module.exports = nextConfig;
