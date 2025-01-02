import { useEffect, useState } from "react";
import { SkillYear, Skill } from "./types";

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
        skillYear: {
            year: string;
        } | null;
    };
}

export const useSkills = () => {
    const [skills, setSkills] = useState<SkillYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/strapi?path=skills');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

                if (!result?.data) {
                    throw new Error('No data received from API');
                }

                const skillsByYear: Record<string, Map<string, Skill>> = {};

                result.data.forEach((item: StrapiSkill) => {
                    const year = item.attributes.skillYear?.year;
                    if (!year) return;
                    if (!skillsByYear[year]) {
                        skillsByYear[year] = new Map();
                    }

                    const skillMap = skillsByYear[year];
                    if (!skillMap.has(item.attributes.name)) {
                        skillMap.set(item.attributes.name, {
                            id: item.id,
                            name: item.attributes.name,
                            icon: item.attributes.icon || undefined,
                            description: item.attributes.description,
                            favorite: item.attributes.favorite,
                            unlike: item.attributes.unlike,
                            star: item.attributes.star ?? undefined,
                            like: item.attributes.like ?? undefined,
                            hours: item.attributes.hours ?? undefined,
                            minutes: item.attributes.minutes ?? undefined
                        });
                    }
                });

                const transformedSkills: SkillYear[] = Object.entries(skillsByYear)
                    .map(([year, skillMap]): SkillYear => ({
                        year,
                        skills: Array.from(skillMap.values())
                    }))
                    .sort((a, b) => Number(a.year) - Number(b.year));

                setSkills(transformedSkills);
                setError(null);
            } catch (err) {
                console.error('Error fetching skills:', err);
                setError(err instanceof Error ? err.message : 'Failed to load skills');
                setSkills([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return {
        skills,
        loading,
        error
    };
}; 
