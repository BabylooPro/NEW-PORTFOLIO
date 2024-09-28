/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["avatars.githubusercontent.com", "cdnjs.cloudflare.com"],
	},
	compiler: {
		removeConsole: {
			exclude: ["error", "warn"],
		},
	},
};

export default nextConfig;
