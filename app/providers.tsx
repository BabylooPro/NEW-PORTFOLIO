"use client";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/features/themes/ThemeProvider";
import { WakaTimeProvider } from "@/utils/WakaTimeProvider";

export type ProvidersProps = {
	children: React.ReactNode;
};

export const Providers = (props: ProvidersProps) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<Toaster showTestToast={false} />
			<WakaTimeProvider>{props.children}</WakaTimeProvider>
		</ThemeProvider>
	);
};
