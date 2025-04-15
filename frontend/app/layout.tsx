import type { Metadata } from "next";
import "./styles/globals.css";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { ScrollToTop } from "./components/ScrollToTop";

export const metadata: Metadata = {
    title: {
        template: "%s | Max Remy Dev",
        default: "Max Remy Dev",
    },
    description: "Max Remy Portfolio Website",
};

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn(montserrat.className, "h-full")} suppressHydrationWarning>
                <ScrollToTop />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
