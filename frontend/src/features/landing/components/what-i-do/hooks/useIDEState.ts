import { useState } from "react";
import { backendDevelopment } from "../projects/backend-development/backend-development";
import type { ProjectData } from "../types";

export const useIDEState = (
    WhatIDoData: ProjectData[],
    initialTypingProgress?: { [key: string]: number },
    initialCompletedSnippets?: { [key: string]: boolean }
) => {
    const [activeFile, setActiveFile] = useState(backendDevelopment[0].file);
    const [showPreview, setShowPreview] = useState(false);
    const [completedSnippets, setCompletedSnippets] = useState<Record<string, boolean>>(initialCompletedSnippets || {});
    const [showTerminal, setShowTerminal] = useState(false);
    const [isTerminalProcessing, setIsTerminalProcessing] = useState(false);
    const [hasUsedTerminal, setHasUsedTerminal] = useState<Record<string, boolean>>({});
    const [typingProgress, setTypingProgress] = useState<Record<string, number>>(initialTypingProgress || {});
    const [hoverToClose, setHoverToClose] = useState(false);
    const [closedTabs, setClosedTabs] = useState<string[]>(
        WhatIDoData.filter(tab => tab.file !== backendDevelopment[0].file).map(tab => tab.file)
    );

    const activeSnippet = WhatIDoData.find(item => item.file === activeFile);
    const isCodeComplete = completedSnippets[activeFile] || false;
    const hasUsedTerminalForFile = hasUsedTerminal[activeFile] || false;
    const areAllTabsClosed = WhatIDoData.every(tab => closedTabs.includes(tab.file));

    // HANDLE FILE CHANGE
    const handleFileChange = (file: string) => {
        if (file && file !== activeFile) {
            setActiveFile(file);
            if (!completedSnippets[file]) {
                setShowPreview(false);
            }
        }
    };

    // HANDLE CLOSE TAB
    const handleCloseTab = (file: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setClosedTabs(prev => [...prev, file]);

        if (file === activeFile) {
            const availableTabs = WhatIDoData.filter(tab => !closedTabs.includes(tab.file) && tab.file !== file);
            if (availableTabs.length > 0) {
                handleFileChange(availableTabs[0].file);
            } else {
                handleFileChange('');
            }
        }
    };

    // HANDLE FILE SELECT
    const handleFileSelect = (fileId: string) => {
        if (fileId) {
            setClosedTabs(prev => prev.filter(t => t !== fileId));
            handleFileChange(fileId);
        }
    };

    // HANDLE CODE COMPLETE
    const handleCodeComplete = () => {
        setCompletedSnippets(prev => ({
            ...prev,
            [activeFile]: true
        }));
    };

    // HANDLE TERMINAL USE
    const handleTerminalUse = () => {
        setShowTerminal(true);
        setIsTerminalProcessing(true);
        setHasUsedTerminal(prev => ({
            ...prev,
            [activeFile]: true
        }));
    };

    // HANDLE TERMINAL COMPLETE
    const handleTerminalComplete = () => {
        setShowTerminal(false);
        setIsTerminalProcessing(false);
        setShowPreview(true);
    };

    // HANDLE PROGRESS CHANGE
    const handleProgressChange = (progress: number) => {
        // SET TYPING PROGRESS
        setTypingProgress(prev => ({
            ...prev,
            [activeFile]: progress
        }));

        // IF PROGRESS IS EQUAL TO THE ACTIVE SNIPPET LENGTH, SET COMPLETED SNIPPETS
        if (progress === activeSnippet?.snippet?.length) {
            setCompletedSnippets(prev => ({
                ...prev,
                [activeFile]: true
            }));
        }
    };

    return {
        activeFile,
        showPreview,
        setShowPreview,
        completedSnippets,
        showTerminal,
        setShowTerminal,
        hasUsedTerminal,
        typingProgress,
        hoverToClose,
        setHoverToClose,
        closedTabs,
        setClosedTabs,
        activeSnippet,
        isCodeComplete,
        hasUsedTerminalForFile,
        areAllTabsClosed,
        isTerminalProcessing,
        handleFileChange,
        handleCloseTab,
        handleFileSelect,
        handleCodeComplete,
        handleTerminalUse,
        handleTerminalComplete,
        handleProgressChange
    };
}; 
