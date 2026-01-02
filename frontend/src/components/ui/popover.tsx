"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            {...props}
            className="z-[99]"
        >
            <AnimatePresence>
                <motion.div
                    className={cn(
                        "z-[99] overflow-hidden rounded-xl border bg-neutral-100 dark:bg-neutral-900 px-3.5 py-2 text-sm text-popover-foreground shadow-md",
                        className
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.4 } }}
                    style={{ transformOrigin: "var(--radix-popover-content-transform-origin)" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
