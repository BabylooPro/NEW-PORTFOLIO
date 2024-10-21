"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Palette, Server, Cog, Layers } from "lucide-react";
import { skills } from "@/features/landing/data/skills";
import { motion } from "framer-motion";

const currentYear = new Date().getFullYear();

const calculateYearsOfExperience = (skillName: string) => {
	const firstYear = skills.find((yearSkills) =>
		yearSkills.skills.some((skill) =>
			skill.name.toLowerCase().includes(skillName.toLowerCase())
		)
	)?.year;
	return firstYear ? currentYear - parseInt(firstYear) : 0;
};

const expertises = [
	{
		title: "Software Engineering",
		years: calculateYearsOfExperience("c#"),
		icon: Code,
		description: "Designing and implementing efficient, scalable software solutions",
	},
	{
		title: "Backend Development",
		years: calculateYearsOfExperience(".net"),
		icon: Server,
		description: "Building robust server-side applications and APIs",
	},
	{
		title: "Frontend Development",
		years: calculateYearsOfExperience("html"),
		icon: Palette,
		description: "Creating responsive and interactive user interfaces",
	},
	{
		title: "FullStack Development",
		years: Math.min(calculateYearsOfExperience("node.js")),
		icon: Layers,
		description: "Integrating frontend and backend for complete web applications",
	},
	{
		title: "DevOps",
		years: calculateYearsOfExperience("Google Cloud Platform"),
		icon: Cog,
		description: "Streamlining development and deployment processes",
	},
	{
		title: "Design",
		years: calculateYearsOfExperience("figma"),
		icon: Palette,
		description: "Crafting visually appealing and user-friendly interfaces",
	},
];

const ExpertiseSection: React.FC = () => {
	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				My Expertise
				<ShowInfo
					title={"My Expertise"}
					description={"This section provides information about my expertise"}
				/>
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{expertises.map((expertise, index) => (
					<motion.div
						key={index}
						className="h-full"
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<Card className="flex flex-col h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<expertise.icon className="h-6 w-6" />
									{expertise.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="mb-2">{expertise.years} years of experience</p>
								<p className="text-sm text-muted-foreground">
									{expertise.description}
								</p>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</Section>
	);
};

export default ExpertiseSection;
