import { useEffect, useState } from "react";
import { SkillYear, Skill } from "./types";

interface CodingTimeSummary {
    year: number;
    totalMinutes: number;
    hours: number;
    minutes: number;
}

interface StrapiSkill {
    id: number;
    attributes: {
        name: string;
        icon: string | null;
        description: string;
        favorite: boolean;
        unlike: boolean;
        star: boolean | null;
        like: boolean | null;
        hours: number | null;
        minutes: number | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        publishedAt?: string | null;
        skillYear: {
            year: string;
        } | null;
    };
}

const extractYear = (value?: string | null) => {
    if (!value) return undefined;
    const timestamp = Date.parse(value);
    if (Number.isNaN(timestamp)) return undefined;
    return new Date(timestamp).getFullYear();
};

export const useSkills = () => {
    const [skills, setSkills] = useState<SkillYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [codingTimeSummary, setCodingTimeSummary] = useState<CodingTimeSummary | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                setCodingTimeSummary(null);
                const response = await fetch('/api/strapi?path=skills');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

                if (!result?.data) {
                    throw new Error('No data received from API');
                }

                const skillsByYear: Record<string, Map<string, Skill>> = {};
                let minutesTrackedForTargetYear = 0;

                result.data.forEach((item: StrapiSkill) => {
                    const attributes = item.attributes;
                    const year = attributes.skillYear?.year;
                    if (year) {
                        if (!skillsByYear[year]) {
                            skillsByYear[year] = new Map();
                        }

                        const skillMap = skillsByYear[year];
                        if (!skillMap.has(attributes.name)) {
                            skillMap.set(attributes.name, {
                                id: item.id,
                                name: attributes.name,
                                icon: attributes.icon || undefined,
                                description: attributes.description,
                                favorite: attributes.favorite,
                                unlike: attributes.unlike,
                                star: attributes.star ?? undefined,
                                like: attributes.like ?? undefined,
                                hours: attributes.hours ?? undefined,
                                minutes: attributes.minutes ?? undefined
                            });
                        }
                    }

                    const numericalSkillYear = attributes.skillYear?.year ? Number(attributes.skillYear.year) : undefined;
                    const updatedYear = extractYear(attributes.updatedAt);
                    const publishedYear = extractYear(attributes.publishedAt);
                    const createdYear = extractYear(attributes.createdAt);

                    const qualifiesForTargetYear = [
                        numericalSkillYear,
                        updatedYear,
                        publishedYear,
                        createdYear
                    ].some((value) => value === 2025);

                    if (qualifiesForTargetYear) {
                        const trackedHours = attributes.hours ?? 0;
                        const trackedMinutes = attributes.minutes ?? 0;

                        if (trackedHours > 0 || trackedMinutes > 0) {
                            minutesTrackedForTargetYear += (trackedHours * 60) + trackedMinutes;
                        }
                    }
                });

                const transformedSkills: SkillYear[] = Object.entries(skillsByYear)
                    .map(([year, skillMap]): SkillYear => ({
                        year,
                        skills: Array.from(skillMap.values())
                    }))
                    .sort((a, b) => Number(a.year) - Number(b.year));

                if (minutesTrackedForTargetYear > 0) {
                    setCodingTimeSummary({
                        year: 2025,
                        totalMinutes: minutesTrackedForTargetYear,
                        hours: Math.floor(minutesTrackedForTargetYear / 60),
                        minutes: minutesTrackedForTargetYear % 60
                    });
                } else {
                    setCodingTimeSummary(null);
                }

                setSkills(transformedSkills);
                setError(null);
            } catch (err) {
                console.error('Error fetching skills:', err);
                setError(err instanceof Error ? err.message : 'Failed to load skills');
                setSkills([]);
                setCodingTimeSummary(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return {
        skills,
        loading,
        error,
        codingTimeSummary
    };
};
