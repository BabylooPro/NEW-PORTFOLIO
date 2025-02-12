import { ProjectData } from "../../types";
import { terminalCommands } from "./animated-cards/terminal";
import { snippet } from "./animated-cards/snippet";
import { AnimatedCardsGrid } from "./animated-cards/preview";

export const frontendDevelopment = {
    title: "Frontend Development",
    file: "AnimatedCards.jsx",
    language: "javascript",
    terminal: true,
    snippetHeight: 450,
    terminalCommands,
    snippet,
    project: {
        name: "Development/frontend",
        branch: "feature/animated-cards"
    },
    preview: {
        type: "component" as const,
        content: AnimatedCardsGrid
    }
} satisfies ProjectData;
