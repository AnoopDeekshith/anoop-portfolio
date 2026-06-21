import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["gsap", "framer-motion"],
  },
};

export default nextConfig;
