import { useQuery } from "@tanstack/react-query";
import type { ExperienceItemProps } from "./experienceItem";

type StrapiExperienceItem = {
    id?: number;
    title?: string | null;
    company?: string | null;
    location?: string | null;
    startYear?: number | string | null;
    startMonth?: number | string | null;
    endYear?: number | string | null;
    endMonth?: number | string | null;
    isCurrent?: boolean | null;
    descriptionItems?: unknown;
    skills?: unknown;
};

interface ExperienceSection {
    data: {
        id: number;
        title: string;
        titleDescription: string;
        paragraphDescription: string;
        experiences?: StrapiExperienceItem[];
    }
}

const toNumberOrNull = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const n = Number(value);
        if (Number.isFinite(n)) return n;
    }
    return null;
};

const toMonthOrUndefined = (value: unknown): number | undefined => {
    const n = toNumberOrNull(value);
    if (n == null) return undefined;
    if (n < 1 || n > 12) return undefined;
    return n;
};

const toStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter(Boolean);
};

const toExperienceItem = (item: StrapiExperienceItem): ExperienceItemProps | null => {
    const title = typeof item.title === "string" ? item.title.trim() : "";
    if (!title) return null;

    const startYear = toNumberOrNull(item.startYear);
    if (startYear == null) return null;

    const startMonth = toMonthOrUndefined(item.startMonth);

    const endYear = toNumberOrNull(item.endYear);
    const endMonth = toMonthOrUndefined(item.endMonth);

    const descriptionItems = toStringArray(item.descriptionItems);
    const skills = toStringArray(item.skills);

    const experience: ExperienceItemProps = {
        id: item.id,
        title,
        company: item.company ?? undefined,
        location: item.location ?? undefined,
        date: {
            start: {
                year: startYear,
                ...(startMonth != null ? { month: startMonth } : {}),
            },
            ...(item.isCurrent ? { end: null } : endYear != null
                ? { end: { year: endYear, ...(endMonth != null ? { month: endMonth } : {}) } }
                : {}),
        },
        ...(descriptionItems.length ? { description: { items: descriptionItems } } : {}),
        ...(skills.length ? { skills } : {}),
    };

    return experience;
};

export const useExperienceSection = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["experienceSection"],
        queryFn: async () => {
            const response = await fetch("/api/strapi?path=experience-section");
            if (!response.ok) {
                throw new Error("Failed to fetch experience section");
            }
            return response.json() as Promise<ExperienceSection>;
        },
    });

    return {
        title: data?.data?.title ?? "My Experience",
        titleDescription: data?.data?.titleDescription ?? "",
        paragraphDescription: data?.data?.paragraphDescription ?? "",
        experiences: (data?.data?.experiences ?? [])
            .map(toExperienceItem)
            .filter((item): item is ExperienceItemProps => item != null),
        loading: isLoading,
    };
}; 
