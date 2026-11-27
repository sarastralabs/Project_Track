import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sarastra/shared", "@sarastra/db"],
  serverExternalPackages: ["mongoose", "mongodb", "better-auth", "@better-auth/mongo-adapter"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;