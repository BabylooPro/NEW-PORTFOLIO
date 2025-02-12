import { ProjectData } from "../../types";
import { terminalCommands } from "./deploy/terminal";
import { snippet } from "./deploy/snippet";
import { DevOpsDemo } from "./deploy/preview";

export const devops: ProjectData = {
    title: "DevOps & Cloud",
    file: "deploy.yml",
    language: "yaml",
    terminal: true,
    snippetHeight: 500,
    project: {
        name: "Development/Infrastructure",
        branch: "deployments"
    },
    terminalCommands,
    snippet,
    preview: {
        type: "component",
        content: DevOpsDemo
    }
};
