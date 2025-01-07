"use client";

import { useEffect, useState } from "react";
import { Card } from "./card";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { UsersIcon } from "../decoration/icons/users";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip } from "./chart";

type VisitorHistory = {
    count: number;
    timestamp: string;
}

const chartConfig = {
    count: {
        label: "Visitors",
        theme: {
            light: "rgb(16, 185, 129)",
            dark: "rgb(16, 185, 129)"
        }
    },
} as const;

export const VisitorCounter = () => {
    const [mounted, setMounted] = useState(false);
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [processedHistory, setProcessedHistory] = useState<VisitorHistory[]>([]);
    const [delta, setDelta] = useState<number>(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const incrementAndFetchCount = async () => {
            try {
                // CHECK IF USER HAS ALREADY VISITED IN LAST HOUR
                const lastVisit = sessionStorage.getItem('lastVisit');
                const shouldIncrement = !lastVisit;

                if (shouldIncrement) {
                    // SET LAST VISIT WITH 1 HOUR EXPIRATION
                    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 HOUR
                    sessionStorage.setItem('lastVisit', expirationTime.toString());

                    await fetch("/api/visitor", {
                        method: "POST",
                    });
                }

                const response = await fetch("/api/visitor");
                const data = await response.json();
                setVisitorCount(data?.data?.attributes?.count || 0);
                const rawHistory = data?.data?.attributes?.history || [];

                // GET CURRENT TIME AND WINDOW
                const currentTime = new Date();
                currentTime.setMinutes(0, 0, 0); // NORMALIZE TO HOUR
                const oldestDate = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
                oldestDate.setMinutes(0, 0, 0); // NORMALIZE TO HOUR

                // NORMALIZE AND GROUP VISITS BY HOUR
                const hourlyVisits = rawHistory.reduce((acc: Map<number, number>, curr: VisitorHistory) => {
                    const date = new Date(curr.timestamp);
                    if (isNaN(date.getTime()) || date < oldestDate || date > currentTime) return acc;

                    const hourTimestamp = new Date(date).setMinutes(0, 0, 0);
                    return acc.set(hourTimestamp, (acc.get(hourTimestamp) || 0) + 1);
                }, new Map<number, number>());

                // CREATE HOURLY TIMELINE
                const timeline: VisitorHistory[] = [];
                for (let time = oldestDate.getTime(); time <= currentTime.getTime(); time += 3600000) {
                    timeline.push({
                        timestamp: new Date(time).toISOString(),
                        count: hourlyVisits.get(time) || 0
                    });
                }

                // REMOVE EMPTY EDGES AND KEEP ONLY RELEVANT ZERO POINTS
                const nonZeroIndices = timeline
                    .map((entry, index) => entry.count > 0 ? index : -1)
                    .filter(index => index !== -1);

                if (nonZeroIndices.length > 0) {
                    const start = Math.max(0, Math.min(...nonZeroIndices) - 1);
                    const end = Math.min(timeline.length, Math.max(...nonZeroIndices) + 2);

                    const processedData = timeline
                        .slice(start, end)
                        .filter(entry => entry.count > 0);

                    setProcessedHistory(processedData);
                } else {
                    setProcessedHistory([]);
                }

                // CALCULATE DELTA FOR LAST 24H
                const last24h = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

                // FILTER HISTORY FOR LAST 24H
                const last24hEntries = rawHistory.filter((entry: VisitorHistory) =>
                    new Date(entry.timestamp) >= last24h
                );

                // CALCULATE DELTA FOR LAST 24H
                if (last24hEntries.length > 0) {
                    setDelta(last24hEntries.length);
                }
            } catch (error) {
                console.error("Failed to update visitor count:", error);
            }
        };

        setMounted(true);
        incrementAndFetchCount();
    }, []);

    if (!mounted) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex items-center gap-2">
                        <UsersIcon className="hover:bg-transparent size-10" isHovered={isHovered} />
                        <span className="text-sm font-medium">
                            You are the {visitorCount.toLocaleString()}th visitor !
                        </span>
                        {delta > 0 && (
                            <span className="text-sm font-medium text-emerald-500 mr-2">
                                (+{delta})
                            </span>
                        )}
                    </div>

                    {processedHistory.length > 0 && (
                        <div className="h-6 w-12">
                            <ChartContainer config={chartConfig} className="[&_.recharts-dot]:fill-[--color-count] [&_.recharts-dot]:stroke-[--color-count]">
                                <AreaChart
                                    data={processedHistory}
                                    width={48}
                                    height={24}
                                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                                >
                                    <Area
                                        type="natural"
                                        dataKey="count"
                                        stroke="rgb(16, 185, 129)"
                                        fill="rgb(16, 185, 129)"
                                        fillOpacity={0.2}
                                        strokeWidth={1}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    )}
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-2">
                    <DialogTitle>Visitor Analytics</DialogTitle>
                    <DialogDescription>
                        View the number of visitors over time
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full aspect-[2/1] min-w-0">
                    <ChartContainer config={chartConfig} className="[&_.recharts-dot]:fill-[--color-count] [&_.recharts-dot]:stroke-[--color-count] [&_.recharts-responsive-container]:!w-[99%]">
                        <AreaChart
                            data={processedHistory}
                        // margin={{ top: 5, right: 40, bottom: 25, left: 15 }}
                        >
                            <XAxis
                                dataKey="timestamp"
                                height={30}
                                interval={5}
                                tickMargin={5}
                                tickFormatter={(timestamp) => {
                                    try {
                                        const date = new Date(timestamp);
                                        return new Intl.DateTimeFormat('fr-CH', {
                                            hour: 'numeric' as const,
                                            minute: '2-digit' as const,
                                            hour12: true
                                        }).format(date);
                                    } catch {
                                        console.warn('Error formatting date:', timestamp);
                                        return 'Invalid Date';
                                    }
                                }}
                            />
                            <YAxis
                                allowDecimals={false}
                                domain={[0, 'auto']}
                                minTickGap={1}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;

                                    const tooltipLabel = (
                                        <div className="font-medium">
                                            {new Intl.DateTimeFormat('fr-CH', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            }).format(new Date(payload[0].payload.timestamp))}
                                        </div>
                                    );

                                    return (
                                        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                                            {tooltipLabel}
                                            <div className="grid gap-1.5">
                                                {payload.map((item, index) => {
                                                    const indicatorColor = "rgb(16, 185, 129)";
                                                    return (
                                                        <div key={index} className="flex w-full items-center gap-2">
                                                            <div
                                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]"
                                                                style={{
                                                                    "--color-bg": indicatorColor,
                                                                    "--color-border": indicatorColor,
                                                                } as React.CSSProperties}
                                                            />
                                                            <div className="flex flex-1 items-center justify-between leading-none">
                                                                <span className="text-muted-foreground">
                                                                    {chartConfig[item.name as keyof typeof chartConfig]?.label}
                                                                </span>
                                                                <span className="font-mono font-medium tabular-nums text-foreground">
                                                                    {item.value}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                name="count"
                                stroke="rgb(16, 185, 129)"
                                fill="rgb(16, 185, 129)"
                                fillOpacity={0.2}
                                strokeWidth={2}
                                connectNulls
                                isAnimationActive={false}
                                baseValue={0}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
};

