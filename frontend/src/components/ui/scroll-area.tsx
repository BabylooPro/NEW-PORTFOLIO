"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import Lenis from "@studio-freight/lenis";

type ScrollAreaRef = {
	viewport: HTMLDivElement | null;
	scrollToTop: () => void;
	scrollToBottom: () => void;
	checkScrollPosition: () => { isAtTop: boolean; isAtBottom: boolean };
	lenis: Lenis | null;
};

type LenisOptions = {
	lerp?: number;
	duration?: number;
	easing?: (t: number) => number;
	orientation?: "vertical" | "horizontal";
	gestureOrientation?: "vertical" | "horizontal" | "both";
	smoothWheel?: boolean;
	wheelMultiplier?: number;
	touchMultiplier?: number;
	infinite?: boolean;
};

const ScrollArea = React.forwardRef<
	ScrollAreaRef,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
		onScrollChange?: (isAtTop: boolean, isAtBottom: boolean) => void;
		showShadows?: boolean;
		useLenis?: boolean;
		lenisOptions?: LenisOptions;
	}
>(
	(
		{
			className,
			children,
			onScrollChange,
			showShadows = false,
			useLenis = false,
			lenisOptions = {},
			...props
		},
		ref
	) => {
		const viewportRef = React.useRef<HTMLDivElement>(null);
		const [showTopShadow, setShowTopShadow] = React.useState(false);
		const [showBottomShadow, setShowBottomShadow] = React.useState(true);
		const [lenis, setLenis] = React.useState<Lenis | null>(null);

		React.useEffect(() => {
			if (useLenis && viewportRef.current) {
				const lenisInstance = new Lenis({
					wrapper: viewportRef.current,
					content: viewportRef.current,
					lerp: 0.1,
					duration: 1.2,
					orientation: "vertical",
					gestureOrientation: "vertical",
					smoothWheel: true,
					wheelMultiplier: 1,
					touchMultiplier: 1,
					infinite: false,
					...lenisOptions,
				});

				setLenis(lenisInstance);

				const raf = (time: number) => {
					lenisInstance.raf(time);
					requestAnimationFrame(raf);
				};

				requestAnimationFrame(raf);

				return () => {
					lenisInstance.destroy();
					setLenis(null);
				};
			}
		}, [useLenis, lenisOptions]);

		const scrollToTop = () => {
			if (lenis) {
				lenis.scrollTo(0, { immediate: true });
			} else if (viewportRef.current) {
				viewportRef.current.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			}
		};

		const scrollToBottom = () => {
			if (lenis) {
				lenis.scrollTo("bottom", { immediate: true });
			} else if (viewportRef.current) {
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

		React.useImperativeHandle(ref, () => ({
			viewport: viewportRef.current,
			scrollToTop,
			scrollToBottom,
			checkScrollPosition,
			lenis,
		}));

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
					onScroll={useLenis ? undefined : checkScrollPosition}
				>
					{children}
				</ScrollAreaPrimitive.Viewport>
				{!useLenis && <ScrollBar />}
				<ScrollAreaPrimitive.Corner />
			</ScrollAreaPrimitive.Root>
		);
	}
);
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
export type { ScrollAreaRef, LenisOptions };
