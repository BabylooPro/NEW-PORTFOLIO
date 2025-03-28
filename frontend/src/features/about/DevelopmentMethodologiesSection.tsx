"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GitBranch,
    Building,
    Cog,
    GitPullRequest,
    Users,
    TestTube,
    Smartphone,
    Server,
    LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useDevelopmentMethodologiesSection } from "./hooks/useDevelopmentMethodologiesSection";
import { Skeleton } from "@/components/ui/skeleton";

// ICON MAPPING
const ICONS: Record<string, LucideIcon> = {
    GitBranch,
    Building,
    Cog,
    GitPullRequest,
    Users,
    TestTube,
    Smartphone,
    Server,
};

export interface Methodology {
    id: number;
    title: string;
    icon: keyof typeof ICONS;
    description: string;
}

export interface SectionData {
    data: {
        id: number;
        title: string;
        titleDescription: string;
        methodologies: Methodology[];
    };
}

const DevelopmentMethodologiesSkeleton: React.FC<{
    status?: 'loading' | 'error' | 'no-data';
}> = ({ status }) => {
    const getStatusContent = () => {
        switch (status) {
            case 'error':
                return (
                    <div className="flex items-center gap-2 text-red-500">
                        <Skeleton className="h-8 w-8 bg-red-200" />
                        <span>Error loading methodologies section. Please try again later.</span>
                    </div>
                );
            case 'no-data':
                return (
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Skeleton className="h-8 w-8 bg-yellow-200" />
                        <span>No data available at the moment.</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Section>
            <div className="space-y-4">
                {/* TITLE WITH STATUS */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            Development Methodologies
                            <ShowInfo
                                title="Development Methodologies"
                            />
                        </div>
                    </h2>
                    {getStatusContent()}
                </div>

                {/* METHODOLOGIES CARDS SKELETON */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-6" />
                                    <Skeleton className="h-6 w-32" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, j) => (
                                        <Skeleton key={j} className="h-4 w-full" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Section>
    );
};

const DevelopmentMethodologiesSection: React.FC = () => {
    const { data: methodologiesData, isLoading, error } = useDevelopmentMethodologiesSection();

    if (isLoading) {
        return <DevelopmentMethodologiesSkeleton status="loading" />;
    }

    if (error) {
        return <DevelopmentMethodologiesSkeleton status="error" />;
    }

    if (!methodologiesData?.data) {
        console.error('No methodologies data found:', methodologiesData);
        return <DevelopmentMethodologiesSkeleton status="no-data" />;
    }

    // LOG THE ACTUAL DATA STRUCTURE FOR DEBUGGING
    console.log('Methodologies data:', methodologiesData);

    const { title, titleDescription, methodologies } = methodologiesData.data;

    if (!methodologies || !Array.isArray(methodologies) || methodologies.length === 0) {
        console.error('No methodologies found in data:', methodologiesData.data);
        return <DevelopmentMethodologiesSkeleton status="no-data" />;
    }

    return (
        <Section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                {title}
                <ShowInfo
                    title={title}
                    description={titleDescription}
                />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {methodologies.map((methodology) => {
                    const Icon = ICONS[methodology.icon];

                    return (
                        <motion.div
                            key={methodology.id}
                            className="h-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card className="flex flex-col h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {Icon && <Icon className="h-6 w-6" />}
                                        {methodology.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">
                                        {methodology.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
};

export default DevelopmentMethodologiesSection;
