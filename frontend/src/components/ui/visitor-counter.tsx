"use client";

import { useEffect, useState } from "react";
import { Card } from "./card";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { UsersIcon } from "../decoration/icons/users";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

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
                await fetch("/api/visitor", {
                    method: "POST",
                });

                const response = await fetch("/api/visitor");
                const data = await response.json();
                setVisitorCount(data?.data?.attributes?.count || 0);
                const rawHistory = data?.data?.attributes?.history || [];

                // PROCESS HISTORY TO GET VISITS PER HOUR
                const visitsPerHour = rawHistory.reduce((acc: { [key: string]: number }, curr: VisitorHistory) => {
                    try {
                        const date = new Date(curr.timestamp);
                        if (isNaN(date.getTime())) {
                            console.warn('Invalid date:', curr.timestamp);
                            return acc;
                        }
                        // FORMAT: YYYY-MM-DD HH
                        const hourKey = date.toISOString().slice(0, 13) + ':00:00.000Z';
                        acc[hourKey] = (acc[hourKey] || 0) + 1;
                    } catch {
                        console.warn('Error processing date:', curr.timestamp);
                    }
                    return acc;
                }, {});

                // CONVERT TO ARRAY FORMAT FOR CHART
                const processedData = Object.entries(visitsPerHour)
                    .map(([timestamp, count]) => ({
                        timestamp,
                        count: count as number
                    }))
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                console.log('Processed data:', processedData);
                setProcessedHistory(processedData);

                // CALCULATE DELTA FOR LAST 24H
                const now = new Date();
                const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

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
                            <ChartContainer config={chartConfig}>
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Visitor Analytics</DialogTitle>
                    <DialogDescription>
                        View the number of visitors over time
                    </DialogDescription>
                </DialogHeader>
                <div className="h-[300px] w-full py-4">
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            data={processedHistory}
                            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                        >
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => {
                                    try {
                                        return new Intl.DateTimeFormat('en-US', {
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        }).format(new Date(timestamp));
                                    } catch {
                                        console.warn('Error formatting date:', timestamp);
                                        return 'Invalid Date';
                                    }
                                }}
                            />
                            <YAxis />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;

                                    return (
                                        <ChartTooltipContent
                                            className="flex flex-col gap-2"
                                            indicator="dot"
                                            formatter={(value, name) => (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-muted-foreground">
                                                        {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                                    </span>
                                                    <span className="font-bold tabular-nums">
                                                        {value}
                                                    </span>
                                                </div>
                                            )}
                                            labelFormatter={(_, payload) => {
                                                if (!payload?.[0]?.payload?.timestamp) return 'Invalid Date';

                                                try {
                                                    return new Intl.DateTimeFormat('en-US', {
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    }).format(new Date(payload[0].payload.timestamp));
                                                } catch {
                                                    console.warn('Error formatting date:', payload[0].payload.timestamp);
                                                    return 'Invalid Date';
                                                }
                                            }}
                                            active={active}
                                            payload={payload}
                                        />
                                    );
                                }}
                            />
                            <Area
                                type="natural"
                                dataKey="count"
                                name="count"
                                stroke="rgb(16, 185, 129)"
                                fill="rgb(16, 185, 129)"
                                fillOpacity={0.2}
                                strokeWidth={2}
                                dot
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
};

