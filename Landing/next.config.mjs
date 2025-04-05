/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' https://admin.bestnewshub.com; frame-ancestors 'none'; script-src 'self'; object-src 'none';",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/proxy/:path*",
        destination: "https://admin.bestnewshub.com/v1/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
