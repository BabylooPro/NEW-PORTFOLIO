import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar, type ScrollAreaRef } from "@/components/ui/scroll-area";
import { TerminalPreview } from "../../TerminalPreview";
import { Preview } from "./Preview";
import { TypedSyntaxHighlighter } from "./TypedSyntaxHighlighter";
import { FileTab } from "./FileTab";
import { Sidebar } from "./Sidebar";
import { ActionButtons } from "./ActionButtons";
import { useIDEState } from "../hooks/useIDEState";
import { WhatIDoData } from "../constants/what-i-do-data";
import type { ProjectData } from "../types";

interface IDEWindowProps {
    neovim: ProjectData;
    resolvedTheme?: string;
    activeFile: string;
    openFiles: string[];
    initialTypingProgress?: { [key: string]: number };
    initialCompletedSnippets?: { [key: string]: boolean };
    onFileChange: (file: string) => void;
    onCloseFile: (file: string) => void;
}

export interface IDEWindowHandle {
    setTypingActive: (isActive: boolean) => void;
}

export const IDEWindow = forwardRef<IDEWindowHandle, IDEWindowProps>(({
    resolvedTheme,
    activeFile,
    openFiles,
    initialTypingProgress,
    initialCompletedSnippets,
    onFileChange,
    onCloseFile
}, ref) => {
    const [showSidebar, setShowSidebar] = useState(true); // SHOW SIDEBAR
    const ideContainerRef = useRef<HTMLDivElement>(null); // CONTAINER REF
    const [isClientMounted, setIsClientMounted] = useState(false);
    const [isVisible, setIsVisible] = useState<boolean | null>(null);

    // ENSURE ONLY EXECUTE CLIENT-SIDE CODE AFTER MOUNT
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClientMounted(true);
        }
    }, []);

    // IDE STATE
    const {
        showPreview,
        setShowPreview,
        completedSnippets,
        showTerminal,
        setShowTerminal,
        typingProgress,
        hoverToClose,
        setHoverToClose,
        closedTabs,
        activeSnippet,
        isCodeComplete,
        hasUsedTerminalForFile,
        areAllTabsClosed,
        handleFileChange,
        handleCloseTab,
        handleFileSelect,
        handleCodeComplete,
        handleTerminalUse,
        handleTerminalComplete,
        handleProgressChange,
        setClosedTabs,
        isTerminalProcessing,
        isTypingPaused,
        setTypingActive
    } = useIDEState(WhatIDoData, initialTypingProgress, initialCompletedSnippets);

    // EXPOSE METHODS TO PARENT VIA REF
    useImperativeHandle(ref, () => ({
        setTypingActive
    }), [setTypingActive]);

    const scrollAreaRef = useRef<ScrollAreaRef>(null); // SCROLL AREA REF

    // LOG MOUNT FOR DEBUGGING
    useEffect(() => {
        let isComponentMounted = true;

        // FORCE START TYPING AFTER A DELAY - ONLY IF STILL MOUNTED
        const forceStartTimer = setTimeout(() => {
            if (setTypingActive && isComponentMounted) {
                setTypingActive(true);
            }
        }, 500); // FASTER STARTUP

        // CLEANUP ON UNMOUNT - CRITICAL
        return () => {
            isComponentMounted = false;
            clearTimeout(forceStartTimer);

            // ENSURE ANIMATION IS STOPPED ON UNMOUNT
            if (setTypingActive) {
                setTypingActive(false);
            }
        };
    }, [activeFile, setTypingActive]);

    // EFFECT TO HANDLE COMPONENT VISIBILITY - SEPARATE FROM MOUNT/UNMOUNT
    useEffect(() => {
        // SKIP IN SSR
        if (typeof window === 'undefined') return;

        let timeoutId: NodeJS.Timeout | null = null;

        // ONLY HANDLE VISIBILITY CHANGES, NOT INITIAL MOUNT
        if (isVisible !== null) {
            if (isVisible) {
                // DELAY TO PREVENT RAPID STATE CHANGES
                timeoutId = setTimeout(() => {
                    if (setTypingActive) {
                        setTypingActive(true);
                    }
                }, 300);
            } else {
                if (setTypingActive) {
                    setTypingActive(false);
                }
            }
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isVisible, setTypingActive]);

    // INTERSECTION OBSERVER FOR VISIBILITY
    useEffect(() => {
        if (!ideContainerRef.current || typeof window === 'undefined') return;

        let observerInstance: IntersectionObserver;

        // VISIBILITY DETECTION USING INTERSECTION OBSERVER
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                const newIsVisible = entry.isIntersecting;

                // ONLY UPDATE IF VISIBILITY CHANGED TO PREVENT LOOPS
                if (isVisible !== newIsVisible) {
                    setIsVisible(newIsVisible);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(ideContainerRef.current);
        observerInstance = observer;

        return () => {
            if (observerInstance) {
                observerInstance.disconnect();
            }
        };
    }, [isVisible]);

    // SCROLL AREA REF
    useEffect(() => {
        if (scrollAreaRef.current?.viewport) {
            scrollAreaRef.current.viewport.scrollLeft = scrollAreaRef.current.viewport.scrollWidth;
        }
    }, [openFiles]);

    // IF ALL TABS ARE CLOSED
    if (areAllTabsClosed) {
        return (
            // IDE WINDOW
            <div ref={ideContainerRef} className="relative flex flex-col h-[600px] overflow-hidden">
                {/* HEADER */}
                <div className={`p-0 flex items-center border-none h-8 relative ${resolvedTheme === "dark" ? "bg-neutral-800" : "bg-neutral-200"}`}>
                    <div className="flex space-x-2 ml-4 items-center absolute left-0">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-sm font-semibold w-full text-center">
                        Neovim
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 overflow-hidden">
                    {/* EMPTY CONTENT */}
                    <div className="flex-1 flex items-center justify-center flex-col gap-4 bg-neutral-50 dark:bg-neutral-900">
                        <i className="devicon-neovim-plain text-[15rem] text-neutral-200 dark:text-neutral-800" />
                        <p className="text-neutral-400 dark:text-neutral-600">All tabs are closed</p>
                    </div>

                    {/* SIDEBAR */}
                    <Sidebar
                        typingProgress={typingProgress}
                        completedSnippets={completedSnippets}
                        handleFileSelect={(fileId) => {
                            if (closedTabs.includes(fileId)) {
                                const newClosedTabs = closedTabs.filter(id => id !== fileId);
                                setClosedTabs(newClosedTabs);
                            }
                            handleFileSelect(fileId);
                            onFileChange(fileId);
                        }}
                        resolvedTheme={resolvedTheme}
                        activeFile={activeFile}
                        closedTabs={closedTabs}
                        showSidebar={showSidebar}
                    />
                </div>
            </div>
        );
    }

    if (!activeSnippet) return null; // IF NO ACTIVE SNIPPET, RETURN NULL

    return (
        // IDE WINDOW
        <div ref={ideContainerRef} className="relative flex flex-col h-[600px] overflow-hidden">
            {/* HEADER */}
            <div className={`p-0 flex items-center border-none h-8 relative ${resolvedTheme === "dark" ? "bg-neutral-800" : "bg-neutral-200"}`}>
                <div className="flex space-x-2 ml-4 items-center absolute left-0">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-sm font-semibold w-full text-center">
                    {activeSnippet?.title || "Visual Studio Code"}
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="border-b border-neutral-200 dark:border-neutral-800 w-full">
                        <ScrollArea ref={scrollAreaRef} className="w-[calc(100%-5px)]">
                            <div className="flex items-center px-4 min-w-0">
                                <div
                                    className="flex space-x-2 bg-transparent py-2 rounded-lg"
                                    onMouseEnter={() => setHoverToClose(true)}
                                    onMouseLeave={() => setHoverToClose(false)}
                                >
                                    {WhatIDoData.filter(tab => openFiles.includes(tab.file)).map((tab) => (
                                        <FileTab
                                            key={tab.file}
                                            file={tab.file}
                                            language={tab.language}
                                            isActive={activeFile === tab.file}
                                            progress={typingProgress[tab.file] || 0}
                                            isComplete={completedSnippets[tab.file] || false}
                                            hoverToClose={hoverToClose}
                                            onSelect={() => {
                                                handleFileChange(tab.file);
                                                onFileChange(tab.file);
                                            }}
                                            onClose={(e) => {
                                                handleCloseTab(tab.file, e);
                                                onCloseFile(tab.file);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {/* CODE EDITOR */}
                    <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                        <div className={`h-full transition-opacity duration-200 ${showPreview ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100"}`}>
                            <TypedSyntaxHighlighter
                                code={activeSnippet.snippet || ""}
                                language={activeSnippet.language || "plaintext"}
                                isCompleted={isCodeComplete}
                                onComplete={handleCodeComplete}
                                activeFile={activeFile}
                                progress={typingProgress[activeFile] || 0}
                                onProgressChange={handleProgressChange}
                                isPaused={isTypingPaused}
                            />
                        </div>
                        {showPreview && activeSnippet.preview && (
                            <div className="h-full p-4">
                                <Preview preview={activeSnippet.preview} />
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                {!areAllTabsClosed && (
                    <div className="absolute top-8 -right-[200px] z-10 w-[450px] border-l border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                        <ActionButtons
                            showPreview={showPreview}
                            setShowPreview={setShowPreview}
                            showTerminal={showTerminal}
                            isCodeComplete={isCodeComplete}
                            hasUsedTerminalForFile={hasUsedTerminalForFile}
                            handleTerminalUse={handleTerminalUse}
                            activeSnippet={activeSnippet}
                            resolvedTheme={resolvedTheme}
                            isTerminalProcessing={isTerminalProcessing}
                            showSidebar={showSidebar}
                            setShowSidebar={setShowSidebar}
                        />
                    </div>
                )}

                {/* SIDEBAR */}
                <div className="flex h-full">
                    <Sidebar
                        typingProgress={typingProgress}
                        completedSnippets={completedSnippets}
                        handleFileSelect={(fileId) => {
                            if (closedTabs.includes(fileId)) {
                                const newClosedTabs = closedTabs.filter(id => id !== fileId);
                                setClosedTabs(newClosedTabs);
                            }
                            handleFileSelect(fileId);
                            onFileChange(fileId);
                        }}
                        resolvedTheme={resolvedTheme}
                        activeFile={activeFile}
                        closedTabs={closedTabs}
                        showSidebar={showSidebar}
                    />
                </div>
            </div>

            {/* TERMINAL DIALOG */}
            <Dialog open={showTerminal} onOpenChange={setShowTerminal}>
                <DialogContent className="sm:max-w-[800px] p-0 gap-0" hideCloseButton>
                    <DialogTitle className="sr-only">Terminal Window</DialogTitle>
                    <div className="w-full min-h-[400px] bg-black rounded-lg">
                        <div className={`p-0 flex items-center h-8 relative rounded-t-lg ${resolvedTheme === "dark" ? "bg-neutral-800" : "bg-neutral-200"}`}>
                            <div className="flex space-x-2 mt-[5px] ml-4 items-center absolute left-0">
                                <DialogClose className="hover:opacity-80 cursor-pointer">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                </DialogClose>
                                <DialogClose className="hover:opacity-80 cursor-pointer">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                </DialogClose>
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-sm font-semibold w-full text-center">
                                Terminal
                            </div>
                        </div>
                        <TerminalPreview
                            commands={activeSnippet.terminalCommands || []}
                            project={activeSnippet.project}
                            onComplete={handleTerminalComplete}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
});
