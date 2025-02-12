import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea, ScrollAreaRef } from '@/components/ui/scroll-area';

interface Command {
    command: string;
    output: string;
    delay?: number;
}

interface TerminalPreviewProps {
    commands: Command[];
    project?: {
        name: string;
        branch: string;
    };
    onComplete?: () => void;
}

interface DisplayedCommand extends Command {
    typedCommand: string;
    typedOutput: string;
    isTypingCommand: boolean;
    isShowingOutput: boolean;
}

export const TerminalPreview: React.FC<TerminalPreviewProps> = ({ commands, project, onComplete }) => {
    const [displayedCommands, setDisplayedCommands] = useState<DisplayedCommand[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollAreaRef = useRef<ScrollAreaRef>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // RESET STATE WHEN COMMANDS CHANGE
    useEffect(() => {
        setDisplayedCommands([]);
        setCurrentIndex(0);
    }, [commands]);

    // AUTO SCROLL TO BOTTOM
    useEffect(() => {
        // OBSERVE SCROLL AREA
        const observer = new MutationObserver(() => {
            if (scrollAreaRef.current?.viewport) {
                const viewport = scrollAreaRef.current.viewport;
                viewport.scrollTop = viewport.scrollHeight;
            }
        });

        // OBSERVE CONTENT REF
        if (contentRef.current) {
            observer.observe(contentRef.current, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        return () => observer.disconnect(); // DISCONNECT OBSERVER
    }, []);

    // TYPE COMMANDS AND DISPLAY OUTPUT
    useEffect(() => {
        if (currentIndex >= commands.length) {
            // WHEN ALL COMMAND IN FINISH, WAITING 2 SECONDS THEN CALL ON COMPLETE
            setTimeout(() => {
                onComplete?.();
            }, 2000);
            return;
        }

        const currentCommand = commands[currentIndex]; // GET CURRENT COMMAND

        // RESET COMMAND AT CURRENT INDEX
        setDisplayedCommands(prev => {
            const updated = [...prev];
            updated[currentIndex] = {
                ...currentCommand,
                typedCommand: "",
                typedOutput: "",
                isTypingCommand: true,
                isShowingOutput: false,
            };
            return updated;
        });

        let commandIndex = 0; // INDEX OF CURRENT COMMAND CHARACTER

        // TYPE COMMAND CHARACTER BY CHARACTER
        const typeCommand = setInterval(() => {
            if (commandIndex < currentCommand.command.length) {
                setDisplayedCommands(prev => {
                    const updated = [...prev];
                    updated[currentIndex] = {
                        ...updated[currentIndex],
                        typedCommand: currentCommand.command.slice(0, commandIndex + 1)
                    };
                    return updated;
                });
                commandIndex++;
            } else {
                clearInterval(typeCommand); // STOP TYPING COMMAND

                // WAIT FOR COMMAND DELAY
                setTimeout(() => {
                    setDisplayedCommands(prev => {
                        const updated = [...prev];
                        updated[currentIndex] = {
                            ...updated[currentIndex],
                            isTypingCommand: false,
                            isShowingOutput: true,
                        };
                        return updated;
                    });

                    // DISPLAY COMMAND OUTPUT
                    const lines = currentCommand.output.split('\n');
                    let lineIndex = 0;

                    // DISPLAY OUTPUT LINE BY LINE
                    const displayNextLine = () => {
                        if (lineIndex < lines.length) {
                            setDisplayedCommands(prev => {
                                const updated = [...prev];
                                updated[currentIndex] = {
                                    ...updated[currentIndex],
                                    typedOutput: lines.slice(0, lineIndex + 1).join('\n')
                                };
                                return updated;
                            });
                            lineIndex++;
                            setTimeout(displayNextLine, 100); // DELAY BETWEEN LINES
                        } else {
                            setTimeout(() => {
                                setCurrentIndex(prev => prev + 1);
                            }, 500);
                        }
                    };

                    displayNextLine(); // START DISPLAYING OUTPUT
                }, 500);
            }
        }, 50);

        return () => clearInterval(typeCommand); // CLEAN UP
    }, [currentIndex, commands, onComplete]);

    // DEFAULT PROJECT INFO
    const defaultProject = {
        name: "project",
        branch: "main"
    };

    const currentProject = project || defaultProject; // GET CURRENT PROJECT

    return (
        <ScrollArea ref={scrollAreaRef} className="h-[350px]">
            <div ref={contentRef} className="font-mono text-sm p-4 text-green-400 break-all max-w-full">
                {displayedCommands.map((cmd, idx) => (
                    <div key={`${idx}-${cmd.command}`} className="mb-4">
                        {/* DISPLAY COMMAND */}
                        <div className="flex items-center flex-wrap">
                            <span className="text-blue-400 mr-1">~/{currentProject.name}</span>
                            <span className="text-neutral-400">{currentProject.branch}*</span>
                            <span className="text-pink-400 ml-2">&gt;</span>
                            <span className="ml-2 break-all">
                                {cmd.typedCommand.split(' ').map((word, i) => (
                                    <span key={i} className={i === 0 ? 'text-green-400' : 'text-white'}>
                                        {i > 0 ? ` ${word}` : word}
                                    </span>
                                ))}
                            </span>
                            {cmd.isTypingCommand && (
                                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1" />
                            )}
                        </div>

                        {/* DISPLAY OUTPUT */}
                        {!cmd.isTypingCommand && cmd.typedOutput && (
                            <div className="mt-1 whitespace-pre-wrap break-all text-green-400">
                                {cmd.typedOutput}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};
