import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Batasi file tracing ke folder aplikasi ini.
  // Tanpa ini, Next mendeteksi lockfile lain di direktori home dan memakai
  // folder home sebagai root workspace (warning "multiple lockfiles").
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
