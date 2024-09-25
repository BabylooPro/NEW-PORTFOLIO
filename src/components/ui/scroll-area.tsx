"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

type ScrollAreaRef = {
	scrollToTop: () => void;
	scrollToBottom: () => void;
	checkScrollPosition: () => { isAtTop: boolean; isAtBottom: boolean };
};

const ScrollArea = React.forwardRef<
	ScrollAreaRef,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
		onScrollChange?: (isAtTop: boolean, isAtBottom: boolean) => void;
	}
>(({ className, children, onScrollChange, ...props }, ref) => {
	const viewportRef = React.useRef<HTMLDivElement>(null);

	const scrollToTop = () => {
		if (viewportRef.current) {
			viewportRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	const scrollToBottom = () => {
		if (viewportRef.current) {
			viewportRef.current.scrollTo({
				top: viewportRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	};

	const checkScrollPosition = React.useCallback(() => {
		if (viewportRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
			const isAtTop = scrollTop === 0;
			const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
			onScrollChange?.(isAtTop, isAtBottom);
			return { isAtTop, isAtBottom };
		}
		return { isAtTop: true, isAtBottom: true };
	}, [onScrollChange]);

	React.useImperativeHandle(
		ref,
		() =>
			({
				scrollToTop,
				scrollToBottom,
				checkScrollPosition,
			} as ScrollAreaRef)
	);

	return (
		<ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)} {...props}>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				className="h-full w-full rounded-[inherit]"
				onScroll={checkScrollPosition}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			"flex touch-none select-none transition-colors",
			orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
			orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
			className
		)}
		{...props}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
export type { ScrollAreaRef };
