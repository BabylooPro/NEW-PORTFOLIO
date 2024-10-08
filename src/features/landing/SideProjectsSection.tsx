"use client";

import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import ShowInfo from "@/components/ui/show-info";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubProjects } from "@/hooks/use-GitHubProjects";
import { useRef, useEffect } from "react";
import ScrollIndicator from "@/components/ui/scroll-indicator";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Github,
	ExternalLink,
	Pin,
	Calendar,
	Clock,
	FileText,
	Info,
	Star,
	GitFork,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const SideProjectsSection = () => {
	const { projects, error, loading } = useGitHubProjects(); // GET PROJECTS FROM GITHUB
	const scrollAreaRef = useRef<ScrollAreaRef>(null);

	useEffect(() => {
		const checkInitialPosition = () => {
			scrollAreaRef.current?.checkScrollPosition();
		};

		checkInitialPosition();
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

	// IF PROJECTS ARE STILL LOADING, DISPLAY SKELETON
	if (loading) {
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
					<ShowInfo
						title={"Projects"}
						description={
							"This section displays my projects on GitHub (no private/clients projects)"
						}
					/>
				</h2>
				<ScrollIndicator
					scrollAreaRef={scrollAreaRef}
					className="absolute left-1/2 transform -translate-x-1/2"
					position="top"
				/>
			</div>

			{/* SCROLL AREA TO DISPLAY MORE PROJECTS */}
			<ScrollArea showShadows ref={scrollAreaRef} className="h-[555px] w-full">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
					{sortedProjects.map((project) => (
						<motion.div
							key={project.name}
							className="h-full"
							whileHover={{ scale: 1.03 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Card className="flex flex-col h-[275px] relative">
								{project.pinned && (
									<div className="absolute top-2 right-2">
										<Pin className="size-4 rotate-45 text-yellow-500" />
									</div>
								)}
								<CardHeader className="pb-2">
									<CardTitle className="text-lg">{project.name}</CardTitle>
								</CardHeader>
								<CardContent className="flex-grow">
									<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
										{project.description}
									</p>
									<p className="text-xs mb-2">
										Built With:{" "}
										{project.languages.slice(0, 3).map((lang, index) => (
											<span key={lang} className="font-semibold">
												{lang}
												{index <
													Math.min(project.languages.length, 3) - 1 &&
													", "}
											</span>
										))}
									</p>
									<div className="flex flex-wrap gap-1 mt-2">
										{project.topics.slice(0, 3).map((topic) => (
											<Badge
												key={topic}
												variant="secondary"
												className="text-xs"
											>
												{topic}
											</Badge>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex justify-between items-center">
									<div className="flex items-center space-x-4 text-muted-foreground">
										<div className="flex items-center space-x-1">
											<Star className="w-4 h-4" />
											<span className="text-sm">
												{project.stargazers_count}
											</span>
										</div>
										<div className="flex items-center space-x-1">
											<span className="text-xs">
												<GitFork className="w-4 h-4" />
											</span>
											<span className="text-sm ">{project.forks_count}</span>
										</div>
									</div>
									<div className="flex items-center space-x-0">
										{/* DIALOG TO SHOW MORE INFO ABOUT PROJECT */}
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="ghost" size="icon">
													<Info className="h-4 w-4" />
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>{project.name}</DialogTitle>
													<DialogDescription>
														{project.description}
													</DialogDescription>
												</DialogHeader>
												<div className="grid gap-4 py-4">
													<div className="flex items-center gap-4">
														<Calendar className="h-4 w-4" />
														<p className="text-sm">
															Created:{" "}
															{new Date(
																project.created_at
															).toLocaleDateString()}
														</p>
													</div>
													<div className="flex items-center gap-4">
														<Clock className="h-4 w-4" />
														<p className="text-sm">
															Updated:{" "}
															{new Date(
																project.updated_at
															).toLocaleDateString()}
														</p>
													</div>
													{project.license && (
														<div className="flex items-center gap-4">
															<FileText className="h-4 w-4" />
															<p className="text-sm">
																License:{" "}
																<Link
																	href={`${project.html_url}/blob/${project.default_branch}/LICENSE`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-blue-500 hover:underline"
																>
																	{project.license}
																</Link>
															</p>
														</div>
													)}
												</div>
											</DialogContent>
										</Dialog>

										{/* BUTTON LINK TO REPOSITORY GITHUB */}
										<Button variant="ghost" size="icon">
											<Link
												href={project.html_url}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Github className="w-4 h-4" />
											</Link>
										</Button>

										{/* BUTTON LINK TO LIVE WEBSITE */}
										{project.homepage && (
											<Button variant="ghost" size="icon">
												<Link
													href={project.homepage}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="w-4 h-4" />
												</Link>
											</Button>
										)}
									</div>
								</CardFooter>
							</Card>
						</motion.div>
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
