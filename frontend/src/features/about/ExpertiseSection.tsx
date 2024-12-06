"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Server, Palette, Layers, Cog, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useExpertiseSection } from "./hooks/useExpertiseSection";
import { useSkills } from "@/features/landing/utils/expertise/useSkills";
import { Skill } from "@/features/landing/utils/expertise/types";
import { Skeleton } from "@/components/ui/skeleton";

interface Expertise {
	id: number;
	title: string;
	description: string;
	icon: keyof typeof ICONS;
	skillIdentifier: string;
}

interface ExpertiseSkill extends Skill {
	skillIdentifier: string;
}

// TYPE GUARD
function isExpertiseSkill(skill: any): skill is ExpertiseSkill {
	return 'skillIdentifier' in skill;
}

// ICON MAPPING
const ICONS: Record<string, LucideIcon> = {
	Code,
	Server,
	Palette,
	Layers,
	Cog,
};

const ExpertiseSectionSkeleton: React.FC<{
	status?: 'loading' | 'error' | 'no-data';
}> = ({ status }) => {
	const getStatusContent = () => {
		switch (status) {
			case 'error':
				return (
					<div className="flex items-center gap-2 text-red-500">
						<Skeleton className="h-8 w-8 bg-red-200" />
						<span>Error loading expertise section. Please try again later.</span>
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
							Expertise
							<ShowInfo
								title="Expertise"
							/>
						</div>
					</h2>
					{getStatusContent()}
				</div>

				{/* EXPERTISE CARDS SKELETON */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(6)].map((_, i) => (
						<Card key={i} className="flex flex-col h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Skeleton className="h-6 w-6" />
									<Skeleton className="h-6 w-32" />
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow space-y-4">
								<div className="space-y-2">
									{[...Array(3)].map((_, j) => (
										<Skeleton key={j} className="h-4 w-full" />
									))}
								</div>
								<div className="flex flex-wrap gap-2">
									{[...Array(4)].map((_, j) => (
										<Skeleton key={j} className="h-8 w-20" />
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

const ExpertiseSection: React.FC = () => {
	const { data: expertiseData, isLoading, error } = useExpertiseSection();
	const { skills } = useSkills();

	if (isLoading) {
		return <ExpertiseSectionSkeleton status="loading" />;
	}

	if (error) {
		return <ExpertiseSectionSkeleton status="error" />;
	}

	if (!expertiseData?.data) {
		return <ExpertiseSectionSkeleton status="no-data" />;
	}

	const { data } = expertiseData;

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
				{data.expertises.map((expertise: Expertise) => {
					const Icon = ICONS[expertise.icon];
					const relatedSkills = skills
						.flatMap((yearSkills) =>
							yearSkills.skills.filter(
								(skill) => isExpertiseSkill(skill) && skill.skillIdentifier === expertise.skillIdentifier
							)
						)
						.sort((a, b) => {
							return (b.star ? 1 : 0) - (a.star ? 1 : 0);
						});

					return (
						<motion.div
							key={expertise.id}
							className="h-full"
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Card className="flex flex-col h-full">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Icon className="h-6 w-6" />
										{expertise.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="flex-grow">
									<p className="text-sm text-muted-foreground mb-4">
										{expertise.description}
									</p>
									<div className="flex flex-wrap gap-2">
										{relatedSkills.map((skill) => (
											<ShowInfo key={skill.id} wrapMode>
												<ShowInfo.Content>
													<span className="text-sm px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
														{skill.name}
													</span>
												</ShowInfo.Content>
												<ShowInfo.Title>{skill.name}</ShowInfo.Title>
												<ShowInfo.Description>
													{skill.description}
												</ShowInfo.Description>
											</ShowInfo>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>
		</Section>
	);
};

export default ExpertiseSection;
