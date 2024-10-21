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
} from "lucide-react";
import { motion } from "framer-motion";

const softSkills = [
	{
		title: "Effective Communication",
		icon: MessageSquare,
		description: "Clarifying complex technical concepts for diverse audiences.",
	},
	{
		title: "Teamwork",
		icon: Users,
		description: "Efficient collaboration in dynamic development environments.",
	},
	{
		title: "Problem-Solving",
		icon: Lightbulb,
		description: "Analytical approach in tackling technical challenges.",
	},
	{
		title: "Adaptability",
		icon: RefreshCw,
		description: "Quick adaptation to new technologies and methodologies.",
	},
	{
		title: "Continuous Learning",
		icon: BookOpen,
		description: "Commitment to self-improvement and skill updating.",
	},
	{
		title: "Stress Management",
		icon: Timer,
		description: "High performance under pressure with tight deadlines.",
	},
	{
		title: "Attention to Detail",
		icon: Crosshair,
		description: "Precision in code development and verification.",
	},
	{
		title: "Creativity and Innovation",
		icon: Sparkles,
		description: "Developing novel solutions and process enhancements.",
	},
];

const SoftSkillsSection: React.FC = () => {
	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				My Soft Skills
				<ShowInfo
					title={"My Soft Skills"}
					description={"This section provides information about my soft skills"}
				/>
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{softSkills.map((skill, index) => (
					<motion.div
						key={index}
						className="h-full"
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<Card className="flex flex-col h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<skill.icon className="h-6 w-6" />
									{skill.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm text-muted-foreground">{skill.description}</p>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</Section>
	);
};

export default SoftSkillsSection;
