import { ProjectData } from "../../types";
import { terminalCommands } from "./task-manager/terminal";
import { snippet } from "./task-manager/snippet";
import { TaskManagerDemo } from "./task-manager/preview";

export const softwareEngineering: ProjectData = {
    title: "Software Engineering",
    file: "task_manager.py",
    language: "python",
    terminal: true,
    snippetHeight: 620,
    project: {
        name: "Development/TaskFlow",
        branch: "app"
    },
    terminalCommands,
    snippet,
    preview: {
        type: "component",
        content: TaskManagerDemo
    }
};
