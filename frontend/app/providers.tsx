"use client";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/features/themes/ThemeProvider";
import { WakaTimeProvider } from "@/utils/WakaTimeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type ProvidersProps = {
	children: React.ReactNode;
};

export const Providers = (props: ProvidersProps) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Toaster showTestToast={false} />
                <WakaTimeProvider>{props.children}</WakaTimeProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};
