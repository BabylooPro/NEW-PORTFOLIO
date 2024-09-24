"use client";

import { Section } from "@/components/ui/section";
import React from "react";
import { GalleryVerticalEnd, CodeXml } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import "devicon";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import InfoSection from "@/components/ui/info-section";

interface SkillItem {
	name: string;
	icon?: string;
	description?: string;
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
	infoMode: "tooltip" | "toast";
	infoTooltipText?: string;
	infoToastTitle?: string;
	infoToastDescription?: string;
	infoPosition?: "top" | "bottom" | "left" | "right";
	infoIconSize?: number;
	infoClassName?: string;
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
	infoMode,
	infoTooltipText,
	infoToastTitle,
	infoToastDescription,
	infoPosition,
	infoIconSize,
	infoClassName,
}) => {
	return (
		<TooltipProvider>
			<Section>
				{/* TITLE WITH INFO-SECTION */}
				<h2 className="text-2xl font-bold mb-6 flex items-center">
					{title}
					<InfoSection
						mode={infoMode}
						tooltipText={infoTooltipText}
						position={infoPosition}
						iconSize={infoIconSize}
						toastTitle={infoToastTitle}
						toastDescription={infoToastDescription}
						className={infoClassName}
					/>
				</h2>

				{/* SCROLL AREA */}
				<ScrollArea className={scrollHeight}>
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
														<p className="text-base font-normal text-neutral-700 dark:text-neutral-300 cursor-pointer">
															{skill.name}
														</p>
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

				{/* ANIMATION FOR SCROLL INDICATOR */}
				<div className="flex justify-center mt-4">
					<motion.div
						className="text-neutral-500 dark:text-neutral-400"
						animate={{ y: [0, 10, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<GalleryVerticalEnd />
					</motion.div>
				</div>
			</Section>
		</TooltipProvider>
	);
};

export default UseExpertise;
