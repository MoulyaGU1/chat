module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "images.clerk.dev"],
    unoptimized: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};
