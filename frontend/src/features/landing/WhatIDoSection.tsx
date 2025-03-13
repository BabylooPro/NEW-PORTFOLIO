"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useWhatIDoSection } from "./utils/useWhatIDoSection";
import { backendDevelopment } from "./components/what-i-do/projects/backend-development/backend-development";
import { IDEWindow, type IDEWindowHandle } from "./components/what-i-do/components/IDEWindow";
import { WhatIDoData } from "./components/what-i-do/constants/what-i-do-data";

// GLOBAL VARIABLE TO PREVENT INFINITE LOOPS
let isGloballyInitialized = false;

// SIMPLIFIED CLIENT-ONLY WRAPPER COMPONENT
const ClientOnly = ({ children, id }: { children: React.ReactNode, id?: string }) => {
    const [hasMounted, setHasMounted] = useState(false);

    // SINGLE USEEFFECT - DECOUPLED FROM ANIMATIONS
    useEffect(() => {
        if (!hasMounted) {
            // MOUNT ONLY ONCE
            setHasMounted(true);
        }
    }, [hasMounted]);

    if (!hasMounted) {
        return (
            <div id={id} className="h-[600px] w-full flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <i className="devicon-neovim-plain text-[4rem] mb-4"></i>
                    <p>IDE content will load when in view</p>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="h-[600px] w-full flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <i className="devicon-neovim-plain text-[4rem] mb-4"></i>
                    <p>Loading IDE...</p>
                </div>
            </div>
        }>
            {children}
        </Suspense>
    );
};

// GLOBAL CONTROLLER INTERFACE - MINIMAL
declare global {
    interface Window {
        __shouldAnimate?: boolean;
        __animationController?: {
            start: () => void;
            stop: () => void;
        };
    }
}

// SIMPLIFIED CONTROLLER
const createAnimationController = (ideRef: React.RefObject<IDEWindowHandle | null>) => {
    return {
        start: () => {
            if (!ideRef.current?.setTypingActive) return;
            ideRef.current.setTypingActive(true);
        },
        stop: () => {
            if (!ideRef.current?.setTypingActive) return;
            ideRef.current.setTypingActive(false);
        }
    };
};

const WhatIDoSection: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const { data: sectionData, isLoading } = useWhatIDoSection();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [forceShow, setForceShow] = useState(false);
    const ideRef = useRef<IDEWindowHandle>(null);
    const hasStartedTypingRef = useRef(false);
    const initializeOnceRef = useRef(false);

    const [activeFile, setActiveFile] = useState("UsersController.cs");
    const [openFiles, setOpenFiles] = useState(["UsersController.cs", "UserService.cs"]);

    // STATIC TYPING PROGRESS
    const typingProgress = {
        "UserService.cs": 1000 // 100% OF THE FILE LENGTH
    };

    // STATIC COMPLETED SNIPPETS
    const completedSnippets = {
        "UserService.cs": true // COMPLETED SNIPPETS OF FILE TYPING
    };

    // STABILIZED FUNCTIONS WITH USECALLBACK
    const startTypingAnimation = useCallback(() => {
        if (!ideRef.current?.setTypingActive || hasStartedTypingRef.current) return;

        ideRef.current.setTypingActive(true);
        hasStartedTypingRef.current = true;
    }, []);

    const pauseTypingAnimation = useCallback(() => {
        if (!ideRef.current?.setTypingActive) return;

        ideRef.current.setTypingActive(false);
        hasStartedTypingRef.current = false;
    }, []);

    const handleVisibilityChange = useCallback((isVisible: boolean) => {
        setIsInView(isVisible);

        if (isVisible && !hasStartedTypingRef.current) {
            // DELAY ANIMATION TO AVOID CONFLICTS
            setTimeout(startTypingAnimation, 300);
        } else if (!isVisible) {
            pauseTypingAnimation();
        }
    }, [startTypingAnimation, pauseTypingAnimation]);

    // PROTECTED SINGLE INITIALIZATION
    useEffect(() => {
        if (typeof window === 'undefined' || initializeOnceRef.current || isGloballyInitialized) return;

        // MARK AS INITIALIZED TO PREVENT DOUBLE CALLS
        initializeOnceRef.current = true;
        isGloballyInitialized = true;

        // MINIMAL CONFIGURATION
        window.__animationController = createAnimationController(ideRef);
        setIsMounted(true);

        // SHOW AFTER DELAY
        setTimeout(() => {
            setForceShow(true);
        }, 500);

        return () => {
            pauseTypingAnimation();
            isGloballyInitialized = false;
        };
    }, [pauseTypingAnimation]);

    // MINIMALIST INTERSECTION OBSERVER
    useEffect(() => {
        if (!sectionRef.current || typeof window === 'undefined') return;

        const currentRef = sectionRef.current; // STORE REF VALUE
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                handleVisibilityChange(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
    }, [handleVisibilityChange]);

    // PRELIMINARY CHECKS
    if (!resolvedTheme || !isMounted || isLoading) {
        return null;
    }

    const activeProject = WhatIDoData.find(project => project.file === activeFile) || backendDevelopment[0];

    // FILE MANIPULATION FUNCTIONS
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

    // SIMPLIFIED DISPLAY LOGIC
    const shouldShowIDE = isInView || forceShow;

    return (
        <Section onVisibilityChange={handleVisibilityChange} disableAnimations={false}>
            <div ref={sectionRef} className="w-full">
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
                    className={`rounded-xl overflow-hidden border-none ${resolvedTheme === "dark" ? "bg-neutral-900 text-white" : "bg-white text-black"
                        }`}
                >
                    {shouldShowIDE ? (
                        <ClientOnly id="ide-container">
                            <div ref={sectionRef}>
                                <IDEWindow
                                    neovim={activeProject}
                                    resolvedTheme={resolvedTheme}
                                    activeFile={activeFile}
                                    openFiles={openFiles}
                                    onFileChange={handleFileChange}
                                    onCloseFile={handleFileClose}
                                    initialTypingProgress={typingProgress}
                                    initialCompletedSnippets={completedSnippets}
                                    ref={ideRef}
                                />
                            </div>
                        </ClientOnly>
                    ) : (
                        <div className="h-[600px] w-full flex items-center justify-center">
                            <div className="text-center text-neutral-400">
                                <i className="devicon-neovim-plain text-[4rem] mb-4"></i>
                                <p>IDE content will load when in view</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </Section>
    );
};

export default WhatIDoSection;
