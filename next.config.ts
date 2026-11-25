import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hay otro package-lock.json en la carpeta de Alma Bruta; fijamos la raíz aquí.
  turbopack: { root: __dirname },
};

export default nextConfig;
