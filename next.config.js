/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACK_END_URL: process.env.BACK_END_URL,
    FRONT_END_URL: process.env.FRONT_END_URL,
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY,
  },
};

module.exports = nextConfig;
