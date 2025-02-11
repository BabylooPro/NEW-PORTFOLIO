/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "./card";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceArea, ComposedChart } from "recharts";
import { UsersIcon } from "../decoration/icons/users";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import { Button } from "@/components/ui/button";

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

type ApiResponse = {
    data: {
        attributes: {
            count: number;
            history: Array<{
                timestamp: string;
                count: number;
            }>;
        };
    };
};

export const VisitorCounter = () => {
    const [mounted, setMounted] = useState(false);
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [processedHistory, setProcessedHistory] = useState<VisitorHistory[]>([]);
    const [dailyHistory, setDailyHistory] = useState<VisitorHistory[]>([]);
    const [delta, setDelta] = useState<number>(0);
    const [isHovered, setIsHovered] = useState(false);
    const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
    const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

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
                const data = await response.json() as ApiResponse;
                setVisitorCount(data?.data?.attributes?.count || 0);
                const rawHistory = data?.data?.attributes?.history || [];

                // GET CURRENT TIME AND WINDOW
                const currentTime = new Date();
                currentTime.setMinutes(0, 0, 0); // NORMALIZE TO HOUR

                // Prepare two different groupings: hourly for dialog and daily for card
                const visitsByHour = rawHistory.reduce((acc: Map<number, number>, curr: VisitorHistory) => {
                    if (typeof curr.timestamp !== 'string') return acc;

                    const date = new Date(curr.timestamp);
                    if (isNaN(date.getTime())) return acc;

                    const hourTimestamp = new Date(date).setMinutes(0, 0, 0);
                    return acc.set(hourTimestamp, (acc.get(hourTimestamp) || 0) + 1);
                }, new Map<number, number>());

                // Group by day for the mini chart
                const visitsByDay = rawHistory.reduce((acc: Map<number, number>, curr: VisitorHistory) => {
                    if (typeof curr.timestamp !== 'string') return acc;
                    const date = new Date(curr.timestamp);
                    if (isNaN(date.getTime())) return acc;
                    const dayTimestamp = new Date(date.setHours(0, 0, 0, 0)).getTime();
                    return acc.set(dayTimestamp, (acc.get(dayTimestamp) || 0) + 1);
                }, new Map<number, number>());

                // Create timeline for dialog chart (hourly)
                const sortedHourlyTimestamps = Array.from(visitsByHour.keys()).sort();
                const hourlyTimeline: VisitorHistory[] = sortedHourlyTimestamps.map(timestamp => ({
                    timestamp: new Date(timestamp).toISOString(),
                    count: visitsByHour.get(timestamp) || 0
                }));

                // Create timeline for mini chart (daily)
                const sortedDailyTimestamps = Array.from(visitsByDay.keys()).sort();
                const dailyTimeline: VisitorHistory[] = sortedDailyTimestamps.map(timestamp => ({
                    timestamp: new Date(timestamp).toISOString(),
                    count: visitsByDay.get(timestamp) || 0
                }));

                setProcessedHistory(hourlyTimeline);
                setDailyHistory(dailyTimeline);

                // CALCULATE DELTA FOR LAST 24H
                const last24h = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

                // FILTER HISTORY FOR LAST 24H
                const last24hEntries = rawHistory.filter((entry) => {
                    const entryDate = new Date(entry.timestamp);
                    return !isNaN(entryDate.getTime()) && entryDate >= last24h;
                });

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

    const zoomedHistory = useMemo(() => {
        // Si pas de zoom, utiliser l'historique journalier
        if (!startTime || !endTime) return dailyHistory;

        // Une fois zoomé, utiliser l'historique horaire
        return processedHistory.filter(
            (point) => point.timestamp >= startTime && point.timestamp <= endTime
        );
    }, [startTime, endTime, processedHistory, dailyHistory]);

    const handleMouseDown = (state: any) => {
        if (state?.activeLabel) {
            setRefAreaLeft(String(state.activeLabel));
            setIsSelecting(true);
        }
    };

    const handleMouseMove = (state: any) => {
        if (isSelecting && state?.activeLabel) {
            setRefAreaRight(String(state.activeLabel));
        }
    };

    const handleMouseUp = () => {
        if (refAreaLeft && refAreaRight) {
            const [left, right] = [refAreaLeft, refAreaRight].sort();
            setStartTime(left);
            setEndTime(right);
        }
        setRefAreaLeft(null);
        setRefAreaRight(null);
        setIsSelecting(false);
    };

    const handleReset = () => {
        setStartTime(null);
        setEndTime(null);
    };

    // Modifier le formatteur de date pour l'axe X en fonction du zoom
    const formatXAxisTick = (timestamp: string) => {
        const date = new Date(timestamp);
        // Si on est zoomé, afficher l'heure, sinon afficher la date
        return new Intl.DateTimeFormat('fr-CH', {
            ...(startTime && endTime
                ? { hour: 'numeric', minute: '2-digit' }
                : { month: 'numeric', day: 'numeric' }
            )
        }).format(date);
    };

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
                        <span className="text-sm font-medium mr-2">
                            You are the {visitorCount.toLocaleString()}th visitor !
                        </span>
                        {delta > 0 && (
                            <span className="text-sm font-medium text-emerald-500 mr-2">
                                (+{delta})
                            </span>
                        )}
                    </div>

                    {dailyHistory.length > 0 && (
                        <div className="h-6 w-12">
                            <ChartContainer config={chartConfig} className="[&_.recharts-dot]:fill-[--color-count] [&_.recharts-dot]:stroke-[--color-count]">
                                <AreaChart
                                    data={dailyHistory}
                                    width={48}
                                    height={24}
                                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                                >
                                    <Area
                                        type="monotone"
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
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden p-3 sm:p-6">
                <div className="flex flex-col h-full gap-4 sm:gap-6">
                    <DialogHeader>
                        <DialogTitle>Visitor Analytics</DialogTitle>
                        <DialogDescription>
                            Check how many people have visited my portfolio in 2025
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 w-full h-[280px] sm:h-[350px] lg:h-[400px]">
                        <ChartContainer config={chartConfig}>
                            <div className="flex h-full flex-col gap-3 sm:gap-4">
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={!startTime && !endTime}
                                        className="text-xs h-7 sm:h-8 sm:text-sm"
                                    >
                                        Reset Zoom
                                    </Button>
                                </div>
                                <div className="flex-1 -ml-2 sm:ml-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart
                                            data={zoomedHistory}
                                            margin={{ top: 5, right: 5, left: -5, bottom: 0, ...(!startTime && !endTime && { right: 10, left: 0 }) }}
                                            onMouseDown={handleMouseDown}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseUp}
                                            style={{
                                                cursor: isSelecting ? 'grabbing' : 'grab',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <defs>
                                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="timestamp"
                                                tickFormatter={formatXAxisTick}
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                minTickGap={30}
                                                interval="preserveEnd"
                                                dy={2}
                                                angle={0}
                                                textAnchor="middle"
                                                style={{
                                                    fontSize: '10px',
                                                    userSelect: 'none'
                                                }}
                                                className="text-[10px] sm:text-xs"
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                style={{
                                                    fontSize: '10px',
                                                    userSelect: 'none'
                                                }}
                                                className="text-[10px] sm:text-xs"
                                                width={25}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        className="w-[120px] sm:w-[180px] lg:w-[200px] font-mono text-[10px] sm:text-xs lg:text-sm"
                                                        nameKey="count"
                                                        labelFormatter={(value) => new Date(value).toLocaleString().replace(/:\d{2} /, ' ')}
                                                    />
                                                }
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                name="count"
                                                stroke="rgb(16, 185, 129)"
                                                fill="url(#colorVisitors)"
                                                fillOpacity={1}
                                                strokeWidth={2}
                                                isAnimationActive={false}
                                            />
                                            {refAreaLeft && refAreaRight && (
                                                <ReferenceArea
                                                    x1={refAreaLeft}
                                                    x2={refAreaRight}
                                                    strokeOpacity={0.3}
                                                    fill="hsl(var(--muted))"
                                                    fillOpacity={0.2}
                                                />
                                            )}
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </ChartContainer>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

