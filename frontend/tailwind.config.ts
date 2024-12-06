import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				chart: {
					"1": "var(--chart-1)",
					"2": "var(--chart-2)",
					"3": "var(--chart-3)",
					"4": "var(--chart-4)",
					"5": "var(--chart-5)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				shine: {
					from: { backgroundPosition: "200% 0" },
					to: { backgroundPosition: "-200% 0" },
				},
				"show-hide-first": {
					"0%, 45%": { opacity: "1" },
					"50%, 95%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"show-hide-second": {
					"0%, 45%": { opacity: "0" },
					"50%, 95%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			},
			animation: {
				shine: "shine 8s ease-in-out infinite",
				"show-hide-first": "show-hide-first 30s infinite cubic-bezier(0.83, 0, 0.17, 1)",
				"show-hide-second": "show-hide-second 30s infinite cubic-bezier(0.83, 0, 0.17, 1)",
			},
			fontFamily: {
				"press-start": ["var(--font-press-start)"],
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'none',
						color: 'inherit',
						p: {
							margin: '0',
							padding: '0',
							lineHeight: '1.2',
						},
						'ul, ol': {
							margin: '0',
							padding: '0',
							paddingLeft: '1.2rem',
							lineHeight: '1.2',
						},
						li: {
							margin: '0',
							padding: '0',
							lineHeight: '1.2',
						},
						'> *': {
							margin: '0 !important',
							padding: '0',
						},
						h1: {
							margin: '0',
							lineHeight: '1.2',
						},
						h2: {
							margin: '0',
							lineHeight: '1.2',
						},
						h3: {
							margin: '0',
							lineHeight: '1.2',
						},
					},
				},
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography'),
	],
};
export default config;
