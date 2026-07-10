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
};

export default nextConfig;
