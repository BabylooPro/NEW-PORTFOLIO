import type { Metadata } from "next";
import "./styles/globals.css";
import { ThemeProvider } from "@/features/themes/ThemeProvider";

export const metadata: Metadata = {
	title: "Portfolio - Max Remy Dev",
	description: "Portfolio - Max Remy Dev",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
