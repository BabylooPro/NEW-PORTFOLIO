import React from "react";
import { FileCode, X } from "lucide-react";
import { getLanguageInfo } from "../utils/language-utils";

interface FileTabProps {
    file: string;
    language?: string;
    isActive: boolean;
    progress: number;
    isComplete: boolean;
    hoverToClose: boolean;
    onSelect: () => void;
    onClose: (e: React.MouseEvent) => void;
}

export const FileTab: React.FC<FileTabProps> = ({
    file,
    language,
    isActive,
    progress,
    isComplete,
    hoverToClose,
    onSelect,
    onClose
}) => {
    const { iconClass } = getLanguageInfo(language);
    const showDot = progress > 0 && !isComplete;

    return (
        <button
            onClick={onSelect}
            className={`
                group relative pl-3 pr-7 py-1.5 rounded-xl text-sm transition-colors
                flex items-center gap-2
                ${isActive ? "bg-neutral-200 dark:bg-neutral-800" : "hover:bg-neutral-200 dark:hover:bg-neutral-800"}
                ${progress > 0 && !isComplete ? "text-orange-400" : isComplete ? "text-green-400" : ""}
            `}
        >
            {/* ICON DEVICON OR DEFAULT FILE CODE ICON */}
            {iconClass ? (
                <i className={`${iconClass} text-base`} />
            ) : (
                <FileCode className="w-4 h-4" />
            )}

            {/* FILE NAME */}
            <span className="z-10 mr-1">{file}</span>

            {/* IS ACTIVE OR HOVER TO CLOSE AND NOT COMPLETE, SHOW CLOSE BUTTON OR DOT */}
            <div className="absolute right-1">
                {(isActive || (hoverToClose && !showDot)) ? (
                    <X
                        className={`w-6 h-6 p-[4px] rounded-xl text-foreground bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 ${!isActive && 'opacity-0 group-hover:opacity-100'}`}
                        onClick={onClose}
                    />
                ) : showDot && (
                    <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full dark:bg-white bg-neutral-300" />
                    </div>
                )}
            </div>
        </button>
    );
}; 
