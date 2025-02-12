import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

interface TypedSyntaxHighlighterProps {
    code: string;
    language: string;
    isCompleted: boolean;
    onComplete: () => void;
    activeFile: string;
    progress: number;
    onProgressChange: (progress: number) => void;
}

export const TypedSyntaxHighlighter: React.FC<TypedSyntaxHighlighterProps> = ({
    code,
    language,
    isCompleted,
    onComplete,
    activeFile,
    progress,
    onProgressChange
}) => {
    const [displayedCode, setDisplayedCode] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [isTyping, setIsTyping] = useState(true);
    const { resolvedTheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    // OBSERVE SCROLL AREA
    useEffect(() => {
        // OBSERVE SCROLL AREA
        const observer = new MutationObserver(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        });

        // OBSERVE CONTENT REF
        if (containerRef.current) {
            observer.observe(containerRef.current, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        return () => observer.disconnect(); // DISCONNECT OBSERVER
    }, []);

    useEffect(() => {
        // IF COMPLETED, SET DISPLAYED CODE AND STOP TYPING
        if (isCompleted) {
            setDisplayedCode(code);
            setIsTyping(false);
            setShowCursor(false);
        } else {
            // IF NOT COMPLETED, SET DISPLAYED CODE AND START TYPING
            setDisplayedCode(code.slice(0, progress));
            setIsTyping(true);
            setShowCursor(true);
        }
    }, [code, isCompleted, activeFile, progress]);

    // TYPING EFFECT
    useEffect(() => {
        if (isCompleted) return; // IF COMPLETED, RETURN
        if (!isTyping) return; // IF NOT TYPING, RETURN

        let index = displayedCode.length; // SET INDEX TO DISPLAYED CODE LENGTH

        // TYPING INTERVAL
        const typingInterval = setInterval(() => {
            if (index < code.length) {
                setDisplayedCode((prev) => prev + code[index]);
                onProgressChange(index + 1);
                index++;
            } else {
                setIsTyping(false);
                onComplete();
                clearInterval(typingInterval);
            }
        }, 20);

        return () => clearInterval(typingInterval);
    }, [code, isTyping, onComplete, isCompleted, displayedCode, onProgressChange]);

    // CURSOR EFFECT
    useEffect(() => {
        if (isTyping) return; // IF NOT TYPING, RETURN

        // CURSOR INTERVAL
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
                {/* DISPLAYED CODE WITH CURSOR */}
                {displayedCode + (showCursor && !isCompleted ? "|" : "")}
            </SyntaxHighlighter>
        </div>
    );
}; 
