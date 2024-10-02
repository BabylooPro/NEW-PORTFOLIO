"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import ShowInfo from "@/components/ui/show-info";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { skills } from "@/features/landing/data/skills";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import "devicon";
import {
	UserRound,
	Calendar,
	Flag,
	MapPin,
	Phone,
	Briefcase,
	FileText,
	Building,
	Mail,
	CodeXml,
	Heart,
	Languages,
	GraduationCap,
} from "lucide-react";

type Skill = {
	name: string;
	icon?: string;
	description: string;
	favorite?: boolean;
};

const AboutSection: React.FC = () => {
	const calculateAge = () => {
		const birthDate = new Date(2002, 9, 4); // NOTE: MONTH IS 0-INDEXED, SO 9 IS OCTOBER
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<Section>
			<h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4">
				About me
				<ShowInfo
					title={"About Me"}
					description={"This section provides personal information about me"}
				/>
			</h2>

			{/* MY INFO */}
			<div className="space-y-4">
				{/* Utilisation de flex-col sur mobile et grid sur les écrans plus larges */}
				<div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-x-8 text-base md:text-xl text-neutral-800 dark:text-neutral-200">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<UserRound strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">Max Remy</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								{calculateAge()} years old
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Flag strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								Switzerland, Vaud
							</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								1510 Moudon
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone strokeWidth={3} className="w-6 h-6" />
							<a
								className="text-neutral-500 dark:text-neutral-400"
								href="tel:+41798730605"
							>
								+41 79 873 06 05
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-2 md:justify-self-end">
						<div className="flex items-center gap-2">
							<Briefcase strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								<strong>On-site or Remote : </strong>Acceptable
							</span>
						</div>
						<div className="flex items-center gap-2">
							<FileText strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								<strong>Contract : </strong>Freelance or Salaried
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Building strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								<strong>Company Individual : </strong>Max Remy Dev
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Mail strokeWidth={3} className="w-6 h-6" />
							<a
								className="text-neutral-500 dark:text-neutral-400"
								href="mailto:maxremy.dev@gmail.com"
							>
								maxremy.dev@gmail.com
							</a>
						</div>
					</div>
				</div>

				<Separator className="h-1 my-4" />

				{/* MY STORY */}
				<div className="text-base md:text-xl space-y-4 text-neutral-700 dark:text-neutral-300">
					<p>
						Since 2015, when I was 13, video games really pushed me to become a
						developer. I started by creating mods to improve the experience on games
						like ArmA, DayZ, or GTA 4 and 5. These mods were a way to make the games
						more fun, and random players could download them to have even more fun since
						they were open-source.
					</p>
					<p>
						My real career started around 2016-2017 when I specialized in C#. And I
						don&apos;t just code mods, I also create my own small video games with
						Unity, and especially model 3D assets with Blender. Honestly, seeing the
						final result with better quality is always a thrill. Not like a mod limited
						by the power of the game architecture itself.
					</p>
					<p>
						Over time, I became more professional. I started selling my mods and
						automation software or client project like basic missions, and that&apos;s
						when my career really took off.
					</p>
					<p>
						In 2020, I became a freelance developer with salary management through a
						cool agency. They found me projects based on my resume, connected me with
						clients, and gave me a lot of financial and accounting advice. I worked with
						them or through them for two years, giving them a small percentage of my
						earnings as a semi-independent worker.
					</p>
					<p>
						Before Covid, I specialized in backend development, and during Covid, I
						became a FullStack developer. So, I also improved my frontend skills, which
						I had basic knowledge of through XML, HTML, CSS, and JS. I boosted my
						skills, which now allows me to offer fully customized solutions for my side
						projects or clients. Plus, I can even create design mockups with Figma since
						I trained myself in UI/UX design in under a month.
					</p>
					<p>
						Whether it&apos;s for games, backend, or frontend, my goal is always the
						same: to create innovative stuff in IT that adds real value to my clients
						projects or to others through my open-source projects.
					</p>
				</div>

				<Separator className="h-1 my-4" />

				{/* LANGUAGE AND EDUCATION */}
				<div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-x-8 text-base md:text-xl text-neutral-800 dark:text-neutral-200">
					<div className="md:col-span-2">
						<h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
							Languages
							<ShowInfo
								title={"Languages"}
								description={
									"I'll give you a quick overview of the languages I'm fluent in"
								}
								icon={<Languages className="w-5 h-5" />}
								iconColor="text-blue-500"
							/>
						</h3>
						<ul className="list-disc list-inside space-y-1">
							<li>
								French : C2{" "}
								<span className="text-neutral-500">| Native language</span>
							</li>
							<li>
								English : B1+{" "}
								<span className="text-neutral-500">| Intermediate Plus</span>
							</li>
							<li>
								German : A1 <span className="text-neutral-500">| Beginner</span>
							</li>
						</ul>
					</div>
					<div className="md:justify-self-end">
						<h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
							Education
							<ShowInfo
								title={"Education"}
								description={"So, a bit about my education..."}
								icon={<GraduationCap className="w-5 h-5" />}
								iconColor="text-green-500"
							/>
						</h3>
						<ul className="list-disc list-inside space-y-1">
							<li>
								<Link
									href="https://openclassrooms.com/"
									target="_blank"
									className="hover:text-neutral-400 dark:hover:text-neutral-600"
								>
									OpenClassRooms.com
								</Link>
							</li>
							<li>
								<Link
									href="https://www.codecademy.com/"
									target="_blank"
									className="hover:text-neutral-400 dark:hover:text-neutral-600"
								>
									Codecademy.com
								</Link>
							</li>
							<li>
								<Link
									href="https://www.udemy.com/"
									target="_blank"
									className="hover:text-neutral-400 dark:hover:text-neutral-600"
								>
									Udemy.com
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<Separator className="h-1 my-4" />

				{/* MY FAVORITE SKILLS */}
				<TooltipProvider>
					<div>
						<h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
							My Favorite Skills
							<ShowInfo
								title={"My Favorite Skills"}
								description={"Here's a look at my favorite code skills"}
								icon={<Heart className="w-5 h-5 text-red-600" />}
								iconColor="text-red-600"
								iconFill
							/>
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:grid-rows-4 md:grid-flow-col">
							{skills
								.flatMap((yearSkills) =>
									yearSkills.skills.filter((skill: Skill) => skill.favorite)
								)
								.map((skill: Skill) => (
									<Tooltip key={skill.name} delayDuration={0}>
										<TooltipTrigger asChild>
											<div className="flex items-center space-x-2">
												{skill.icon ? (
													<i
														className={`devicon-${skill.icon}-plain colored text-2xl`}
													/>
												) : (
													<CodeXml size={24} />
												)}
												<span className="text-neutral-700 dark:text-neutral-300">
													{skill.name}
												</span>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											{skill.description ?? "Description not available"}
										</TooltipContent>
									</Tooltip>
								))}
						</div>
					</div>
				</TooltipProvider>
			</div>
		</Section>
	);
};

export default AboutSection;
