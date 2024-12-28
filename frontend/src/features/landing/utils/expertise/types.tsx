import { ReactNode } from "react";

export interface Skill {
    id: number;
    name: string;
    icon?: string;
    description?: string | ReactNode;
    favorite?: boolean;
    unlike?: boolean;
    star?: boolean;
    like?: boolean;
    hours?: number;
    minutes?: number;
}

export interface SkillYear {
    year: string;
    skills: Skill[];
}
