import { ProjectData } from "../../types";
import { snippet as userManagementSnippet } from "./user-management/snippet";
import { terminalCommands as userManagementTerminal } from "./user-management/terminal";
import { preview as userManagementPreview } from "./user-management/preview";
import { snippet as authMiddlewareSnippet } from "./auth-middleware/snippet";
import { terminalCommands as authMiddlewareTerminal } from "./auth-middleware/terminal";
import { preview as authMiddlewarePreview } from "./auth-middleware/preview";
import { snippet as userServiceSnippet } from "./user-service/snippet";
import { terminalCommands as userServiceTerminal } from "./user-service/terminal";
import { preview as userServicePreview } from "./user-service/preview";

export const backendDevelopment: ProjectData[] = [
    {
        title: "Backend Development",
        file: "UsersController.cs",
        language: "csharp",
        terminal: true,
        snippetHeight: 555,
        snippet: userManagementSnippet,
        terminalCommands: userManagementTerminal,
        preview: userManagementPreview,
        project: {
            name: "Development/Backend",
            branch: "main"
        }
    },
    {
        title: "Backend Development",
        file: "UserService.cs",
        language: "csharp",
        terminal: true,
        snippetHeight: 555,
        snippet: userServiceSnippet,
        terminalCommands: userServiceTerminal,
        preview: userServicePreview,
        project: {
            name: "Development/Backend",
            branch: "main"
        }
    },
    {
        title: "Backend Development",
        file: "JwtAuthMiddleware.cs",
        language: "csharp",
        terminal: true,
        snippetHeight: 555,
        snippet: authMiddlewareSnippet,
        terminalCommands: authMiddlewareTerminal,
        preview: authMiddlewarePreview,
        project: {
            name: "Development/Backend",
            branch: "main"
        }
    },
];
