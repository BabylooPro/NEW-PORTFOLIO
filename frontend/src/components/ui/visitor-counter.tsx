"use client";

import { useEffect, useState } from "react";
import { Card } from "./card";
import { Eye } from "lucide-react";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { UsersIcon } from "../decoration/icons/users";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type VisitorHistory = {
    count: number;
    timestamp: string;
}

export const VisitorCounter = () => {
    const [mounted, setMounted] = useState(false);
    const [visitorCount, setVisitorCount] = useState<number>(0);
    const [history, setHistory] = useState<VisitorHistory[]>([]);
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
                setHistory(data?.data?.attributes?.history || []);

                // CALCULATE DELTA FOR LAST 24H
                const now = new Date();
                const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

                // FILTER HISTORY FOR LAST 24H
                const last24hEntries = (data?.data?.attributes?.history || []).filter((entry: VisitorHistory) =>
                    new Date(entry.timestamp) >= last24h
                );

                // CALCULATE DELTA FOR LAST 24H
                if (last24hEntries.length > 0) {
                    const lastCount = last24hEntries[last24hEntries.length - 1].count;
                    const firstCount = (data?.data?.attributes?.history || [])
                        .find((entry: VisitorHistory) => new Date(entry.timestamp) < last24h)?.count ||
                        last24hEntries[0].count;

                    setDelta(lastCount - firstCount);
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

                    {history.length > 0 && (
                        <div className="h-6 w-12">
                            <AreaChart
                                data={history}
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
                        </div>
                    )}
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Visitor Analytics</DialogTitle>
                </DialogHeader>
                <div className="h-[300px] w-full py-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={history}
                            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                        >
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                                formatter={(value) => [value.toLocaleString(), "Visitors"]}
                                contentStyle={{
                                    backgroundColor: "rgb(24, 24, 27)",
                                    border: "1px solid rgb(39, 39, 42)",
                                    color: "rgb(250, 250, 250)",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                                    borderRadius: "0.5rem",
                                    padding: "0.75rem"
                                }}
                                itemStyle={{
                                    color: "rgb(250, 250, 250)"
                                }}
                                labelStyle={{
                                    color: "rgb(250, 250, 250)"
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="rgb(16, 185, 129)"
                                fill="rgb(16, 185, 129)"
                                fillOpacity={0.2}
                                strokeWidth={2}
                                dot
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
};

