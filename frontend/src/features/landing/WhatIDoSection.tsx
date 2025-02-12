"use client";

import React, { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useWhatIDoSection } from "./utils/useWhatIDoSection";
import { backendDevelopment } from "./components/what-i-do/projects/backend-development/backend-development";
import { IDEWindow } from "./components/what-i-do/components/IDEWindow";
import { WhatIDoData } from "./components/what-i-do/constants/what-i-do-data";

const WhatIDoSection: React.FC = () => {
    const { resolvedTheme } = useTheme(); // FORCE TO GET THEME FROM THE USE THEME HOOK 
    const [isMounted, setIsMounted] = useState(false);
    const { data: sectionData, isLoading } = useWhatIDoSection();

    const [activeFile, setActiveFile] = useState("UsersController.cs"); // ACTIVE FILE
    const [openFiles, setOpenFiles] = useState(["UsersController.cs", "UserService.cs"]); // OPEN FILES

    // TYPING PROGRESS
    const [typingProgress] = useState({
        "UserService.cs": 1000 // 100% OF THE FILE LENGTH
    });

    // COMPLETED SNIPPETS
    const [completedSnippets] = useState({
        "UserService.cs": true // COMPLETED SNIPPETS OF FILE TYPING
    });

    // CHECK IF COMPONENT IS MOUNTED
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // CHECK IF THEME IS RESOLVED, IF COMPONENT IS MOUNTED AND IF DATA IS LOADING
    if (!resolvedTheme || !isMounted || isLoading) {
        return null;
    }

    const activeProject = WhatIDoData.find(project => project.file === activeFile) || backendDevelopment[0]; // GET ACTIVE PROJECT

    // HANDLE FILE CHANGE
    const handleFileChange = (file: string) => {
        setActiveFile(file);
        if (!openFiles.includes(file)) {
            setOpenFiles([...openFiles, file]);
        }
    };

    const handleFileClose = (file: string) => {
        setOpenFiles(openFiles.filter(f => f !== file));
        if (activeFile === file) {
            const remainingFiles = openFiles.filter(f => f !== file);
            if (remainingFiles.length > 0) {
                setActiveFile(remainingFiles[0]);
            }
        }
    };

    return (
        <Section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                {sectionData?.title || "What I Do"}
                <ShowInfo
                    description={
                        <>
                            {sectionData?.titleDescription} <br />{" "}
                            <span className="text-xs text-neutral-500">
                                {sectionData?.paragraphDescription}
                            </span>
                        </>
                    }
                />
            </h2>

            <Card
                className={`rounded-xl overflow-hidden border-none ${resolvedTheme === "dark"
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-black"
                    }`}
            >
                <IDEWindow
                    vscode={activeProject}
                    resolvedTheme={resolvedTheme}
                    activeFile={activeFile}
                    openFiles={openFiles}
                    onFileChange={handleFileChange}
                    onCloseFile={handleFileClose}
                    initialTypingProgress={typingProgress}
                    initialCompletedSnippets={completedSnippets}
                />
            </Card>
        </Section>
    );
};

export default WhatIDoSection;
