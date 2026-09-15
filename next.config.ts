import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/lp", destination: "/", permanent: true },
      { source: "/lp/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
