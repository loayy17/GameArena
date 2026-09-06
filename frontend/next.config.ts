import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is required (see .env.example at the repository root)");
const apiOrigin = new URL(apiUrl);

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: apiOrigin.protocol.replace(":", "") as "http" | "https", hostname: apiOrigin.hostname }],
  },
};

export default nextConfig;
