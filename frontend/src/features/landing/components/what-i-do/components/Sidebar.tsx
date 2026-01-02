import React, { useState } from "react";
import { FileIcon, FolderIcon, FolderOpenIcon, FileCode } from "lucide-react";
import { fileTreeData } from "../utils/file-tree-data";
import { getLanguageInfo } from "../utils/language-utils";
import { WhatIDoData } from "../constants/what-i-do-data";
import { cn } from "@/lib/utils";

// ERROR BOUNDARY
class SidebarErrorBoundary extends React.Component<
    { children: React.ReactNode; theme?: string },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; theme?: string }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={`p-4 text-xs ${this.props.theme === "dark" ? "text-red-400" : "text-red-600"}`}>
                    An error has occurred in the file explorer.
                    <button
                        className="underline mt-2 block"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// SIMPLIFIED COMPONENTS WITHOUT FORWARDREF
const SimpleTree = ({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string
}) => {
    return (
        <div className={cn("flex flex-col gap-1 px-2", className)}>
            {children}
        </div>
    );
};

// SIMPLIFIED FOLDER COMPONENT - NEUTRAL VERSION
const SimpleFolder = ({
    element,
    children,
    initiallyExpanded = false
}: {
    element: string,
    children?: React.ReactNode,
    initiallyExpanded?: boolean
}) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    return (
        <div className="flex flex-col mb-0">
            <button
                type="button"
                className="flex items-center gap-1 text-sm rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 py-1 px-1"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded
                    ? <FolderOpenIcon className="h-4 w-4" />
                    : <FolderIcon className="h-4 w-4" />
                }
                <span>{element}</span>
            </button>

            {isExpanded && (
                <div className="ml-3 pl-2 flex flex-col gap-0">
                    {children}
                </div>
            )}
        </div>
    );
};

// SIMPLIFIED FILE COMPONENT - MORE COMPACT
const FileItem = ({
    children,
    handleSelect,
    className,
    fileIcon,
    isSelect,
    ...rest
}: {
    children?: React.ReactNode;
    handleSelect?: () => void;
    className?: string;
    fileIcon?: React.ReactNode;
    isSelect?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'onClick'>) => {
    return (
        <button
            type="button"
            onClick={handleSelect}
            className={cn(
                "flex h-7 w-full items-center text-xs overflow-hidden gap-1 px-2 py-1 rounded-xl text-left",
                "font-normal justify-start hover:bg-neutral-100 dark:hover:bg-neutral-800",
                {
                    "bg-neutral-200 dark:bg-neutral-800": isSelect,
                },
                className
            )}
            {...rest}
        >
            <div className="flex items-center gap-1">
                {fileIcon || <FileIcon className="h-3.5 w-3.5" />}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {children}
                </span>
            </div>
        </button>
    );
};

interface SidebarProps {
    typingProgress: Record<string, number>;
    completedSnippets: Record<string, boolean>;
    handleFileSelect: (fileId: string) => void;
    resolvedTheme?: string;
    activeFile: string;
    closedTabs: string[];
    showSidebar: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
    typingProgress,
    completedSnippets,
    handleFileSelect,
    resolvedTheme,
    activeFile,
    closedTabs,
    showSidebar
}) => {
    const getFileTextColor = (fileId: string) => {
        const progress = typingProgress[fileId] || 0; // GET PROGRESS
        const isComplete = completedSnippets[fileId]; // GET COMPLETION STATUS

        // IF CONDITION, RETURN COLOR
        if (isComplete) return "text-green-400";
        if (progress > 0) return "text-orange-400";
        return "";
    };

    const areAllTabsClosed = WhatIDoData.every(tab => closedTabs.includes(tab.file));

    // FUNCTION TO DETERMINE IF A FOLDER SHOULD BE OPENED
    const shouldBeOpen = (id: string, name: string) => {
        // LIST OF FOLDER NAMES THAT SHOULD BE OPENED
        const openFolderNames = ["Development", "Backend", "Controllers", "Services", "Software Engineering", "DevOps"];

        // CHECK EITHER BY ID OR EXACT NAME (CASE INSENSITIVE)
        return openFolderNames.some(folderName =>
            id === folderName.toLowerCase().replace(/\s+/g, '-') ||
            name.toLowerCase() === folderName.toLowerCase()
        );
    };

    return (
        <div className={`border-l flex flex-col h-full transition-all duration-200 hidden md:flex ${showSidebar ? "w-[250px]" : "w-0"} ${resolvedTheme === "dark" ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-neutral-100"}`}>
            <SidebarErrorBoundary theme={resolvedTheme}>
                <div className={`flex-1 overflow-y-auto ${areAllTabsClosed ? "pt-[1rem]" : "pt-[4.25rem]"} ${!showSidebar ? "hidden" : ""}`}>
                    {/* TITLE */}
                    <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 px-2">
                        Explorer: What-I-Do
                    </div>

                    {/* TREE FILES WITH SIMPLIFIED COMPONENTS */}
                    <SimpleTree>
                        {/* ROOT ITEMS */}
                        {fileTreeData.map((rootItem) => (
                            <SimpleFolder
                                key={rootItem.id}
                                element={rootItem.name}
                                initiallyExpanded={shouldBeOpen(rootItem.id, rootItem.name)}
                            >
                                {/* CATEGORY ITEMS */}
                                {rootItem.children?.map((category) => (
                                    <SimpleFolder
                                        key={category.id}
                                        element={category.name}
                                        initiallyExpanded={shouldBeOpen(category.id, category.name)}
                                    >
                                        {category.children?.map((item) => {
                                            if (item.children) {
                                                // IF CHILDREN, RETURN FOLDER
                                                return (
                                                    <SimpleFolder
                                                        key={item.id}
                                                        element={item.name}
                                                        initiallyExpanded={shouldBeOpen(item.id, item.name)}
                                                    >
                                                        {item.children.map((file) => {
                                                            const fileLanguage = WhatIDoData.find(
                                                                d => d.file === file.id
                                                            )?.language;
                                                            const { iconClass } = getLanguageInfo(fileLanguage);
                                                            const textColor = getFileTextColor(file.id);
                                                            const isActive = activeFile === file.id;

                                                            return (
                                                                <FileItem
                                                                    key={file.id}
                                                                    handleSelect={() => handleFileSelect(file.id)}
                                                                    className={textColor}
                                                                    isSelect={isActive}
                                                                    fileIcon={
                                                                        <div className="relative mt-1">
                                                                            {iconClass ? (
                                                                                <i className={`${iconClass} text-base ${textColor}`} />
                                                                            ) : (
                                                                                <FileCode className={`h-4 w-4 ${textColor}`} />
                                                                            )}
                                                                        </div>
                                                                    }
                                                                >
                                                                    {file.name}
                                                                </FileItem>
                                                            );
                                                        })}
                                                    </SimpleFolder>
                                                );
                                            } else {
                                                const fileLanguage = WhatIDoData.find(
                                                    d => d.file === item.id
                                                )?.language;
                                                const { iconClass } = getLanguageInfo(fileLanguage);
                                                const textColor = getFileTextColor(item.id);
                                                const isActive = activeFile === item.id;

                                                return (
                                                    <FileItem
                                                        key={item.id}
                                                        handleSelect={() => handleFileSelect(item.id)}
                                                        className={textColor}
                                                        isSelect={isActive}
                                                        fileIcon={
                                                            <div className="relative mt-1">
                                                                {iconClass ? (
                                                                    <i className={`${iconClass} text-base ${textColor}`} />
                                                                ) : (
                                                                    <FileCode className={`h-4 w-4 ${textColor}`} />
                                                                )}
                                                            </div>
                                                        }
                                                    >
                                                        {item.name}
                                                    </FileItem>
                                                );
                                            }
                                        })}
                                    </SimpleFolder>
                                ))}
                            </SimpleFolder>
                        ))}
                    </SimpleTree>
                </div>
            </SidebarErrorBoundary>
        </div>
    );
}; 
