import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // forces Turbopack to treat the frontend folder as the root
  },
};

export default nextConfig;
