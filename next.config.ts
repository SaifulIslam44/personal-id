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
  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },


  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;


// ID: 200442581
// ID: 2004415852
// ID: 2004412548