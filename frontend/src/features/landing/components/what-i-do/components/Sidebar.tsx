import React from "react";
import { Tree, Folder, File as FileTree } from "@/components/ui/file-tree";
import { FileCode } from "lucide-react";
import { fileTreeData } from "../utils/file-tree-data";
import { getLanguageInfo } from "../utils/language-utils";
import { WhatIDoData } from "../constants/what-i-do-data";

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

    return (
        <div className={`border-l flex flex-col h-full transition-all duration-200 ${showSidebar ? "w-[250px]" : "w-0"} ${resolvedTheme === "dark" ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-neutral-100"}`}>
            <div className={`flex-1 overflow-y-auto ${areAllTabsClosed ? "pt-[1rem]" : "pt-[4.25rem]"} ${!showSidebar ? "hidden" : ""}`}>
                {/* TITLE */}
                <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 px-2">
                    Explorer: What-I-Do
                </div>

                {/* TREE FILES */}
                <Tree
                    elements={fileTreeData}
                    initialExpandedItems={[
                        "development",
                        "backend",
                        "controllers",
                        "middlewares",
                        "services",
                        "software",
                        "devops"
                    ]}
                >
                    {/* ROOT ITEMS */}
                    {fileTreeData.map((rootItem) => (
                        <Folder
                            key={rootItem.id}
                            element={rootItem.name}
                            value={rootItem.id}
                        >
                            {/* CATEGORY ITEMS */}
                            {rootItem.children?.map((category) => (
                                <Folder
                                    key={category.id}
                                    element={category.name}
                                    value={category.id}
                                >
                                    {category.children?.map((item) => {
                                        if (item.children) {
                                            // IF CHILDREN, RETURN FOLDER
                                            return (
                                                <Folder
                                                    key={item.id}
                                                    element={item.name}
                                                    value={item.id}
                                                >
                                                    {item.children.map((file) => {
                                                        const fileLanguage = WhatIDoData.find(
                                                            d => d.file === file.id
                                                        )?.language;
                                                        const { iconClass } = getLanguageInfo(fileLanguage);
                                                        const textColor = getFileTextColor(file.id);
                                                        const isActive = activeFile === file.id;

                                                        return (
                                                            // FILE TREE ITEM
                                                            <FileTree
                                                                key={file.id}
                                                                value={file.id}
                                                                handleSelect={() => handleFileSelect(file.id)}
                                                                className={`${textColor} ${isActive ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
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
                                                            </FileTree>
                                                        );
                                                    })}
                                                </Folder>
                                            );
                                        } else {
                                            const fileLanguage = WhatIDoData.find(
                                                d => d.file === item.id
                                            )?.language;
                                            const { iconClass } = getLanguageInfo(fileLanguage);
                                            const textColor = getFileTextColor(item.id);
                                            const isActive = activeFile === item.id;

                                            return (
                                                // FILE TREE ITEM
                                                <FileTree
                                                    key={item.id}
                                                    value={item.id}
                                                    handleSelect={() => handleFileSelect(item.id)}
                                                    className={`${textColor} ${isActive ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
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
                                                </FileTree>
                                            );
                                        }
                                    })}
                                </Folder>
                            ))}
                        </Folder>
                    ))}
                </Tree>
            </div>
        </div>
    );
}; 
