"use client";

import { Section } from "@/components/ui/section";
import React from "react";
import { CodeXml, Heart, ThumbsDown, ThumbsUp, Star } from "lucide-react";
import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import "devicon";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import ShowInfo from "@/components/ui/show-info";
import ScrollIndicator from "@/components/ui/scroll-indicator";

interface SkillItem {
	name: string;
	icon?: string;
	description?: string;
	favorite?: boolean;
	star?: boolean;
	like?: boolean;
	unlike?: boolean;
}

interface ExperienceItem {
	date?: string;
	title: string;
	company?: string;
	description?: string;
	skills?: string[] | string;
}

interface UseExpertiseProps {
	title: string;
	items: (ExperienceItem | { year: string; skills: SkillItem[] })[];
	showCompany?: boolean;
	showSkills?: boolean;
	scrollHeight?: string;
	allColorIcon?: string;
	infoSkills?: string;
	infoExperiences?: string;
}

const isExperienceItem = (
	item: ExperienceItem | { year: string; skills: SkillItem[] }
): item is ExperienceItem => {
	return "title" in item;
};

const UseExpertise: React.FC<UseExpertiseProps> = ({
	title,
	items,
	showCompany = true,
	showSkills = true,
	scrollHeight = "h-[400px]",
	allColorIcon,
	infoSkills = "skills",
	infoExperiences = "experiences",
}) => {
	const scrollAreaRef = React.useRef<ScrollAreaRef>(null);

	const getRandomDuration = () => Math.random() * 4 + 1; // 1 TO 5 SECONDS
	const getRandomRotate = () => Math.random() * 20 - 10; // -10 TO 10 DEGREES
	const getRandomTranslateY = () => Math.random() * 5 - 2.5; // -2.5 TO 2.5 UNITS
	const getRandomScale = () => Math.random() * 0.2 + 0.8; // 0.8 TO 1.0 SCALE

	return (
		<TooltipProvider>
			<Section>
				<div className="relative mb-10">
					{/* TITLE */}
					<h2 className="text-2xl font-bold flex items-center -mb-5">
						{title}
						<ShowInfo
							title={title}
							description={
								title.toLowerCase().includes("skill")
									? `Here are some of my ${infoSkills}.`
									: `Check out my ${infoExperiences} professional.`
							}
							className="ml-2"
						/>
					</h2>

					{/* SCROLL INDICATOR */}
					<ScrollIndicator
						scrollAreaRef={scrollAreaRef}
						className="absolute left-1/2 transform -translate-x-1/2"
						position="top"
					/>
				</div>

				<ScrollArea showShadows ref={scrollAreaRef} className={scrollHeight}>
					{/* TIMELINE */}
					<ol className="m-4 relative border-l border-neutral-400 dark:border-neutral-600">
						{items.map((item) => (
							<li
								key={isExperienceItem(item) ? item.title : item.year}
								className="mb-10 ml-6"
							>
								{/* DOTE IN TIMELINE */}
								<div className="absolute size-4 -left-2 rounded-full border bg-neutral-200 border-neutral-100 dark:bg-neutral-700 dark:border-neutral-600" />

								{/* BADGE YEAR */}
								{isExperienceItem(item) ? (
									item.date && (
										<Badge className="mb-1 bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300">
											{item.date}
										</Badge>
									)
								) : (
									<Badge className="mb-1 bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300">
										{item.year}
									</Badge>
								)}

								{/* EXPERIENCE ITEM */}
								{isExperienceItem(item) ? (
									<>
										{/* TITLE */}
										<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
											{item.title}
										</h3>

										{/* COMPANY */}
										{showCompany && item.company && (
											<p className="text-base font-normal text-neutral-600 dark:text-neutral-400">
												{item.company}
											</p>
										)}

										{/* DESCRIPTION */}
										{item.description && (
											<p className="text-sm text-neutral-600 dark:text-neutral-400">
												{item.description}
											</p>
										)}

										{/* SKILLS */}
										{showSkills && item.skills && (
											<p className="text-sm font-light text-neutral-500 dark:text-neutral-500">
												{Array.isArray(item.skills)
													? item.skills.join(", ")
													: item.skills}
											</p>
										)}
									</>
								) : (
									<>
										{/* SKILLS ITEMS */}
										{item.skills.map((skill) => (
											<Tooltip key={skill.name} delayDuration={0}>
												<TooltipTrigger asChild>
													<div className="flex items-center space-x-2 my-4">
														{/* ICON */}
														{skill.icon ? (
															<i
																className={`devicon-${skill.icon.toLowerCase()}-plain colored`}
																style={{
																	fontSize: "24px",
																	color:
																		allColorIcon ?? undefined,
																}}
															></i>
														) : (
															// DEFAULT ICON IF NO ICON IS PROVIDED
															<CodeXml
																color={
																	allColorIcon ?? "currentColor"
																}
																size={24}
															/>
														)}

														{/* NAME */}
														<p
															className={`text-base font-normal text-neutral-700 dark:text-neutral-300 cursor-pointer ${
																skill.unlike
																	? "line-through text-neutral-500 dark:text-neutral-500"
																	: ""
															}`}
														>
															{skill.name}
														</p>

														{/* ICON FAVORITE */}
														{skill.favorite && (
															<motion.div
																animate={{
																	scale: [
																		getRandomScale(),
																		getRandomScale() + 0.2,
																		getRandomScale(),
																	],
																	rotate: [
																		getRandomRotate(),
																		getRandomRotate() + 20,
																		getRandomRotate(),
																	],
																}}
																transition={{
																	duration: getRandomDuration(),
																	repeat: Infinity,
																	repeatType: "reverse",
																}}
																className="mb-5"
															>
																<Heart
																	className="text-red-900"
																	size={18}
																	fill="red"
																/>
															</motion.div>
														)}

														{/* ICON STAR */}
														{skill.star && (
															<motion.div
																animate={{
																	scale: [
																		getRandomScale(),
																		getRandomScale() + 0.2,
																		getRandomScale(),
																	],
																	rotate: [
																		getRandomRotate(),
																		getRandomRotate() + 20,
																		getRandomRotate(),
																	],
																}}
																transition={{
																	duration: getRandomDuration(),
																	repeat: Infinity,
																	repeatType: "reverse",
																}}
																className="mb-5"
															>
																<Star
																	className="text-yellow-500"
																	size={18}
																	fill="yellow"
																/>
															</motion.div>
														)}

														{/* ICON LIKE */}
														{skill.like && (
															<motion.div
																animate={{
																	scale: [
																		getRandomScale(),
																		getRandomScale() + 0.2,
																		getRandomScale(),
																	],
																	translateY: [
																		getRandomTranslateY(),
																		getRandomTranslateY() - 5,
																		getRandomTranslateY(),
																	],
																}}
																transition={{
																	duration: getRandomDuration(),
																	repeat: Infinity,
																	repeatType: "reverse",
																}}
																className="mb-5"
															>
																<ThumbsUp
																	size={18}
																	className="text-blue-500"
																/>
															</motion.div>
														)}

														{/* ICON UNLIKE WITH LINE-THROUGH INDICATOR */}
														{skill.unlike && (
															<motion.div
																animate={{
																	scale: [
																		getRandomScale(),
																		getRandomScale() + 0.2,
																		getRandomScale(),
																	],
																	rotate: [
																		getRandomRotate(),
																		getRandomRotate() + 20,
																		getRandomRotate(),
																	],
																}}
																transition={{
																	duration: getRandomDuration(),
																	repeat: Infinity,
																	repeatType: "reverse",
																}}
																className="mb-5"
															>
																<ThumbsDown
																	size={18}
																	className="text-neutral-500"
																/>
															</motion.div>
														)}
													</div>
												</TooltipTrigger>

												{/* TOOLTIP FOR DESCRIPTION OF SKILL */}
												<TooltipContent>
													{skill.description ??
														"Description not available"}
												</TooltipContent>
											</Tooltip>
										))}
									</>
								)}
							</li>
						))}
					</ol>
				</ScrollArea>

				{/* SCROLL INDICATOR */}
				<ScrollIndicator
					scrollAreaRef={scrollAreaRef}
					className="mt-4 mx-auto"
					position="bottom"
				/>
			</Section>
		</TooltipProvider>
	);
};

export default UseExpertise;
