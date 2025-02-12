import { ProjectData } from "../../types";
import { terminalCommands } from "./blog/terminal";
import { snippet } from "./blog/snippet";
import { BlogDemo } from "./blog/preview";

export const fullstackDevelopment: ProjectData = {
    title: "FullStack Development",
    file: "blog.tsx",
    language: "typescript",
    snippetHeight: 635,
    snippet,
    preview: {
        type: "component",
        content: BlogDemo
    },
    project: {
        name: "Development/Blogify",
        branch: "web"
    },
    terminal: true,
    terminalCommands
};
