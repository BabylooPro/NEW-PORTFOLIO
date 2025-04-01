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
