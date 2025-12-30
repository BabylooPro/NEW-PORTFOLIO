export type ExperiencePartialDate = {
    year: number;
    month?: number;
};
export type ExperienceDateRange = {
    start: ExperiencePartialDate;
    end?: ExperiencePartialDate | null;
};

export type ExperienceDateRangeOptions = {
    locale?: string;
    presentLabel?: string;
    month?: "short" | "long";
};

// COMPUTES DURATION IN MONTHS FOR A GIVEN DATE RANGE
export const getExperienceDateRangeDurationMonths = (range: ExperienceDateRange, now?: Date): number | null => {
    const startYear = range.start.year;
    const startMonth = range.start.month ?? 1;

    if (range.end === undefined) return 1;

    let endYear: number | undefined;
    let endMonth: number | undefined;

    if (range.end === null) {
        if (!now) return null;
        endYear = now.getUTCFullYear();
        endMonth = now.getUTCMonth() + 1;
    } else {
        endYear = range.end.year;
        endMonth = range.end.month ?? 12;
    }

    const startIndex = toMonthIndex(startYear, startMonth);
    const endIndex = toMonthIndex(endYear, endMonth);

    if (endIndex < startIndex) return null;
    return endIndex - startIndex + 1;
};

// FORMATS AN EXPERIENCE DATE RANGE INTO A HUMAN-READABLE STRING
export const formatExperienceDateRange = (range: ExperienceDateRange, options?: ExperienceDateRangeOptions) => {
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

const toMonthIndex = (year: number, month: number) => year * 12 + (month - 1);
