import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { ScrollArea, ScrollAreaRef } from "@/components/ui/scroll-area";

// ACCESS THE SAME GLOBAL STATE AS USEIDSTATE
declare global {
    interface Window {
        __animationId?: number;
        __shouldAnimate?: boolean;
    }
}

interface TypedSyntaxHighlighterProps {
    code: string;
    language: string;
    isCompleted: boolean;
    onComplete: () => void;
    activeFile: string;
    progress: number;
    onProgressChange: (progress: number) => void;
    isPaused?: boolean;
}

export const TypedSyntaxHighlighter: React.FC<TypedSyntaxHighlighterProps> = ({
    code,
    language,
    isCompleted,
    onComplete,
    activeFile,
    progress,
    onProgressChange,
    isPaused = false
}) => {
    const [displayedCode, setDisplayedCode] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<ScrollAreaRef>(null);
    const animationRef = useRef<number | null>(null);
    const typeSpeedRef = useRef<number>(20); // MS PER CHARACTER
    const indexRef = useRef<number>(0);

    // LOAD INITIAL STATE ONLY ONCE
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // INITIALIZE STATE BASED ON PROPS
        indexRef.current = progress;
        setDisplayedCode(code.slice(0, progress));

        // SETUP CURSOR BLINK INTERVAL
        const cursorInterval = setInterval(() => {
            if (!isCompleted) {
                setShowCursor(prev => !prev);
            }
        }, 500);

        return () => {
            // CLEANUP
            clearInterval(cursorInterval);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, []);

    // AUTO-SCROLL TO BOTTOM AS CONTENT CHANGES
    useEffect(() => {
        if (containerRef.current && !isCompleted) {
            containerRef.current.scrollToBottom();
        }
    }, [displayedCode, isCompleted]);

    // USE EFFECT FOR ANIMATION RUNNING
    useEffect(() => {
        // SKIP IN SSR
        if (typeof window === 'undefined') return;

        // REFS TO TRACK CURRENT STATE
        const shouldBeTyping = !isPaused && !isCompleted && progress < code.length;

        // ONLY UPDATE STATE IF NEEDED TO PREVENT RENDER LOOPS
        if (shouldBeTyping !== isTyping) {
            setIsTyping(shouldBeTyping);
        }

        // CLEAN UP PREVIOUS ANIMATION
        if (!shouldBeTyping && animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        // UPDATE DISPLAYED CODE ONLY IF PROGRESS CHANGED
        if (progress !== indexRef.current) {
            indexRef.current = progress;
            setDisplayedCode(code.slice(0, progress));
        }
    }, [code, isPaused, isCompleted, progress, isTyping]);

    // SEPARATE EFFECT FOR ANIMATION FRAME HANDLING
    useEffect(() => {
        if (!isTyping) return;

        let isMounted = true;
        let lastTime = 0;

        // ANIMATION FUNCTION
        const animate = (time: number) => {
            if (!isMounted) return;

            if (!lastTime) lastTime = time;
            const delta = time - lastTime;

            if (delta > typeSpeedRef.current) {
                lastTime = time;
                if (progress < code.length && !isPaused && !isCompleted && isTyping) {
                    onProgressChange(progress + 1);
                }
            }

            // CONTINUE ANIMATION IF CONDITIONS ARE MET
            if (progress < code.length && !isPaused && !isCompleted && isTyping) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        // START ANIMATION
        animationRef.current = requestAnimationFrame(animate);

        // CLEANUP
        return () => {
            isMounted = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [isTyping, isPaused, isCompleted, progress, code.length, onProgressChange, typeSpeedRef]);

    return (
        <ScrollArea ref={containerRef} className="h-[520px] overflow-auto">
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
                {/* DISPLAYED CODE WITH CURSOR */}
                {displayedCode + (showCursor && !isCompleted ? "|" : "")}
            </SyntaxHighlighter>
        </ScrollArea>
    );
}; 
