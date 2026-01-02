/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GIT_HUB_ACCESS_TOKEN: process.env.GIT_HUB_ACCESS_TOKEN,
        CONTACTFORM_MINIMALAPI_URL: process.env.CONTACTFORM_MINIMALAPI_URL,
        CONTACTFORM_MINIMALAPI_KEY: process.env.CONTACTFORM_MINIMALAPI_KEY,
        WAKATIME_API_KEY: process.env.WAKATIME_API_KEY,
        COUNTRY_STATE_CITY_API_KEY: process.env.COUNTRY_STATE_CITY_API_KEY,
        STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
        STRAPI_API_URL: process.env.STRAPI_API_URL,
        NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    },
    images: {
        remotePatterns: [
            { hostname: "avatars.githubusercontent.com" },
            { hostname: "cdnjs.cloudflare.com" },
            { hostname: "localhost" },
            { hostname: "cms.maxremy.dev" },
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
