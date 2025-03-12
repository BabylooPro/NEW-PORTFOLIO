"use client"

import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type TreeViewElement = {
    id: string
    name: string
    isSelectable?: boolean
    children?: TreeViewElement[]
}

type TreeContextProps = {
    selectedId: string | undefined
    expandedItems: string[] | undefined
    indicator: boolean
    handleExpand: (id: string) => void
    selectItem: (id: string) => void
    setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>
    openIcon?: React.ReactNode
    closeIcon?: React.ReactNode
    direction: "rtl" | "ltr"
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
    const context = useContext(TreeContext)
    if (!context) {
        throw new Error("useTree must be used within a TreeProvider")
    }
    return context
}

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

type Direction = "rtl" | "ltr" | undefined

type TreeViewProps = {
    initialSelectedId?: string
    indicator?: boolean
    elements?: TreeViewElement[]
    initialExpandedItems?: string[]
    openIcon?: React.ReactNode
    closeIcon?: React.ReactNode
} & TreeViewComponentProps

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
    (
        {
            className,
            elements,
            initialSelectedId,
            initialExpandedItems,
            children,
            indicator = true,
            openIcon,
            closeIcon,
            dir,
            ...props
        },
    ) => {
        const [selectedId, setSelectedId] = useState<string | undefined>(
            initialSelectedId,
        )
        const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
            initialExpandedItems,
        )

        const selectItem = useCallback((id: string) => {
            setSelectedId(id)
        }, [])

        const handleExpand = useCallback((id: string) => {
            setExpandedItems((prev) => {
                if (prev?.includes(id)) {
                    return prev.filter((item) => item !== id)
                }
                return [...(prev ?? []), id]
            })
        }, [])

        const expandSpecificTargetedElements = useCallback(
            (elements?: TreeViewElement[], selectId?: string) => {
                if (!elements || !selectId) return
                const findParent = (
                    currentElement: TreeViewElement,
                    currentPath: string[] = [],
                ) => {
                    const isSelectable = currentElement.isSelectable ?? true
                    const newPath = [...currentPath, currentElement.id]
                    if (currentElement.id === selectId) {
                        if (isSelectable) {
                            setExpandedItems((prev) => [...(prev ?? []), ...newPath])
                        } else {
                            if (newPath.includes(currentElement.id)) {
                                newPath.pop()
                                setExpandedItems((prev) => [...(prev ?? []), ...newPath])
                            }
                        }
                        return
                    }
                    if (
                        isSelectable &&
                        currentElement.children &&
                        currentElement.children.length > 0
                    ) {
                        currentElement.children.forEach((child) => {
                            findParent(child, newPath)
                        })
                    }
                }
                elements.forEach((element) => {
                    findParent(element)
                })
            },
            [],
        )

        useEffect(() => {
            if (initialSelectedId) {
                expandSpecificTargetedElements(elements, initialSelectedId)
            }
        }, [initialSelectedId, elements, expandSpecificTargetedElements])

        const direction = dir === "rtl" ? "rtl" : "ltr"

        return (
            <TreeContext.Provider
                value={{
                    selectedId,
                    expandedItems,
                    handleExpand,
                    selectItem,
                    setExpandedItems,
                    indicator,
                    openIcon,
                    closeIcon,
                    direction,
                }}
            >
                <div className={cn("size-full", className)}>
                    <ScrollArea
                        className="h-full relative px-2"
                        dir={dir as Direction}
                    >
                        <AccordionPrimitive.Root
                            {...props}
                            type="multiple"
                            defaultValue={expandedItems}
                            value={expandedItems}
                            className="flex flex-col gap-1"
                            onValueChange={(value) =>
                                setExpandedItems((prev) => [...(prev ?? []), value[0]])
                            }
                            dir={dir as Direction}
                        >
                            {children}
                        </AccordionPrimitive.Root>
                    </ScrollArea>
                </div>
            </TreeContext.Provider>
        )
    },
)

Tree.displayName = "Tree"

const TreeIndicator = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { direction } = useTree()

    return (
        <div
            dir={direction}
            ref={ref}
            className={cn(
                "h-full w-px bg-muted absolute left-1.5 rtl:right-1.5 py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out",
                className,
            )}
            {...props}
        />
    )
})

TreeIndicator.displayName = "TreeIndicator"

interface FolderComponentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
    children?: React.ReactNode;
}

type FolderProps = {
    expandedItems?: string[]
    element: string
    isSelectable?: boolean
    isSelect?: boolean
} & FolderComponentProps

const Folder = forwardRef<
    HTMLDivElement,
    FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
    (
        {
            className,
            element,
            value,
            isSelectable = true,
            isSelect,
            children,
            ...props
        },
    ) => {
        const {
            direction,
            handleExpand,
            expandedItems,
            indicator,
            setExpandedItems,
            openIcon,
            closeIcon,
        } = useTree()

        return (
            <AccordionPrimitive.Item
                {...props}
                value={value}
                className="relative overflow-hidden h-full "
            >
                <AccordionPrimitive.Trigger
                    className={cn(
                        `flex items-center gap-1 text-sm rounded-md`,
                        className,
                        {
                            "bg-muted rounded-md": isSelect && isSelectable,
                            "cursor-pointer": isSelectable,
                            "cursor-not-allowed opacity-50": !isSelectable,
                        },
                    )}
                    disabled={!isSelectable}
                    onClick={() => handleExpand(value)}
                >
                    {expandedItems?.includes(value)
                        ? openIcon ?? <FolderOpenIcon className="size-4" />
                        : closeIcon ?? <FolderIcon className="size-4" />}
                    <span>{element}</span>
                </AccordionPrimitive.Trigger>
                <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
                    {element && indicator && <TreeIndicator aria-hidden="true" />}
                    <AccordionPrimitive.Root
                        dir={direction}
                        type="multiple"
                        className="flex flex-col gap-1 py-1 ml-5 rtl:mr-5 "
                        defaultValue={expandedItems}
                        value={expandedItems}
                        onValueChange={(value) => {
                            setExpandedItems?.((prev) => [...(prev ?? []), value[0]])
                        }}
                    >
                        {children}
                    </AccordionPrimitive.Root>
                </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
        )
    },
)

Folder.displayName = "Folder"

interface FileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    handleSelect?: (value: string) => void;
    fileIcon?: React.ReactNode;
    isSelect?: boolean;
}

// ERROR BOUNDARY
class FileTreeErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="p-2 text-red-500">A error has occurred in the file component</div>;
        }
        return this.props.children;
    }
}

const File = forwardRef<HTMLButtonElement, FileProps>(function FileComponent(props, ref) {
    const {
        className,
        children,
        fileIcon,
        value,
        handleSelect,
        isSelect,
        ...rest
    } = props;

    const { selectItem, selectedId, indicator, direction } = useTree();

    const handleClick = useCallback(() => {
        selectItem(value);
        if (handleSelect) {
            handleSelect(value);
        }
    }, [value, selectItem, handleSelect]);

    return (
        <FileTreeErrorBoundary>
            <Button
                ref={ref}
                variant="ghost"
                className={cn(
                    "flex h-8 items-center text-xs overflow-hidden relative gap-1.5 font-normal w-full justify-start px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900",
                    {
                        "bg-primary/5 text-primary": selectedId === value || isSelect,
                    },
                    className
                )}
                onClick={handleClick}
                {...rest}
            >
                {indicator && <TreeIndicator className="translate-y-[7px]" />}
                <div
                    className={cn("flex items-center gap-1.5", {
                        "pl-6": direction === "ltr" && indicator,
                        "pr-6": direction === "rtl" && indicator,
                    })}
                >
                    {fileIcon ? fileIcon : <FileIcon className="h-3.5 w-3.5" />}
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {children}
                    </span>
                </div>
            </Button>
        </FileTreeErrorBoundary>
    );
});

File.displayName = "FileTree"

const CollapseButton = forwardRef<
    HTMLButtonElement,
    {
        elements: TreeViewElement[]
        expandAll?: boolean
        className?: string
    } & React.HTMLAttributes<HTMLButtonElement>
>(({ elements, expandAll = false, children, ...props }, ref) => {
    const { expandedItems, setExpandedItems } = useTree()

    const expendAllTree = useCallback((elements: TreeViewElement[]) => {
        const expandTree = (element: TreeViewElement) => {
            const isSelectable = element.isSelectable ?? true
            if (isSelectable && element.children && element.children.length > 0) {
                setExpandedItems?.((prev) => [...(prev ?? []), element.id])
                element.children.forEach(expandTree)
            }
        }

        elements.forEach(expandTree)
    }, [setExpandedItems])

    const closeAll = useCallback(() => {
        setExpandedItems?.([])
    }, [setExpandedItems])

    useEffect(() => {
        if (expandAll) {
            expendAllTree(elements)
        }
    }, [expandAll, elements, expendAllTree])

    return (
        <Button
            variant={"ghost"}
            className="h-8 w-fit p-1 absolute bottom-1 right-2"
            onClick={
                expandedItems && expandedItems.length > 0
                    ? closeAll
                    : () => expendAllTree(elements)
            }
            ref={ref}
            {...props}
        >
            {children}
            <span className="sr-only">Toggle</span>
        </Button>
    )
})

CollapseButton.displayName = "CollapseButton"

// REFACTORED STATIC VERSION WITH MORE ROBUST ERROR HANDLING
const FileTreeStatic = ({
    className,
    children,
    fileIcon,
    value,
    handleSelect,
    isSelect,
    ...rest
}: FileProps) => {
    if (!value) {
        console.warn("FileTreeStatic: value prop is required");
        return null;
    }

    // DEFENSIVE HOOK USAGE
    const treeContext = useContext(TreeContext);

    if (!treeContext) {
        console.warn("FileTreeStatic: must be used within a TreeProvider");
        return (
            <Button variant="ghost" className={className} {...rest}>
                {fileIcon || <FileIcon className="h-3.5 w-3.5" />}
                <span>{children}</span>
            </Button>
        );
    }

    const { selectItem, selectedId, indicator, direction } = treeContext;

    const handleClick = useCallback(() => {
        if (value && selectItem) {
            selectItem(value);
            if (handleSelect) {
                handleSelect(value);
            }
        }
    }, [value, selectItem, handleSelect]);

    // ENSURE ALL VALUES EXIST BEFORE RENDERING
    return (
        <FileTreeErrorBoundary>
            <Button
                type="button"
                variant="ghost"
                className={cn(
                    "flex h-8 items-center text-xs overflow-hidden relative gap-1.5 font-normal w-full justify-start px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900",
                    {
                        "bg-primary/5 text-primary": selectedId === value || isSelect,
                    },
                    className
                )}
                onClick={handleClick}
                {...rest}
            >
                {indicator && <TreeIndicator className="translate-y-[7px]" />}
                <div
                    className={cn("flex items-center gap-1.5", {
                        "pl-6": direction === "ltr" && indicator,
                        "pr-6": direction === "rtl" && indicator,
                    })}
                >
                    {fileIcon ? fileIcon : <FileIcon className="h-3.5 w-3.5" />}
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {children}
                    </span>
                </div>
            </Button>
        </FileTreeErrorBoundary>
    );
};

// PURE IMPLEMENTATION WITHOUT FORWARDREF
const DirectFileTree = (props: {
    className?: string;
    children?: React.ReactNode;
    fileIcon?: React.ReactNode;
    value: string;
    handleSelect?: (value: string) => void;
    isSelect?: boolean;
    [key: string]: any;
}) => {
    const {
        className,
        children,
        fileIcon,
        value,
        handleSelect,
        isSelect,
        ...rest
    } = props;

    if (!value) {
        console.warn("DirectFileTree: value prop is required");
        return null;
    }

    // USE DIRECTLY THE HOOKS WITHOUT CONTEXT IF NECESSARY
    const treeContext = useContext(TreeContext);

    if (!treeContext) {
        console.warn("DirectFileTree: must be used within a TreeProvider");
        return (
            <Button variant="ghost" className={className} {...rest}>
                {fileIcon || <FileIcon className="h-3.5 w-3.5" />}
                <span>{children}</span>
            </Button>
        );
    }

    const { selectItem, selectedId, indicator, direction } = treeContext;

    // INTERNAL FUNCTION WITHOUT USEEFFECT OR USECALLBACK
    function handleClick() {
        if (typeof value === "string" && selectItem) {
            selectItem(value);
            if (handleSelect) {
                handleSelect(value);
            }
        }
    }

    return (
        <Button
            type="button"
            variant="ghost"
            className={cn(
                "flex h-8 items-center text-xs overflow-hidden relative gap-1.5 font-normal w-full justify-start px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900",
                {
                    "bg-primary/5 text-primary": selectedId === value || isSelect,
                },
                className
            )}
            onClick={handleClick}
            {...rest}
        >
            {indicator && <TreeIndicator className="translate-y-[7px]" />}
            <div
                className={cn("flex items-center gap-1.5", {
                    "pl-6": direction === "ltr" && indicator,
                    "pr-6": direction === "rtl" && indicator,
                })}
            >
                {fileIcon ? fileIcon : <FileIcon className="h-3.5 w-3.5" />}
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {children}
                </span>
            </div>
        </Button>
    );
};

// UPDATE INDIVIDUAL EXPORTS
export { Tree }
export { Folder }
export { File as FileTree }
export { FileTreeStatic as FileTreeAlt } //! ALTERNATIVE VERSION WITHOUT REF
export { DirectFileTree as SafeFileTree } //! VERSION WITHOUT REF AND REACT.FC
export { CollapseButton }
export type { TreeViewElement }
