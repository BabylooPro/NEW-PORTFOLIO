"use client";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/features/themes/ThemeProvider";
import { WakaTimeProvider } from "@/utils/WakaTimeProvider";
import { PropsWithChildren } from "react";

export type ProvidersProps = PropsWithChildren;

export const Providers = (props: ProvidersProps) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<Toaster />
			<WakaTimeProvider>{props.children}</WakaTimeProvider>
		</ThemeProvider>
	);
};
