import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "https://credentialsai.com.au/privacy",
        permanent: true,
      },
    ];
  },
  // Force short CDN cache during deploy window, then relax
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, stale-while-revalidate=300" },
        ],
      },
    ];
  },
};

export default nextConfig;
