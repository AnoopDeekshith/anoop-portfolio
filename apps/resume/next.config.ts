import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared content lives in packages/content as raw TypeScript.
  transpilePackages: ["@anoop/content"],
};

export default nextConfig;
