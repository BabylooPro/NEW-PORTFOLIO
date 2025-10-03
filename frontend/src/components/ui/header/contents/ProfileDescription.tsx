'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileDescriptionProps {
    isSmallScreen: boolean;
    isCompact: boolean;
    profile: any;
}

export const ProfileDescription = ({
    isSmallScreen,
    isCompact,
    profile,
}: ProfileDescriptionProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const titles = useMemo(() => {
        return Array.isArray(profile?.titles)
            ? [...profile.titles].sort((a: any, b: any) => a.order - b.order)
            : [];
    }, [profile]);

    const firstTitle = titles?.[0]?.title ?? "";
    const secondTitle = titles?.[1]?.title ?? "";

    return (
        <div className="text-left">
            <h1 className="text-lg sm:text-xl font-semibold" suppressHydrationWarning>
                {mounted ? profile?.name ?? "" : ""}
            </h1>
            {isSmallScreen ? (
                <div className="text-neutral-500 relative">
                    <div className="h-4 overflow-hidden">
                        {mounted ? (
                            <div className="flex flex-col">
                                <span className="h-4 flex items-center animate-show-hide-first">
                                    {firstTitle}
                                </span>
                                <span className="h-4 flex items-center absolute top-0 left-0 animate-show-hide-second">
                                    {secondTitle}
                                </span>
                            </div>
                        ) : (
                            <div className="h-4" />
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-neutral-500 hidden sm:block relative">
                    <div
                        className={cn(
                            "absolute inset-0 overflow-hidden h-8",
                            !isCompact ? "hidden" : "block"
                        )}
                    >
                        {mounted && (
                            <>
                                <span className="absolute inset-0 flex items-start justify-start animate-show-hide-first">
                                    {firstTitle}
                                </span>
                                <span className="absolute inset-0 flex items-start justify-start animate-show-hide-second">
                                    {secondTitle}
                                </span>
                            </>
                        )}
                    </div>

                    <span
                        className={cn(
                            "transition-opacity duration-200 ease-in-out",
                            isCompact ? "opacity-0 invisible" : "opacity-100"
                        )}
                        suppressHydrationWarning
                    >
                        {mounted ? (
                            <>
                                {firstTitle} | {secondTitle}
                            </>
                        ) : (
                            ""
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}; 
