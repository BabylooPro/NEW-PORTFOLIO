"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import ScrollIndicator from "../../../../components/ui/scroll-indicator";
import { ChevronDown, ChevronUp, MousePointerClick, Star } from "lucide-react";

interface PickerWheelProps {
	items: Array<{ value: string; isFavorite: boolean }>;
	wheelWidth?: string;
	wheelHeight?: string;
	itemHeight?: number;
	selectedColor?: string;
	unselectedColor?: string;
	onChange?: (selectedItem: string, selectedIndex: number) => void;
	onItemClick?: (selectedItem: string, selectedIndex: number) => void;
	initialSelectedItem?: string;
}

const PickerWheel = React.forwardRef<HTMLDivElement, PickerWheelProps>(
	(
		{
			items = [],
			wheelWidth = "w-52",
			wheelHeight = "h-72",
			itemHeight = 60,
			selectedColor = "bg-red-500 text-white font-bold border-2 border-foreground",
			unselectedColor = "text-neutral-500",
			onChange,
			onItemClick,
			initialSelectedItem,
		},
		ref
	) => {
		const calculatedInitialIndex = initialSelectedItem
			? items.findIndex((item) => item.value === initialSelectedItem)
			: Math.floor(items.length / 2); // CALCULATE INITIAL INDEX
		const [selectedIndex, setSelectedIndex] = useState(calculatedInitialIndex); // STATE FOR SELECTED INDEX
		const containerRef = useRef<HTMLDivElement>(null); // REF FOR CONTAINER
		const [containerHeight, setContainerHeight] = useState(0); // STATE FOR CONTAINER HEIGHT
		const lenisRef = useRef<Lenis | null>(null); // REF FOR LENIS

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const scrollAreaRef = useRef<any>(null); // REF FOR SCROLL AREA
		const [isClickScrolling, setIsClickScrolling] = useState(false); // STATE FOR CLICK SCROLLING
		const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null); // REF FOR CLICK TIMEOUT

		// EFFECT TO UPDATE CONTAINER HEIGHT
		useEffect(() => {
			// FUNCTION TO UPDATE CONTAINER HEIGHT
			const updateContainerHeight = () => {
				if (containerRef.current) {
					setContainerHeight(containerRef.current.clientHeight);
				}
			};

			updateContainerHeight(); // UPDATE CONTAINER HEIGHT
			window.addEventListener("resize", updateContainerHeight); // ADD EVENT LISTENER FOR RESIZE

			// IF CONTAINER REF EXISTS, INITIALIZE LENIS
			if (containerRef.current) {
				lenisRef.current = new Lenis({
					wrapper: containerRef.current,
					content: containerRef.current,
					duration: 2,
					easing: (t) => Math.min(1, 1.01 - Math.pow(2, -20 * t)),
					orientation: "vertical",
					gestureOrientation: "vertical",
					smoothWheel: true,
					wheelMultiplier: 1,
					touchMultiplier: 1,
				});

				// RAF FUNCTION TO UPDATE LENIS
				const raf = (time: number) => {
					lenisRef.current?.raf(time);
					requestAnimationFrame(raf);
				};
				requestAnimationFrame(raf);
			}

			// CLEANUP FUNCTION
			return () => {
				window.removeEventListener("resize", updateContainerHeight);
				lenisRef.current?.destroy();
			};
		}, []);

		const paddingHeight = Math.max(0, (containerHeight - itemHeight) / 2); // CALCULATE PADDING HEIGHT

		// CALLBACK FUNCTION TO HANDLE SCROLL
		const handleScroll = useCallback(() => {
			// IF CONTAINER REF EXISTS AND IS NOT CLICK SCROLLING, UPDATE SELECTED INDEX
			if (containerRef.current && !isClickScrolling) {
				// GET SCROLL TOP AND CALCULATE CENTER POSITION
				const { scrollTop } = containerRef.current;
				const centerPosition = scrollTop + containerHeight / 2;

				// CALCULATE NEW INDEX
				const newIndex = Math.floor((centerPosition - paddingHeight) / itemHeight);

				// ADJUST INDEX IF OUT OF BOUNDS
				const adjustedIndex = Math.max(0, Math.min(newIndex, items.length - 1));

				// IF ADJUSTED INDEX IS NOT SAME AS SELECTED INDEX, UPDATE SELECTED INDEX
				if (adjustedIndex !== selectedIndex) {
					setSelectedIndex(adjustedIndex);
					onChange?.(items[adjustedIndex].value, adjustedIndex);
				}
			}
		}, [
			items,
			itemHeight,
			onChange,
			containerHeight,
			paddingHeight,
			selectedIndex,
			isClickScrolling,
		]);

		// EFFECT TO ADD SCROLL EVENT LISTENER
		useEffect(() => {
			const container = containerRef.current;
			if (container) {
				container.addEventListener("scroll", handleScroll);
				return () => {
					container.removeEventListener("scroll", handleScroll);
				};
			}
		}, [handleScroll]);

		// UPDATE HANDLE ITEM CLICK
		const handleItemClick = (index: number) => {
			setSelectedIndex(index);
			setIsClickScrolling(true);

			if (clickTimeoutRef.current) {
				clearTimeout(clickTimeoutRef.current);
			}

			const scrollPosition = Math.max(
				0,
				index * itemHeight - containerHeight / 2 + itemHeight / 2
			);

			lenisRef.current?.scrollTo(scrollPosition, { immediate: false, duration: 0.5 });

			onChange?.(items[index].value, index);
			onItemClick?.(items[index].value, index);

			clickTimeoutRef.current = setTimeout(() => {
				setIsClickScrolling(false);
			}, 500);
		};

		// EFFECT TO CLEAR CLICK TIMEOUT
		useEffect(() => {
			return () => {
				if (clickTimeoutRef.current) {
					clearTimeout(clickTimeoutRef.current);
				}
			};
		}, []);

		// FUNCTION TO GET BUTTON SCALE BASED ON INDEX
		const getButtonScale = (index: number) => {
			const distance = Math.abs(index - (selectedIndex ?? 0)); // CALCULATE DISTANCE
			if (distance === 0) return 1; // IF DISTANCE IS 0, RETURN 1
			if (distance === 1) return 0.9; // IF DISTANCE IS 1, RETURN 0.9
			return 0.8; // OTHERWISE RETURN 0.8
		};

		// WRAP SCROLL FUNCTIONS WITH USECALLBACK
		const scrollToTop = useCallback(() => {
			lenisRef.current?.scrollTo(0, { immediate: false });
		}, []);

		const scrollToBottom = useCallback(() => {
			lenisRef.current?.scrollTo(items.length * itemHeight - containerHeight, {
				immediate: false,
			});
		}, [items.length, itemHeight, containerHeight]);

		const checkScrollPosition = useCallback(() => {
			if (containerRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
				return {
					isAtTop: scrollTop === 0,
					isAtBottom: scrollTop + clientHeight >= scrollHeight - 1,
				};
			}
			return { isAtTop: true, isAtBottom: true };
		}, []);

		// UPDATE THE SCROLL AREA REF EFFECT WITH PROPER DEPENDENCIES
		useEffect(() => {
			scrollAreaRef.current = {
				scrollToTop,
				scrollToBottom,
				checkScrollPosition,
			};
		}, [scrollToTop, scrollToBottom, checkScrollPosition]);

		// UPDATE THE CENTER SCROLL EFFECT WITH PROPER DEPENDENCIES
		useEffect(() => {
			const centerIndex = Math.floor(items.length / 2);
			setSelectedIndex(centerIndex);

			const scrollPosition = Math.max(
				0,
				centerIndex * itemHeight - containerHeight / 2 + itemHeight / 2
			);
			lenisRef.current?.scrollTo(scrollPosition, { immediate: true });
		}, [items.length, itemHeight, containerHeight]);

		return (
			<div ref={ref} className={cn("relative", wheelWidth, wheelHeight)}>
				{/* TOP SCROLL INDICATOR */}
				<div className="absolute -top-7 left-0 right-0 z-10 flex justify-center">
					<ScrollIndicator
						scrollAreaRef={scrollAreaRef}
						position="top"
						topIcon={<ChevronUp />}
					/>
				</div>

				{/* CONTAINER */}
				<div
					ref={containerRef}
					className={cn(
						"absolute top-0 left-0 right-0 bottom-0 overflow-y-auto no-scrollbar"
					)}
				>
					{/* PADDING */}
					<div style={{ height: `${paddingHeight}px` }} />

					{/* ANIMATED ITEMS */}
					<AnimatePresence initial={false}>
						{items.map((item, index) => (
							<motion.div
								key={`item-${item.value}-${index}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Button
									variant="outline"
									className={cn(
										"w-full flex flex-col items-center justify-center transition-all duration-200 my-[1px] bg-transparent",
										selectedIndex === index ? selectedColor : unselectedColor
									)}
									style={{
										height: `${itemHeight}px`,
										transform: `scale(${getButtonScale(index)})`,
									}}
									onClick={() => {
										handleItemClick(index);
									}}
								>
									{/* SELECTED ICON */}
									{index === selectedIndex && (
										<motion.div
											className="absolute top-2 right-2"
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
											}}
										>
											<motion.div
												animate={{
													skew: [0, -10, 0, 10, 0],
												}}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													repeatType: "loop",
												}}
											>
												<MousePointerClick className="w-6 h-6 rotate-90" />
											</motion.div>
										</motion.div>
									)}

									{/* ITEM VALUE */}
									<span className="text-center">
										{index === selectedIndex && <span>Reserve - </span>}
										{item.value}
									</span>

									{/* FAVORITE ICON */}
									{item.isFavorite && (
										<div className="flex gap-1 items-center mt-1">
											<Star
												fill="yellow"
												className="w-3 h-3 text-yellow-500"
											/>
											<span
												className={cn(
													"text-xs text-neutral-400",
													index === selectedIndex && "text-white"
												)}
											>
												Favorite time
											</span>
										</div>
									)}
								</Button>
							</motion.div>
						))}
					</AnimatePresence>

					{/* PADDING */}
					<div style={{ height: `${paddingHeight}px` }} />
				</div>

				{/* BOTTOM SCROLL INDICATOR */}
				<div className="absolute -bottom-7 left-0 right-0 z-10 flex justify-center">
					<ScrollIndicator
						scrollAreaRef={scrollAreaRef}
						position="bottom"
						bottomIcon={<ChevronDown />}
					/>
				</div>
			</div>
		);
	}
);

PickerWheel.displayName = "PickerWheel";

export default PickerWheel;
