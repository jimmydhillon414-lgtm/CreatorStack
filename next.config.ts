import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mixkit-media/:path*",
        destination: "https://assets.mixkit.co/:path*",
        // Inject required headers into the proxy request to bypass Mixkit 403 block
        has: [
          {
            type: "header",
            key: "user-agent",
          },
        ],
      },
    ];
  },
};

export default nextConfig;