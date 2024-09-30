/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["avatars.githubusercontent.com", "cdnjs.cloudflare.com"],
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
