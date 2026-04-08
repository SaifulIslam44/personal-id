// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   webpack: (config) => {
//     config.externals.push("pino-pretty", "lokijs", "encoding");
//     return config;
//   },
// };

// export default nextConfig;







import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔴 Image Optimization বন্ধ করা এবং ডোমেইন পারমিশন দেওয়া
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },

  // আপনার আগের Webpack কনফিগারেশন
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;