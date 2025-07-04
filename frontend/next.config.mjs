/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GIT_HUB_ACCESS_TOKEN: process.env.GIT_HUB_ACCESS_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    WAKATIME_API_KEY: process.env.WAKATIME_API_KEY,
    COUNTRY_STATE_CITY_API_KEY: process.env.COUNTRY_STATE_CITY_API_KEY,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    STRAPI_API_URL: process.env.STRAPI_API_URL,
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "cdnjs.cloudflare.com",
      "localhost",
      "cms.maxremy.dev",
    ],
  },
  compiler: {
    ...(process.env.NODE_ENV === "production" && {
      removeConsole: {
        exclude: ["error", "warn"],
      },
    }),
  },
};

export default nextConfig;
