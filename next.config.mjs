/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		GIT_HUB_ACCESS_TOKEN: process.env.GIT_HUB_ACCESS_TOKEN,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
	},
	images: {
		domains: ["avatars.githubusercontent.com", "cdnjs.cloudflare.com"],
	},
	// compiler: {
	// 	...(process.env.NODE_ENV === "production" && {
	// 		removeConsole: {
	// 			exclude: ["error", "warn"],
	// 		},
	// 	}),
	// },
};

export default nextConfig;
