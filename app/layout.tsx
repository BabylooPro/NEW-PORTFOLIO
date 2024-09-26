import type { Metadata } from "next";
import "./styles/globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Portfolio - Max Remy Dev",
	description: "Portfolio - Max Remy Dev",
};

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// const quicksand = Quicksand({
// 	subsets: ["latin"],
// 	weight: ["300", "400", "500", "600", "700"],
// });

// const nunito = Nunito({
// 	subsets: ["latin"],
// 	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
// });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn(poppins.className, "h-full")}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
