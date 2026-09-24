import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // build liviano para Docker / Easypanel
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
