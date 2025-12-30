export type ExperiencePartialDate = {
    year: number;
    month?: number;
};
export type ExperienceDateRange = {
    start: ExperiencePartialDate;
    end?: ExperiencePartialDate | null;
};


// FORMATS AN EXPERIENCE DATE RANGE INTO A HUMAN-READABLE STRING
export const formatExperienceDateRange = (
    range: ExperienceDateRange,
    options?: {
        locale?: string;
        presentLabel?: string;
        month?: "short" | "long";
    }
) => {
    const locale = options?.locale ?? "en-US";
    const presentLabel = options?.presentLabel ?? "Present";
    const monthStyle = options?.month ?? "short";

    const startLabel = formatExperiencePartialDate(range.start, {
        locale,
        month: monthStyle,
    });

    const end = range.end;
    if (end === undefined) return startLabel;

    const endLabel = end === null ? presentLabel : formatExperiencePartialDate(end, { locale, month: monthStyle });
    if (endLabel === startLabel) return startLabel;

    return `${startLabel} - ${endLabel}`;
};

// HELPER TO FORMAT A SINGLE EXPERIENCE PARTIAL DATE
const formatExperiencePartialDate = (date: ExperiencePartialDate, options: { locale: string; month: "short" | "long" }) => {
    if (date.month == null) return String(date.year);
    const safeMonth = Math.min(Math.max(date.month, 1), 12);
    return new Intl.DateTimeFormat(options.locale, { month: options.month, year: "numeric" }).format(new Date(Date.UTC(date.year, safeMonth - 1, 1)));
};
