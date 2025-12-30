"use client";

import { Section } from "@/components/ui/section";
import React from "react";
import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import "devicon";
import { ShowInfo } from "@/components/ui/show-info";
import ScrollIndicator from "@/components/ui/scroll-indicator";
import ExperienceItem, { ExperienceItemProps } from "./experienceItem";
import { formatExperienceDateRange, getExperienceDateRangeDurationMonths } from "./experienceDate";
import SkillItem from "./skillsItems";
import DotTimeline from "@/components/ui/dot-timeline";
import { Badge } from "@/components/ui/badge";
import { Skill, SkillYear } from "./types";
import { SkillsSkeleton } from "./SkillSkeleton";

// USE THE SKILLYEAR TYPE DIRECTLY
type ExpertiseItem = ExperienceItemProps | SkillYear; // UNION TYPE FOR POSSIBLE ITEM TYPES

interface UseExpertiseProps {
    id?: string;
    title: string;
    titleDescription: string;
    paragraphDescription: string;
    items: ExpertiseItem[];
    showCompany: boolean;
    showSkills: boolean;
    scrollHeight?: string;
    allColorIcon?: string;
    loading?: boolean;
    error?: string;
    statusContent?: React.ReactNode;
    codingTimeSummary?: {
        year: number;
        hours: number;
        minutes: number;
        totalMinutes: number;
    } | null;
}

// TYPE GUARD WITH PROPER RETURN TYPE ANNOTATION
const isExperienceItem = (item: ExpertiseItem): item is ExperienceItemProps => {
    return "title" in item;
};

// TYPE GUARD FOR SKILL ITEMS
const isSkillYearGroup = (item: ExpertiseItem): item is SkillYear => {
    return "year" in item && "skills" in item;
};

const UseExpertise: React.FC<UseExpertiseProps> = ({
    id,
    title,
    titleDescription,
    paragraphDescription,
    items,
    showCompany = true,
    showSkills = true,
    scrollHeight = "h-[400px]",
    allColorIcon,
    loading = false,
    error,
    statusContent,
    codingTimeSummary,
}) => {
    const scrollAreaRef = React.useRef<ScrollAreaRef>(null);
    const [clientNow, setClientNow] = React.useState<Date | null>(null);
    const isSkillSection = title.toLowerCase().includes("skill");
    const showCodingHoursSummary = Boolean(isSkillSection && codingTimeSummary && (codingTimeSummary.hours > 0 || codingTimeSummary.minutes > 0));

    React.useEffect(() => {
        setClientNow(new Date());
    }, []);

    const formatCodingTimeSummary = () => {
        if (!codingTimeSummary) return "";
        const segments: string[] = [];
        if (codingTimeSummary.hours > 0) segments.push(`${codingTimeSummary.hours}h`);
        if (codingTimeSummary.minutes > 0) segments.push(`${codingTimeSummary.minutes}m`);
        if (!segments.length) segments.push("0m");
        return segments.join("");
    };

    const formatExperienceDateBadge = (range: ExperienceItemProps["date"]) => {
        const dateLabel = formatExperienceDateRange(range);
        const durationMonths = getExperienceDateRangeDurationMonths(range, clientNow ?? undefined);
        let durationLabel = "";
        if (durationMonths !== null) durationLabel = ` (${durationMonths} month${durationMonths === 1 ? "" : "s"})`;
        return `${dateLabel}${durationLabel}`;
    };

    if (error) {
        return (
            <Section id={id}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <ShowInfo
                                title="My Skills"
                            />
                        </div>
                    </h2>
                </div>
                <div className="flex items-center justify-center h-[200px] text-red-500">
                    {error}
                </div>
            </Section>
        );
    }

    return (
        <TooltipProvider>
            <Section id={id}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            {title || "My Skills"}
                            <ShowInfo
                                //title={title}
                                description={
                                    <>
                                        {titleDescription} <br />{" "}
                                        <span className="text-xs text-neutral-500">
                                            {paragraphDescription}
                                        </span>
                                        {showCodingHoursSummary && (
                                            <span className="text-xs text-neutral-500">
                                                ~{formatCodingTimeSummary()} coded in {codingTimeSummary?.year}
                                            </span>
                                        )}
                                    </>
                                }
                            />
                        </div>
                    </h2>
                    {statusContent}
                </div>

                <ScrollArea showShadows ref={scrollAreaRef} className={scrollHeight}>
                    {isSkillSection ? (
                        <>
                            {/* VERSION MOBILE */}
                            <ol className="md:hidden m-4 relative border-l border-neutral-400 dark:border-neutral-600">
                                {loading ? (
                                    // MOBILE SKELETON
                                    <DotTimeline year="2024" showBadge>
                                        <div className="flex flex-col space-y-2">
                                            {[...Array(6)].map((_, i) => (
                                                <SkillItem
                                                    key={i}
                                                    skill={{} as Skill}
                                                    isLoading={true}
                                                />
                                            ))}
                                        </div>
                                    </DotTimeline>
                                ) : (
                                    // NORMAL MOBILE CONTENT
                                    items.map((item) => (
                                        <DotTimeline
                                            key={isExperienceItem(item) ? item.title : item.year}
                                            year={isExperienceItem(item) ? formatExperienceDateRange(item.date) : item.year}
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
                                    ))
                                )}
                            </ol>

                            {/* VERSION DESKTOP */}
                            <div className="hidden md:flex justify-center">
                                <div className="relative w-full max-w-[700px]">
                                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-400 dark:bg-neutral-600"></div>
                                    <ol className="relative space-y-16">
                                        {loading ? (
                                            // DESKTOP SKELETON
                                            [...Array(3)].map((_, index) => (
                                                <DotTimeline
                                                    key={index}
                                                    year="2024"
                                                    showBadge={true}
                                                    isRight={index % 2 !== 0}
                                                    isCentered={true}
                                                >
                                                    <div className="flex justify-center">
                                                        <div className="w-full max-w-[500px]">
                                                            <div
                                                                className={`flex flex-col space-y-2 ${index % 2 !== 0 ? "items-end" : "items-start"
                                                                    }`}
                                                            >
                                                                {[...Array(4)].map((_, i) => (
                                                                    <SkillItem
                                                                        key={i}
                                                                        skill={{} as Skill}
                                                                        allColorIcon={allColorIcon}
                                                                        isRight={index % 2 !== 0}
                                                                        isLoading={true}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DotTimeline>
                                            ))
                                        ) : (
                                            // NORMAL DESKTOP CONTENT
                                            items.map((item, index) => (
                                                <DotTimeline
                                                    key={
                                                        isExperienceItem(item) ? item.title : item.year
                                                    }
                                                    year={isExperienceItem(item) ? formatExperienceDateRange(item.date) : item.year}
                                                    showBadge={true}
                                                    isRight={index % 2 !== 0}
                                                    isCentered={true}
                                                >
                                                    <div className="flex justify-center">
                                                        <div className="w-full max-w-[500px]">
                                                            <div
                                                                className={`flex flex-col space-y-2 ${index % 2 !== 0
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
                                            ))
                                        )}
                                    </ol>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {loading ? (
                                <SkillsSkeleton />
                            ) : (
                                <ol className="m-4 relative border-l border-neutral-400 dark:border-neutral-600">
                                    {items.map((item) => (
                                        <DotTimeline
                                            key={isExperienceItem(item) ? item.title : item.year}
                                            year={isExperienceItem(item) ? formatExperienceDateRange(item.date) : item.year}
                                            showBadge={!isExperienceItem(item)}
                                        >
                                            {isExperienceItem(item) && (
                                                <>
                                                    {item.date && (
                                                        <Badge className="mb-1 bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-300">
                                                            {formatExperienceDateBadge(item.date)}
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
                        </>
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
