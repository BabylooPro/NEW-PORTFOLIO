"use client";

import { Section } from "@/components/ui/section";
import React from "react";
import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import "devicon";
import { ShowInfo } from "@/components/ui/show-info";
import ScrollIndicator from "@/components/ui/scroll-indicator";
import ExperienceItem, { ExperienceItemProps } from "./experienceItem";
import SkillItem from "./skillsItems";
import DotTimeline from "@/components/ui/dot-timeline";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/features/landing/data/skills";

interface SkillYearGroup {
	year: string;
	skills: Skill[];
}

type ExpertiseItem = ExperienceItemProps | SkillYearGroup; // UNION TYPE FOR POSSIBLE ITEM TYPES

interface UseExpertiseProps {
	title: string;
	items: ExpertiseItem[];
	showCompany: boolean;
	showSkills: boolean;
	scrollHeight?: string;
	allColorIcon?: string;
	infoSkills?: string;
	infoExperiences?: string;
}

// TYPE GUARD WITH PROPER RETURN TYPE ANNOTATION
const isExperienceItem = (item: ExpertiseItem): item is ExperienceItemProps => {
	return "title" in item;
};

// TYPE GUARD FOR SKILL ITEMS
const isSkillYearGroup = (item: ExpertiseItem): item is SkillYearGroup => {
	return "year" in item && "skills" in item;
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
	const isSkillSection = title.toLowerCase().includes("skill");

	return (
		<TooltipProvider>
			<Section>
				<div className="relative mb-10">
					<h2 className="text-2xl font-bold flex items-center -mb-5">
						{title}
						<ShowInfo
							description={
								isSkillSection ? (
									`Here are some of my ${infoSkills}.`
								) : (
									<>
										Check out my {infoExperiences} professional. <br />{" "}
										<span className="text-xs text-neutral-500 italic">
											Soon, connected with my Linkedin profile.
										</span>
									</>
								)
							}
							className="ml-2"
						/>
					</h2>

					<ScrollIndicator
						scrollAreaRef={scrollAreaRef}
						className="absolute left-1/2 transform -translate-x-1/2"
						position="top"
					/>
				</div>

				<ScrollArea showShadows ref={scrollAreaRef} className={scrollHeight}>
					{isSkillSection ? (
						<>
							{/* VERSION MOBILE */}
							<ol className="md:hidden m-4 relative border-l border-neutral-400 dark:border-neutral-600">
								{items.map((item) => (
									<DotTimeline
										key={isExperienceItem(item) ? item.title : item.year}
										year={isExperienceItem(item) ? item.date : item.year}
										showBadge={!isExperienceItem(item)}
									>
										{isSkillYearGroup(item) && (
											<div className="flex flex-col space-y-2">
												{item.skills.map((skill: Skill) => (
													<SkillItem
														key={skill.name}
														skill={skill}
														allColorIcon={allColorIcon}
													/>
												))}
											</div>
										)}
									</DotTimeline>
								))}
							</ol>

							{/* VERSION DESKTOP */}
							<div className="hidden md:flex justify-center">
								<div className="relative w-full max-w-[700px]">
									<div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-400 dark:bg-neutral-600"></div>
									<ol className="relative space-y-16">
										{items.map((item, index) => (
											<DotTimeline
												key={
													isExperienceItem(item) ? item.title : item.year
												}
												year={
													isExperienceItem(item) ? item.date : item.year
												}
												showBadge={true}
												isRight={index % 2 !== 0}
												isCentered={true}
											>
												<div className="flex justify-center">
													<div className="w-full max-w-[500px]">
														<div
															className={`flex flex-col space-y-2 ${
																index % 2 !== 0
																	? "items-end"
																	: "items-start"
															}`}
														>
															{isSkillYearGroup(item) &&
																item.skills.map((skill: Skill) => (
																	<SkillItem
																		key={skill.name}
																		skill={skill}
																		allColorIcon={allColorIcon}
																		isRight={index % 2 !== 0}
																	/>
																))}
														</div>
													</div>
												</div>
											</DotTimeline>
										))}
									</ol>
								</div>
							</div>
						</>
					) : (
						<ol className="m-4 relative border-l border-neutral-400 dark:border-neutral-600">
							{items.map((item) => (
								<DotTimeline
									key={isExperienceItem(item) ? item.title : item.year}
									year={isExperienceItem(item) ? item.date : item.year}
									showBadge={!isExperienceItem(item)}
								>
									{isExperienceItem(item) && (
										<>
											{item.date && (
												<Badge className="mb-1 bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300">
													{item.date}
												</Badge>
											)}
											<ExperienceItem
												item={item}
												showCompany={showCompany}
												showSkills={showSkills}
											/>
										</>
									)}
								</DotTimeline>
							))}
						</ol>
					)}
				</ScrollArea>

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
