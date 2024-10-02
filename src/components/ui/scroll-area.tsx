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
		showShadows?: boolean;
	}
>(({ className, children, onScrollChange, showShadows = false, ...props }, ref) => {
	const viewportRef = React.useRef<HTMLDivElement>(null);
	const [showTopShadow, setShowTopShadow] = React.useState(false);
	const [showBottomShadow, setShowBottomShadow] = React.useState(true);

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
			setShowTopShadow(!isAtTop);
			setShowBottomShadow(!isAtBottom);
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
		<ScrollAreaPrimitive.Root
			className={cn(
				"relative overflow-hidden",
				showShadows &&
					cn(
						showTopShadow &&
							"before:content-[''] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-14 before:bg-gradient-to-b before:from-background before:to-transparent",
						showBottomShadow &&
							"after:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-14 after:bg-gradient-to-t after:from-background after:to-transparent"
					),
				className
			)}
			{...props}
		>
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
