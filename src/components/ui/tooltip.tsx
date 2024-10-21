"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
	return (
		<TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} {...props} className="z-[99]">
			<AnimatePresence>
				<motion.div
					className={cn(
						"z-[99] overflow-hidden rounded-lg border bg-neutral-100 dark:bg-neutral-900 px-3.5 py-2 text-sm text-popover-foreground shadow-md",
						"hidden md:block",
						className
					)}
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
					exit={{ opacity: 0, scale: 0, transition: { duration: 0.4 } }}
					style={{ transformOrigin: "var(--radix-tooltip-content-transform-origin)" }}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</TooltipPrimitive.Content>
	);
});

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
