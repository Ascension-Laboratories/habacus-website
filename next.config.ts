import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // iOS fetches this to link habacus.co to the app (webcredentials, so
        // password managers save/suggest logins). It has no file extension, so
        // Next would otherwise serve it as application/octet-stream.
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
