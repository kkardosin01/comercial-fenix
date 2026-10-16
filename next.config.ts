import type { NextConfig } from "next";
import { CABECALHOS_SEGURANCA, montarCsp } from "./src/lib/seguranca/csp";

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabase
      ? [{ protocol: "https", hostname: supabase.hostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  experimental: {
    serverActions: {
      // Uploads de logo no painel (até 2 MB). O formulário público limita a 32 KB no próprio action.
      bodySizeLimit: "3mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: CABECALHOS_SEGURANCA },
      // CSP estática para o site público; o /admin recebe CSP com nonce no proxy.
      { source: "/((?!admin).*)", headers: [{ key: "Content-Security-Policy", value: montarCsp() }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
