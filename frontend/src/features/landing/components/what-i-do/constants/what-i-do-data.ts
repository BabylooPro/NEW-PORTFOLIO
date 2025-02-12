import { backendDevelopment } from "../projects/backend-development/backend-development";
import { softwareEngineering } from "../projects/software-engineering/software-engineering";
import { frontendDevelopment } from "../projects/frontend-development/frontend-development";
import { fullstackDevelopment } from "../projects/fullstack-development/fullstack-development";
import { devops } from "../projects/devops/devops";
import type { ProjectData } from "../types";

export const WhatIDoData: ProjectData[] = [
    ...backendDevelopment,
    softwareEngineering,
    frontendDevelopment,
    fullstackDevelopment,
    devops,
]; 
