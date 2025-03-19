"use client";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/features/themes/ThemeProvider";
import { WakaTimeProvider } from "@/utils/WakaTimeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export type ProvidersProps = {
    children: React.ReactNode;
};

export const Providers = (props: ProvidersProps) => {
    // CREATE A NEW QUERYCLIENT INSTANCE FOR EACH SESSION
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // GLOBAL DEFAULTS FOR ALL QUERIES
                staleTime: 60 * 1000, // 1 MINUTE
                gcTime: 60 * 60 * 1000, // 1 HOUR
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                retry: 1
            }
        }
    }));

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
