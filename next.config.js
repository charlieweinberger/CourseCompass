/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile pictures
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com", // Gravatar (used by some Auth0 connections)
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub profile pictures
      },
    ],
  },
};

module.exports = nextConfig;
