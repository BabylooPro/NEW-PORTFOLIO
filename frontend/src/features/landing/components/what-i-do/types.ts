/* eslint-disable @typescript-eslint/no-explicit-any */

export type ProjectData = {
    title: string;
    file: string;
    language: string;
    snippetHeight?: number;
    snippet?: string;
    terminal?: boolean;
    project?: {
        name: string;
        branch: string;
    };
    terminalCommands?: {
        command: string;
        output: string;
        delay?: number;
    }[];
    preview?: {
        type: "json" | "component" | "terminal";
        content: any;
    };
};
