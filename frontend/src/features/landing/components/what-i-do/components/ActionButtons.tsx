import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShowInfo } from "@/components/ui/show-info";
import { CodeXml, Fullscreen, SquareTerminal, PanelRightOpen, PanelRightClose } from "lucide-react";
import type { ProjectData } from "../types";

interface ActionButtonsProps {
    showPreview: boolean;
    setShowPreview: (show: boolean) => void;
    showTerminal: boolean;
    isCodeComplete: boolean;
    hasUsedTerminalForFile: boolean;
    handleTerminalUse: () => void;
    activeSnippet: ProjectData | undefined;
    resolvedTheme?: string;
    isTerminalProcessing: boolean;
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    showPreview,
    setShowPreview,
    showTerminal,
    isCodeComplete,
    hasUsedTerminalForFile,
    handleTerminalUse,
    activeSnippet,
    isTerminalProcessing,
    showSidebar,
    setShowSidebar
}) => {
    const [showTerminalPulse, setShowTerminalPulse] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showPreviewPulse, setShowPreviewPulse] = useState(false);

    // SLOW PULSE ANIMATION 
    const slowPulseAnimation = `@keyframes slowPulse {
        0%, 100% { 
            opacity: 1;
            width: 1.75rem;
        }
        50% { 
            opacity: 0.3;
            width: 100px;
        }
    }

    .pulse-button {
        animation-play-state: running;
    }
    
    .pulse-button:hover {
        animation-play-state: paused;
        width: 100px !important;
        opacity: 1 !important;
    }`;

    // ADD KEYFRAMES TO DOCUMENT
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = slowPulseAnimation;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [slowPulseAnimation]);

    // SHOW TERMINAL PULSE
    useEffect(() => {
        if (isCodeComplete && activeSnippet?.terminal && !hasUsedTerminalForFile) {
            setShowTerminalPulse(true);
            const timer = setTimeout(() => setShowTerminalPulse(false), 30000);
            return () => clearTimeout(timer);
        } else {
            setShowTerminalPulse(false);
        }
    }, [isCodeComplete, activeSnippet?.terminal, hasUsedTerminalForFile]);

    // SHOW PREVIEW PULSE
    useEffect(() => {
        if (hasUsedTerminalForFile && !isTerminalProcessing && activeSnippet?.preview) {
            setShowPreviewPulse(true);
            const timer = setTimeout(() => setShowPreviewPulse(false), 30000);
            return () => clearTimeout(timer);
        } else {
            setShowPreviewPulse(false);
        }
    }, [hasUsedTerminalForFile, isTerminalProcessing, activeSnippet?.preview]);

    return (
        <div className="p-[.61rem] border-b pl-1 border-neutral-200 dark:border-neutral-800 hidden md:block">
            <div className="flex gap-1">
                {/* FILES BUTTON (SHOW SIDEBAR)*/}
                <Button
                    size="sm"
                    variant={showSidebar ? "secondary" : "ghost"}
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="w-7 h-7 p-0 group transition-all duration-200 overflow-hidden hover:w-20 origin-left"
                >
                    <div className="flex items-center w-full px-[6px]">
                        {showSidebar ? (
                            <PanelRightClose className="h-4 w-4 flex-shrink-0" />
                        ) : (
                            <PanelRightOpen className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="ml-2 whitespace-nowrap">Files</span>
                    </div>
                </Button>

                {/* CODE BUTTON */}
                <Button
                    size="sm"
                    variant={showPreview ? "ghost" : "secondary"}
                    onClick={() => setShowPreview(false)}
                    className={`w-7 h-7 p-0 group transition-all duration-200 overflow-hidden origin-left ${!showPreview ? "w-20" : "hover:w-20"}`}
                >
                    <div className="flex items-center w-full px-2">
                        <CodeXml className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-2 whitespace-nowrap">Code</span>
                    </div>
                </Button>

                {/* TERMINAL BUTTON */}
                {activeSnippet?.terminal && (
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
                                disabled={!isCodeComplete}
                                className={`h-7 p-0 group transition-all duration-200 overflow-hidden origin-left hover:w-[100px] ${showTerminal ? "w-[100px]" : ""} disabled:hover:w-[100px] ${showTerminalPulse ? "[animation:slowPulse_1s_ease-in-out_infinite] pulse-button" : "w-7"}`}
                            >
                                <div className="flex items-center w-full px-2">
                                    <SquareTerminal className="h-4 w-4 flex-shrink-0" />
                                    <span className="ml-2 whitespace-nowrap">Terminal</span>
                                </div>
                            </Button>
                        </ShowInfo.Content>
                    </ShowInfo>
                )}

                {/* PREVIEW BUTTON */}
                {activeSnippet?.preview && (
                    <ShowInfo wrapMode>
                        <ShowInfo.Description>
                            {!hasUsedTerminalForFile
                                ? "&laquo; I need to use the terminal first to enable the preview. &raquo;"
                                : isTerminalProcessing
                                    ? "&laquo; Terminal commands are still running... &raquo;"
                                    : "&laquo; I can now see the preview of my work. &raquo;"
                            }
                        </ShowInfo.Description>
                        <ShowInfo.Content>
                            <Button
                                size="sm"
                                variant={showPreview ? "secondary" : "ghost"}
                                onClick={() => setShowPreview(true)}
                                disabled={!hasUsedTerminalForFile || isTerminalProcessing}
                                className={`w-7 h-7 p-0 group transition-all duration-200 overflow-hidden origin-left ${showPreview ? "w-24" : "hover:w-24"} disabled:hover:w-24`}
                            >
                                <div className="flex items-center w-full px-2">
                                    <Fullscreen className="h-4 w-4 flex-shrink-0" />
                                    <span className="ml-2 whitespace-nowrap">Preview</span>
                                </div>
                            </Button>
                        </ShowInfo.Content>
                    </ShowInfo>
                )}
            </div>
        </div>
    );
}; 
