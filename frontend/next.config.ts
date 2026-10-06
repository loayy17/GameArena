import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: apiUrl
      ? [{ protocol: new URL(apiUrl).protocol.replace(":", "") as "http" | "https", hostname: new URL(apiUrl).hostname }]
      : undefined,
  },
};

export default nextConfig;
