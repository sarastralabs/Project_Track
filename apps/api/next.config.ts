import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages that ship TypeScript source.
  transpilePackages: ["@sarastra/shared", "@sarastra/db"],
};

export default nextConfig;
