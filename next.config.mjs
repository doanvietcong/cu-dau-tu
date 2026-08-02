/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages
  // App is fully client-side (state in localStorage), so no server runtime needed
  output: "export",
  images: {
    // Disable image optimization (not needed for static export)
    unoptimized: true,
  },
  trailingSlash: true, // Cloudflare Pages serves cleaner URLs with trailing slashes
};

export default nextConfig;
