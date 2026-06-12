import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ảnh demo là URL Unsplash bên ngoài — bỏ qua image optimizer để tải
    // trực tiếp, tránh optimizer timeout làm vỡ ảnh trong môi trường dev.
    unoptimized: true,
    remotePatterns: [
      // Ảnh demo lấy từ Unsplash
      { protocol: "https", hostname: "images.unsplash.com" },
      // Ảnh phòng/vị trí upload phục vụ tĩnh từ backend NestJS
      { protocol: "http", hostname: "localhost", port: "3099" },
    ],
  },
};

export default nextConfig;
