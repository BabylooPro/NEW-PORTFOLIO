import React, { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header/Header";
import { ShowCalendarIndex } from "@/features/show-calendar";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Calendar",
    description: "My Calendar Schedule",
};

// FORCE DYNAMIC CACHE
export const dynamic = "force-dynamic";

// SKELETON COMPONENT FOR LOADING STATE
const ShowCalendarSkeleton = () => (
    <Skeleton className="w-full max-w-[1200px] h-[600px] mx-auto rounded-2xl" />
);

export default function ShowCalendar() {
    return (
        <div className="flex flex-col gap-4">
            <div className="h-16 max-sm:h-12" />
            <Header />
            <Suspense fallback={<ShowCalendarSkeleton />}>
                <ShowCalendarIndex />
            </Suspense>
        </div>
    );
}
