/** @type {import('next').NextConfig} */
const { EnvironmentPlugin, webpack } = require("webpack");
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      new EnvironmentPlugin([
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
        "CLERK_SECRET_KEY",
      ])
    );
  },
};

export default nextConfig;
