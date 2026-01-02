"use client";

import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import { ShowInfo } from "@/components/ui/show-info";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubProjects } from "@/hooks/use-GitHubProjects";
import { useRef, useState, useMemo } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProjectsSection } from "./hooks/useProjectsSection";

const SideProjectsSection = () => {
    const { projects, error: projectsError, loading: projectsLoading } = useGitHubProjects();
    const { data: sectionData, error: sectionError, isLoading: sectionLoading } = useProjectsSection();

    const scrollAreaRef = useRef<ScrollAreaRef>(null);
    const [filterTechnology, setFilterTechnology] = useState<string>("All");
    const [filterYear, setFilterYear] = useState<string>("All");

    // SORT PROJECTS BY LIVE STATUS AND CREATED_AT DATE
    const sortedProjects = useMemo(() => {
        if (!projects) return [];
        return [...projects].sort((a, b) => {
            // IF PROJECT IS LIVE, IT PASSES FIRST
            const aIsLive = sectionData?.liveProjects?.some(lp =>
                lp.url?.toLowerCase().includes(a.name.toLowerCase())
            );
            const bIsLive = sectionData?.liveProjects?.some(lp =>
                lp.url?.toLowerCase().includes(b.name.toLowerCase())
            );

            if (aIsLive && !bIsLive) return -1;
            if (!aIsLive && bIsLive) return 1;

            // IF BOTH ARE LIVE OR NON-LIVE, SORT BY CREATED_AT DATE
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [projects, sectionData?.liveProjects]);

    // FILTER PROJECTS BY TECHNOLOGY AND YEAR
    const filteredProjects = useMemo(() => {
        // CONVERT LIVE PROJECTS TO COMPATIBLE FORMAT
        const liveProjects = sectionData?.liveProjects?.map(liveProject => {
            // SEARCH FOR A CORRESPONDING GITHUB PROJECT (BY URL OR NAME)
            const githubProject = sortedProjects.find(ghProject =>
                (ghProject.homepage && liveProject.url &&
                    ghProject.homepage.toLowerCase() === liveProject.url.toLowerCase()) ||
                ghProject.name.toLowerCase() === liveProject.name.toLowerCase()
            );

            // IF FOUND A CORRESPONDING GITHUB PROJECT, MERGE DATA
            if (githubProject) {
                return {
                    name: liveProject.name,
                    description: liveProject.notes || githubProject.description,
                    html_url: githubProject.html_url,
                    language: githubProject.language,
                    stargazers_count: githubProject.stargazers_count,
                    forks_count: githubProject.forks_count,
                    languages: liveProject.technologies || githubProject.languages,
                    topics: githubProject.topics,
                    created_at: githubProject.created_at,
                    updated_at: githubProject.updated_at,
                    license: githubProject.license,
                    default_branch: githubProject.default_branch,
                    homepage: liveProject.url || githubProject.homepage,
                    isPrivate: false,
                    isOnline: liveProject.isOnline,
                    isWip: liveProject.isWip,
                    pinned: githubProject.pinned || false,
                    deployDate: liveProject.deployDate
                };
            }

            // OTHERWISE, RETURN STANDARD LIVE PROJECT
            return {
                name: liveProject.name,
                description: liveProject.notes || "",
                html_url: liveProject.url,
                language: "Unknown",
                stargazers_count: 0,
                forks_count: 0,
                languages: liveProject.technologies || [],
                topics: [],
                created_at: liveProject.deployDate || "",
                updated_at: "",
                license: null,
                default_branch: "main",
                homepage: liveProject.url,
                isPrivate: false,
                isOnline: liveProject.isOnline,
                isWip: liveProject.isWip,
                pinned: false,
                deployDate: liveProject.deployDate
            };
        }) || [];

        // SPLIT LIVE PROJECTS INTO DIFFERENT CATEGORIES
        const onlineProjects = liveProjects
            .filter(p => p.isOnline && !p.isWip && !p.pinned)
            .filter(project => {
                const techMatch = filterTechnology === "All" || project.languages.includes(filterTechnology);
                const yearMatch = filterYear === "All" ||
                    (project.created_at && new Date(project.created_at).getFullYear().toString() === filterYear);
                return techMatch && yearMatch;
            });

        const onlinePinnedProjects = liveProjects
            .filter(p => p.isOnline && !p.isWip && p.pinned)
            .filter(project => {
                const techMatch = filterTechnology === "All" || project.languages.includes(filterTechnology);
                const yearMatch = filterYear === "All" ||
                    (project.created_at && new Date(project.created_at).getFullYear().toString() === filterYear);
                return techMatch && yearMatch;
            });

        const wipPinnedProjects = liveProjects
            .filter(p => p.isWip && p.pinned)
            .filter(project => {
                const techMatch = filterTechnology === "All" || project.languages.includes(filterTechnology);
                const yearMatch = filterYear === "All" ||
                    (project.created_at && new Date(project.created_at).getFullYear().toString() === filterYear);
                return techMatch && yearMatch;
            });

        const wipProjects = liveProjects
            .filter(p => p.isWip && !p.pinned)
            .filter(project => {
                const techMatch = filterTechnology === "All" || project.languages.includes(filterTechnology);
                const yearMatch = filterYear === "All" ||
                    (project.created_at && new Date(project.created_at).getFullYear().toString() === filterYear);
                return techMatch && yearMatch;
            });

        const offlineProjects = liveProjects
            .filter(p => !p.isOnline && !p.isWip)
            .filter(project => {
                const techMatch = filterTechnology === "All" || project.languages.includes(filterTechnology);
                const yearMatch = filterYear === "All" ||
                    (project.created_at && new Date(project.created_at).getFullYear().toString() === filterYear);
                return techMatch && yearMatch;
            });

        // FILTER GITHUB PROJECTS TO EXCLUDE THOSE THAT ARE ALREADY IN LIVE PROJECTS
        const liveProjectUrls = new Set(liveProjects.map(p => p.homepage?.toLowerCase()));
        const liveProjectNames = new Set(liveProjects.map(p => p.name.toLowerCase()));

        // FILTER AND SORT GITHUB PROJECTS
        const githubProjects = sortedProjects
            .filter(project => {
                // EXCLUDE PROJECTS THAT ARE ALREADY IN LIVE PROJECTS
                const isInLiveProjects =
                    (project.homepage && liveProjectUrls.has(project.homepage.toLowerCase())) ||
                    liveProjectNames.has(project.name.toLowerCase());
                return !isInLiveProjects;
            })
            .filter((project) => {
                const techMatch = filterTechnology === "All" || project.languages.includes(filterTechnology);
                const yearMatch = filterYear === "All" ||
                    new Date(project.created_at).getFullYear().toString() === filterYear;
                return techMatch && yearMatch;
            });

        // SPLIT GITHUB PROJECTS
        const pinnedProjects = githubProjects
            .filter(p => p.pinned)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        const normalProjects = githubProjects.filter(p => !p.pinned);

        // RETURN IN ORDER: ONLINE, ONLINE PINNED, WIP PINNED, WIP, PINNED (SORTED BY STARS), NORMAL, OFFLINE
        return [
            ...onlineProjects,
            ...onlinePinnedProjects,
            ...wipPinnedProjects,
            ...wipProjects,
            ...pinnedProjects,
            ...normalProjects,
            ...offlineProjects
        ];
    }, [sortedProjects, filterTechnology, filterYear, sectionData?.liveProjects]);

    // GET ALL TECHNOLOGIES USED IN PROJECTS
    const technologies = useMemo(() => {
        if (!projects && !sectionData?.liveProjects) return ["All"];
        const techSet = new Set<string>();

        // ADD TECHNOLOGIES FROM GITHUB PROJECTS
        projects?.forEach((project) =>
            project.languages.forEach((lang) => techSet.add(lang))
        );

        // ADD TECHNOLOGIES FROM LIVE PROJECTS
        sectionData?.liveProjects?.forEach((project) =>
            project.technologies?.forEach((tech) => techSet.add(tech))
        );

        return ["All", ...Array.from(techSet).sort()];
    }, [projects, sectionData?.liveProjects]);

    // GET ALL YEARS OF PROJECTS
    const years = useMemo(() => {
        if (!projects && !sectionData?.liveProjects) return ["All"];
        const yearSet = new Set<string>();

        // ADD YEARS FROM GITHUB PROJECTS
        projects?.forEach((project) =>
            yearSet.add(new Date(project.created_at).getFullYear().toString())
        );

        // ADD YEARS FROM LIVE PROJECTS
        sectionData?.liveProjects?.forEach((project) => {
            if (project.deployDate) {
                yearSet.add(new Date(project.deployDate).getFullYear().toString());
            }
        });

        return ["All", ...Array.from(yearSet).sort((a, b) => b.localeCompare(a))];
    }, [projects, sectionData?.liveProjects]);

    // HANDLE ERRORS
    if (projectsError || sectionError) {
        return (
            <Section id="projects">
                <h2 className="text-2xl font-bold mb-6">Error Loading Projects</h2>
                <p className="text-red-500">
                    An error occurred: {(projectsError ?? sectionError)?.toString()}
                </p>
                <div className="flex pb-4 px-4 justify-between sm:justify-center lg:justify-end gap-2 sm:gap-6 md:gap-4 lg:gap-[0.6rem] sm:px-4">
                    <Skeleton className="h-10 w-[calc(50%-4px)] sm:w-full lg:w-[145px]" />
                    <Skeleton className="h-10 w-[calc(50%-4px)] sm:w-full lg:w-[145px]" />
                </div>
                <ScrollArea className="h-[555px] w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                        {[...Array(6)].map((_, index) => (
                            <Skeleton key={index} className="h-[270px] w-full rounded-2xl" />
                        ))}
                    </div>
                </ScrollArea>
            </Section>
        );
    }

    // HANDLE LOADING
    if (projectsLoading || sectionLoading) {
        return (
            <Section id="projects">
                <h2 className="text-2xl font-bold mb-6">Projects</h2>
                <div className="flex pb-4 px-4 justify-between sm:justify-center lg:justify-end gap-2 sm:gap-6 md:gap-4 lg:gap-[0.6rem] sm:px-4">
                    <Skeleton className="h-10 w-[calc(50%-4px)] sm:w-full lg:w-[145px]" />
                    <Skeleton className="h-10 w-[calc(50%-4px)] sm:w-full lg:w-[145px]" />
                </div>
                <ScrollArea className="h-[555px] w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                        {[...Array(6)].map((_, index) => (
                            <Skeleton key={index} className="h-[270px] w-full rounded-2xl" />
                        ))}
                    </div>
                </ScrollArea>
            </Section>
        );
    }

    return (
        <Section id="projects">
            {/* HEADER */}
            <div className="relative mb-10">
                <h2 className="text-2xl font-bold flex items-center gap-2 -mb-5">
                    {sectionData?.title ?? "Projects"} ({filteredProjects.length})
                    <ShowInfo
                        //title={sectionData?.title ?? "Projects"}
                        description={
                            <div className="flex flex-col gap-2">
                                <p>{sectionData?.titleDescription}</p>
                                <span className="text-xs text-muted-foreground">
                                    <strong>Main technologies : </strong>
                                    {sectionData?.mainTechnologies?.join(", ") ?? "N/A"}
                                </span>
                            </div>
                        }
                    />
                </h2>
                <ScrollIndicator
                    scrollAreaRef={scrollAreaRef}
                    className="absolute left-1/2 transform -translate-x-1/2"
                    position="top"
                />
            </div>

            {/* FILTERS - TECHNOLOGY AND YEAR */}
            <div className="flex pb-4 px-4 justify-between sm:justify-center lg:justify-end gap-2 sm:gap-6 md:gap-4 lg:gap-[0.6rem] sm:px-4">
                <Select
                    onValueChange={setFilterTechnology}
                    defaultValue={filterTechnology}
                >
                    <SelectTrigger className="w-[calc(50%-4px)] sm:w-full lg:w-[145px]">
                        <SelectValue placeholder="Filter by Technology" />
                    </SelectTrigger>
                    <SelectContent>
                        {technologies.map((tech) => (
                            <SelectItem key={tech} value={tech}>
                                {tech}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={setFilterYear}
                    defaultValue={filterYear}
                >
                    <SelectTrigger className="w-[calc(50%-4px)] sm:w-full lg:w-[145px]">
                        <SelectValue placeholder="Filter by Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* SCROLL AREA TO DISPLAY MORE PROJECTS */}
            <ScrollArea showShadows ref={scrollAreaRef} className="h-[555px] w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.name}
                            className="h-full"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card className="flex flex-col h-[270px] relative">
                                {/* LIVE STATUS INDICATOR */}
                                {project.isOnline !== undefined && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1">
                                        <div className="flex items-center gap-1">
                                            {project.isOnline ? (
                                                <>
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </span>
                                                    <span className="text-xs text-green-500 font-medium">ONLINE</span>
                                                    {project.isWip && (
                                                        <span className="text-xs text-yellow-500 font-medium ml-2">WIP</span>
                                                    )}
                                                </>
                                            ) : project.isWip ? (
                                                <>
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                                    </span>
                                                    <span className="text-xs text-yellow-500 font-medium">WIP</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                    <span className="text-xs text-red-500 font-medium">OFFLINE</span>
                                                </>
                                            )}
                                        </div>
                                        {project.pinned && <Pin className="size-4 rotate-45 text-yellow-500 ml-1" />}
                                    </div>
                                )}
                                {!project.isOnline && project.pinned && (
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
                                    {project.languages.length > 0 && (
                                        <p className="text-xs mb-2">
                                            Built With:{" "}
                                            {project.languages
                                                .slice(0, 3)
                                                .map((lang: string, index: number) => (
                                                    <span key={lang} className="font-semibold">
                                                        {lang}
                                                        {index <
                                                            Math.min(project.languages.length, 3) - 1 &&
                                                            ", "}
                                                    </span>
                                                ))}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {project.topics.slice(0, 3).map((topic: string) => (
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
                                    {/* STATS GITHUB (STARS/FORKS) FOR GITHUB PROJECTS AND LIVE PROJECTS WITH GITHUB REPO */}
                                    {(project.isOnline === undefined || project.html_url?.includes('github.com')) && (
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
                                                <span className="text-sm">{project.forks_count}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-0 ml-auto">
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
                                                    {/* FOR LIVE PROJECTS WITHOUT GITHUB REPO, DISPLAY ONLY DEPLOY DATE */}
                                                    {project.isOnline !== undefined && !project.html_url?.includes('github.com') ? (
                                                        project.created_at && (
                                                            <div className="flex items-center gap-4">
                                                                <Calendar className="h-4 w-4" />
                                                                <p className="text-sm">
                                                                    Deploy Date:{" "}
                                                                    {new Date(project.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        )
                                                    ) : (
                                                        // FOR GITHUB PROJECTS AND LIVE PROJECTS WITH GITHUB REPO
                                                        <>
                                                            <div className="flex items-center gap-4">
                                                                <Calendar className="h-4 w-4" />
                                                                <p className="text-sm">
                                                                    Created:{" "}
                                                                    {new Date(project.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <Clock className="h-4 w-4" />
                                                                <p className="text-sm">
                                                                    Updated:{" "}
                                                                    {new Date(project.updated_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            {project.isOnline !== undefined && project.deployDate && (
                                                                <div className="flex items-center gap-4">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <p className="text-sm">
                                                                        Deploy Date:{" "}
                                                                        {new Date(project.deployDate).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
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
                                        {project.html_url && project.html_url.includes('github.com') && (
                                            <Button variant="ghost" size="icon">
                                                <Link
                                                    href={project.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        )}

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
