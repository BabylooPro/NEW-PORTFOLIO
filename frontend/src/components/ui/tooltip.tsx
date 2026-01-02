"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const content = (
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            {...props}
            className="z-[99999] relative"
            style={{
                position: "relative",
                zIndex: 99999,
            }}
        >
            <AnimatePresence>
                <motion.div
                    className={cn(
                        "z-[99999] overflow-hidden max-w-lg rounded-xl bg-neutral-100/30 dark:bg-neutral-900/70 backdrop-blur-md px-3.5 py-2 text-sm text-popover-foreground shadow-md",
                        "hidden md:block",
                        className
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.4 } }}
                    style={{
                        transformOrigin: "var(--radix-tooltip-content-transform-origin)",
                        position: "relative",
                        zIndex: 99999,
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </TooltipPrimitive.Content>
    );

    if (!mounted) return null;

    // PORTAL TO RENDER TOOLTIP CONTENT AT HIGHEST POSSIBLE LEVEL
    return createPortal(content, document.body);
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
