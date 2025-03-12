import { useState, useCallback, useEffect, useRef } from "react";
import { backendDevelopment } from "../projects/backend-development/backend-development";
import type { ProjectData } from "../types";

// GLOBAL ANIMATION CONTROLLER
const globalAnimationState = {
    currentId: 0,
    shouldAnimate: false
};

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
    const [isTypingPaused, setIsTypingPaused] = useState(true); // TYPING IS PAUSED BY DEFAULT
    const animationIdRef = useRef(0);

    // LOG INITIAL STATE ONLY - NO AUTO START
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // CLEAR GLOBAL STATE ON MOUNT TO ENSURE A FRESH START
        globalAnimationState.shouldAnimate = false;
        globalAnimationState.currentId = Date.now();
        animationIdRef.current = globalAnimationState.currentId;

        return () => {
            // CLEAN UP GLOBAL STATE ON UNMOUNT
            if (animationIdRef.current === globalAnimationState.currentId) {
                globalAnimationState.shouldAnimate = false;
            }
        };
    }, []);

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
    const handleCodeComplete = useCallback(() => {
        setCompletedSnippets(prev => ({
            ...prev,
            [activeFile]: true
        }));
    }, [activeFile]);

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
    const handleProgressChange = useCallback((progress: number) => {
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
    }, [activeFile, activeSnippet?.snippet?.length]);

    // SIMPLIFIED ANIMATION CONTROL FUNCTION
    const setTypingActive = useCallback((isActive: boolean) => {
        // AVOID STATE UPDATES IF NO CHANGE NEEDED
        if (!isActive && isTypingPaused) {
            return;
        }

        if (isActive && !isTypingPaused) {
            return;
        }

        // UPDATE GLOBAL STATE FIRST
        globalAnimationState.shouldAnimate = isActive;

        // UPDATE STATE - ONE SIMPLE UPDATE
        setIsTypingPaused(!isActive);

        // UPDATE ANIMATION ID ONLY WHEN ACTIVATING
        if (isActive) {
            const newId = Date.now();
            globalAnimationState.currentId = newId;
            animationIdRef.current = newId;
        }
    }, [isTypingPaused]);

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
        isTypingPaused,
        handleFileChange,
        handleCloseTab,
        handleFileSelect,
        handleCodeComplete,
        handleTerminalUse,
        handleTerminalComplete,
        handleProgressChange,
        setTypingActive
    };
}; 
