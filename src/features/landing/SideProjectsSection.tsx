"use client";

import { Github, ExternalLink, Pin } from "lucide-react";
import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import InfoSection from "@/components/ui/info-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubProjects } from "@/hooks/use-GitHubProjects";
import { useState, useEffect, useRef } from "react";
import ScrollIndicator from "@/components/ui/scroll-indicator";
const SideProjectsSection = () => {
	const { projects, error, loading } = useGitHubProjects(); // GET PROJECTS FROM GITHUB
	const [isLoading, setIsLoading] = useState(true);
	const scrollAreaRef = useRef<ScrollAreaRef>(null);

	// RESET LOADING STATE ON COMPONENT MOUNT (PAGE REFRESH)
	useEffect(() => {
		setIsLoading(true);
		const timeoutId = setTimeout(() => setIsLoading(false), 1000); // SIMULATE A DELAY BEFORE LOADING CONTENT
		return () => clearTimeout(timeoutId);
	}, []);

	// DISPLAY ERROR MESSAGE IF REQUEST FAILS
	if (error) {
		return (
			<Section>
				<h2 className="text-2xl font-bold mb-6">Error Loading Projects</h2>
				<p className="text-red-500">An error occurred : {error}</p>
				<ScrollArea className="h-[600px] w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
						{[...Array(6)].map((_, index) => (
							<Skeleton key={index} className="h-60 w-full rounded-xl" />
						))}
					</div>
				</ScrollArea>
			</Section>
		);
	}

	// IF PROJECTS ARE STILL LOADING OR PAGE HAS JUST REFRESHED, DISPLAY SKELETON
	if (loading || isLoading) {
		return (
			<Section>
				<h2 className="text-2xl font-bold mb-6">Projects</h2>
				<ScrollArea className="h-[600px] w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
						{[...Array(6)].map((_, index) => (
							<Skeleton key={index} className="h-60 w-full rounded-xl" />
						))}
					</div>
				</ScrollArea>
			</Section>
		);
	}

	// SORT PROJECTS BY NUMBER OF STARS
	const sortedProjects = [...projects].sort((a, b) => b.stargazers_count - a.stargazers_count);

	return (
		<Section>
			<div className="relative mb-10">
				<h2 className="text-2xl font-bold flex items-center gap-2 -mb-5">
					Projects
					<InfoSection mode={"tooltip"} />
				</h2>
				<ScrollIndicator
					scrollAreaRef={scrollAreaRef}
					className="absolute left-1/2 transform -translate-x-1/2"
					position="top"
				/>
			</div>

			{/* SCROLL AREA TO DISPLAY MORE PROJECTS */}
			<ScrollArea ref={scrollAreaRef} className="h-[550px] w-full">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
					{sortedProjects.map((project) => (
						<div
							key={project.name}
							className="bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300 p-6 rounded-xl relative"
						>
							{/* PIN */}
							{project.pinned && (
								<div className="absolute top-2 right-2">
									<Pin className="size-5 rotate-45 text-yellow-500" />
								</div>
							)}

							{/* TITLE */}
							<h3 className="text-xl font-semibold mb-2">{project.name}</h3>

							{/* DESCRIPTION */}
							<p className="text-neutral-500 dark:text-neutral-400 mb-4">
								{project.description}
							</p>

							{/* LANGUAGE USED */}
							<p className="text-neutral-600 dark:text-neutral-300 mb-4">
								Built With : <span className="font-bold">{project.language}</span>
							</p>

							{/* PROJECT INFOS */}
							<div className="flex items-center space-x-4">
								{/* STARS */}
								<div className="flex items-center space-x-1">
									<Github className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
									<span>{project.stargazers_count}</span>
								</div>

								{/* FORKS */}
								<div className="flex items-center space-x-1">
									<span className="text-neutral-500 dark:text-neutral-400">
										Forks:
									</span>
									<span>{project.forks_count}</span>
								</div>

								{/* LINK TO PROJECT */}
								<Link
									href={project.html_url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
								</Link>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>

			{/* SCROLL INDICATOR */}
			<ScrollIndicator
				scrollAreaRef={scrollAreaRef}
				className="mt-4 mx-auto"
				position="bottom"
			/>
		</Section>
	);
};

export default SideProjectsSection;
