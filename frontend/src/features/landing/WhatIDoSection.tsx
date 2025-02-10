/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card, CardHeader } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWhatIDoSection } from "./utils/useWhatIDoSection";
import { Button } from "@/components/ui/button";
import { backendDevelopment } from "./components/what-i-do/backend-development";
import { softwareEngineering } from "./components/what-i-do/software-engineering";
import { frontendDevelopment } from "./components/what-i-do/frontend-development";
import { fullstackDevelopment } from "./components/what-i-do/fullstack-development";
import { devops } from "./components/what-i-do/devops";
import type { ProjectData } from "./components/what-i-do/types";
import { TerminalPreview } from "./components/TerminalPreview";
import { CodeXml, Fullscreen, SquareTerminal } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { terminal } from "./components/what-i-do/terminal";

const WhatIDoData: ProjectData[] = [
    backendDevelopment,
    softwareEngineering,
    frontendDevelopment,
    fullstackDevelopment,
    devops,
];

const TypedSyntaxHighlighter: React.FC<{
    code: string;
    language: string;
    isCompleted: boolean;
    onComplete: () => void;
    activeFile: string;
}> = ({
    code,
    language,
    isCompleted,
    onComplete,
    activeFile
}) => {
        const [displayedCode, setDisplayedCode] = useState("");
        const [showCursor, setShowCursor] = useState(true);
        const [isTyping, setIsTyping] = useState(true);
        const { resolvedTheme } = useTheme();
        const containerRef = useRef<HTMLDivElement>(null);

        // SIMPLIFIED AUTO-SCROLLING USING A SINGLE REF
        useEffect(() => {
            const observer = new MutationObserver(() => {
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            });

            if (containerRef.current) {
                observer.observe(containerRef.current, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }

            return () => observer.disconnect();
        }, []);

        // RESET WHEN FILE CHANGES
        useEffect(() => {
            if (isCompleted) {
                setDisplayedCode(code);
                setIsTyping(false);
                setShowCursor(false);
            } else {
                setDisplayedCode("");
                setIsTyping(true);
                setShowCursor(true);
            }
        }, [code, isCompleted, activeFile]);

        // TYPING EFFECT
        useEffect(() => {
            if (isCompleted) return;
            if (!isTyping) return;

            let index = displayedCode.length;
            const typingInterval = setInterval(() => {
                if (index < code.length) {
                    setDisplayedCode((prev) => prev + code[index]);
                    index++;
                } else {
                    setIsTyping(false);
                    onComplete();
                    clearInterval(typingInterval);
                }
            }, 20);

            return () => clearInterval(typingInterval);
        }, [code, isTyping, onComplete, isCompleted, displayedCode]);

        // CURSOR BLINKING
        useEffect(() => {
            if (isTyping) return;

            const cursorInterval = setInterval(() => {
                setShowCursor((prev) => !prev);
            }, 500);

            return () => clearInterval(cursorInterval);
        }, [isTyping]);

        return (
            <div ref={containerRef} className="h-[500px] overflow-auto">
                <SyntaxHighlighter
                    language={language}
                    style={resolvedTheme === "dark" ? vscDarkPlus : vs}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        border: 'none',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        lineHeight: 1.5,
                    }}
                    wrapLongLines={true}
                >
                    {displayedCode + (showCursor && !isCompleted ? "|" : "")}
                </SyntaxHighlighter>
            </div>
        );
    };

// PREVIEW COMPONENT
const Preview: React.FC<{ preview: any }> = ({ preview }) => {
    if (!preview) return null;

    switch (preview.type) {
        case "json":
            return (
                <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <pre className="text-sm">
                        {JSON.stringify(preview.content, null, 2)}
                    </pre>
                </div>
            );
        case "component":
            const Component = preview.content;
            return (
                <div className="flex items-center justify-center w-full min-h-[200px]">
                    <Component />
                </div>
            );
        case "terminal":
            return (
                <div className="w-full min-h-[300px] bg-black rounded-lg">
                    <TerminalPreview commands={preview.content} />
                </div>
            );
        default:
            return null;
    }
};

const IDEWindow: React.FC<{
    vscode: typeof WhatIDoData[0];
    resolvedTheme?: string;
    activeFile: string;
    onFileChange: (file: string) => void;
}> = ({ resolvedTheme, activeFile, onFileChange }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [completedSnippets, setCompletedSnippets] = useState<Record<string, boolean>>({});
    const [showTerminal, setShowTerminal] = useState(false);
    const [hasUsedTerminal, setHasUsedTerminal] = useState<Record<string, boolean>>({});
    const activeSnippet = WhatIDoData.find(item => item.file === activeFile);

    const isCodeComplete = completedSnippets[activeFile] || false;
    const hasUsedTerminalForFile = hasUsedTerminal[activeFile] || false;

    // RESET ONLY PREVIEW AND TERMINAL WHEN CHANGING FILES
    useEffect(() => {
        setShowPreview(false);
        setShowTerminal(false);
    }, [activeFile]);

    // RESET STATES WHEN CHANGING FILES
    useEffect(() => {
        setShowPreview(false);
        setShowTerminal(false);
        if (!activeSnippet?.terminal) {
            setHasUsedTerminal(prev => ({
                ...prev,
                [activeFile]: true
            }));
        }
    }, [activeFile, activeSnippet]);

    if (!activeSnippet) return null; // NO ACTIVE SNIPPET

    // HANDLERS FOR BUTTONS IN IDE WINDOW
    const handleCodeComplete = () => {
        setCompletedSnippets(prev => ({
            ...prev,
            [activeFile]: true
        }));
    };

    // HANDLERS FOR BUTTONS IN IDE WINDOW
    const handleTerminalUse = () => {
        setShowTerminal(true);
        setHasUsedTerminal(prev => ({
            ...prev,
            [activeFile]: true
        }));
    };

    // HANDLERS FOR BUTTONS IN IDE WINDOW
    const handleTerminalComplete = () => {
        setShowTerminal(false); // CLOSE TERMINAL
        setShowPreview(true);   // OPEN PEWVIEW
    };

    return (
        <div className="relative flex flex-col h-full">
            <CardHeader
                className={`p-0 flex items-center border-none h-8 relative ${resolvedTheme === "dark" ? "bg-neutral-800" : "bg-neutral-200"
                    }`}
            >
                <div className="flex space-x-2 mt-[10px] ml-4 items-center absolute left-0">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-sm font-semibold w-full text-center">
                    {activeSnippet.title}
                </div>
            </CardHeader>

            {/* BUTTONS FOR CODE, TERMINAL, PREVIEW */}
            <div className="absolute right-0 top-[30px] flex gap-2 z-10 p-2 rounded-bl-md bg-neutral-200 dark:bg-neutral-800">
                <Button
                    size="sm"
                    variant={showPreview ? "ghost" : "secondary"}
                    onClick={() => setShowPreview(false)}
                    className="h-7 text-sm mt-1"
                >
                    <CodeXml className="mr-1 h-3 w-3" />
                    Code
                </Button>

                {/* BUTTONS FOR TERMINAL AND PREVIEW - DISABLED IF NOT READY */}
                {activeSnippet.terminal && (
                    <ShowInfo wrapMode>
                        <ShowInfo.Description>
                            {!isCodeComplete
                                ? "&laquo; I haven't finished writing the code, opening the terminal will cause errors. &raquo;"
                                : "&laquo; I need to run some commands in the terminal to enable the preview. &raquo;"
                            }
                        </ShowInfo.Description>
                        <ShowInfo.Content>
                            <Button
                                size="sm"
                                variant={showTerminal ? "secondary" : "ghost"}
                                onClick={handleTerminalUse}
                                className="h-7 text-sm mt-1"
                                disabled={!isCodeComplete}
                            >
                                <SquareTerminal className="mr-1 h-3 w-3" />
                                Terminal
                            </Button>
                        </ShowInfo.Content>
                    </ShowInfo>
                )}

                {/* BUTTONS FOR TERMINAL AND PREVIEW - DISABLED IF NOT READY */}
                {activeSnippet.preview && (
                    <ShowInfo wrapMode>
                        <ShowInfo.Description>
                            {!hasUsedTerminalForFile
                                ? "&laquo; I need to use the terminal first to enable the preview. &raquo;"
                                : "&laquo; I can now see the preview of my work. &raquo;"
                            }
                        </ShowInfo.Description>
                        <ShowInfo.Content>
                            <Button
                                size="sm"
                                variant={showPreview ? "secondary" : "ghost"}
                                onClick={() => setShowPreview(true)}
                                className="h-7 text-sm mt-1"
                                disabled={!hasUsedTerminalForFile}
                            >
                                <Fullscreen className="mr-1 h-3 w-3" />
                                Preview
                            </Button>
                        </ShowInfo.Content>
                    </ShowInfo>
                )}
            </div>

            {/* TABS FOR SWITCHING FILES */}
            <div className="pr-[300px] border-b border-neutral-200 dark:border-neutral-800">
                <ScrollArea className="w-full">
                    <div className="flex items-center px-4">
                        <div className="flex space-x-2 bg-transparent py-2 rounded-lg w-max">
                            {WhatIDoData.map((tab) => (
                                <button
                                    key={tab.file}
                                    onClick={() => onFileChange(tab.file)}
                                    className={`
                                            px-3 py-1.5 rounded-md text-sm transition-colors
                                            ${activeFile === tab.file
                                            ? "bg-neutral-200 dark:bg-neutral-800"
                                            : "hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                        }
                                `}
                                >
                                    {tab.file}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div >

            {/* CODE AND PREVIEW WINDOW */}
            <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                <div className={`h-full transition-opacity duration-200 ${showPreview ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100"
                    }`}>
                    <TypedSyntaxHighlighter
                        code={activeSnippet.snippet || ""}
                        language={activeSnippet.language}
                        isCompleted={isCodeComplete}
                        onComplete={handleCodeComplete}
                        activeFile={activeFile}
                    />
                </div>
                {showPreview && activeSnippet.preview && (
                    <div className="h-full p-4">
                        <Preview preview={activeSnippet.preview} />
                    </div>
                )}
            </div>

            {/* TERMINAL WINDOW */}
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
                            commands={activeSnippet.terminalCommands || terminal.preview?.content || []}
                            project={activeSnippet.project}
                            onComplete={handleTerminalComplete}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const WhatIDoSection: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const [activeFile, setActiveFile] = useState(WhatIDoData[0].file);
    const [isMounted, setIsMounted] = useState(false);
    const { data: sectionData, isLoading } = useWhatIDoSection();

    // WAIT FOR MOUNT TO AVOID SSR MISMATCH
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // WAIT FOR DATA TO AVOID SSR MISMATCH
    if (!resolvedTheme || !isMounted || isLoading) {
        return null;
    }

    return (
        <Section>
            {/* SECTION TITLE */}
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

            {/* IDE WINDOW */}
            <Card
                className={`rounded-xl overflow-hidden border-none ${resolvedTheme === "dark"
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-black"
                    }`}
            >
                <IDEWindow
                    vscode={WhatIDoData[0]}
                    resolvedTheme={resolvedTheme}
                    activeFile={activeFile}
                    onFileChange={setActiveFile}
                />
            </Card>
        </Section>
    );
};

export default WhatIDoSection;
