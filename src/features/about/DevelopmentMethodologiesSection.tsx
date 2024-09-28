"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import ShowInfo from "@/components/ui/show-info";
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
} from "lucide-react";
import { motion } from "framer-motion";

const methodologies = [
	{
		title: "Agile/Scrum",
		icon: GitBranch,
		description: "Experience in Agile and Scrum project management.",
	},
	{
		title: "HERMES",
		icon: Building,
		description: "Knowledge of HERMES methodology for governmental projects.",
	},
	{
		title: "DevOps",
		icon: Cog,
		description: "Integrating DevOps practices to enhance collaboration.",
	},
	{
		title: "CI/CD",
		icon: GitPullRequest,
		description: "Mastery of continuous integration and deployment.",
	},
	{
		title: "Pair Programming",
		icon: Users,
		description: "Effective use for code quality.",
	},
	{
		title: "TDD/BDD",
		icon: TestTube,
		description: "Test-oriented software development.",
	},
	{
		title: "Responsive Web Design",
		icon: Smartphone,
		description: "Designing adaptive websites.",
	},
	{
		title: "RESTful API",
		icon: Server,
		description: "Design and development of RESTful APIs.",
	},
];

const DevelopmentMethodologiesSection: React.FC = () => {
	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				My Methodologies
				<ShowInfo
					title={"Development Methodologies"}
					description={
						"This section provides information about my development methodologies"
					}
				/>
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{methodologies.map((methodology, index) => (
					<motion.div
						key={index}
						className="h-full"
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<Card className="flex flex-col h-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<methodology.icon className="h-6 w-6" />
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
				))}
			</div>
		</Section>
	);
};

export default DevelopmentMethodologiesSection;
