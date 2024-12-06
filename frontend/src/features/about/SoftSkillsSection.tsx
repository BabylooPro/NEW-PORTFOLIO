"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	MessageSquare,
	Users,
	Lightbulb,
	RefreshCw,
	BookOpen,
	Timer,
	Crosshair,
	Sparkles,
	LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useSoftSkillsSection } from "./hooks/useSoftSkillsSection";
import { Skeleton } from "@/components/ui/skeleton";

// ICON MAPPING
const ICONS: Record<string, LucideIcon> = {
	MessageSquare,
	Users,
	Lightbulb,
	RefreshCw,
	BookOpen,
	Timer,
	Crosshair,
	Sparkles,
};

const SoftSkillsSkeleton: React.FC<{
	status?: 'loading' | 'error' | 'no-data';
}> = ({ status }) => {
	const getStatusContent = () => {
		switch (status) {
			case 'error':
				return (
					<div className="flex items-center gap-2 text-red-500">
						<Skeleton className="h-8 w-8 bg-red-200" />
						<span>Error loading soft skills section. Please try again later.</span>
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
							Soft Skills
							<ShowInfo
								title="Soft Skills"
							/>
						</div>
					</h2>
					{getStatusContent()}
				</div>

				{/* SOFT SKILLS CARDS SKELETON */}
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

const SoftSkillsSection: React.FC = () => {
	const { data: softSkillsData, isLoading, error } = useSoftSkillsSection();

	if (isLoading) {
		return <SoftSkillsSkeleton status="loading" />;
	}

	if (error) {
		return <SoftSkillsSkeleton status="error" />;
	}

	if (!softSkillsData?.data) {
		return <SoftSkillsSkeleton status="no-data" />;
	}

	const { data } = softSkillsData;

	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				{data.title}
				<ShowInfo
					title={data.title}
					description={data.titleDescription}
				/>
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.softSkills.map((skill: any) => {
					const Icon = ICONS[skill.icon];

					return (
						<motion.div
							key={skill.id}
							className="h-full"
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Card className="flex flex-col h-full">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Icon className="h-6 w-6" />
										{skill.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex-grow">
									<p className="text-sm text-muted-foreground">
										{skill.description}
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

export default SoftSkillsSection;
