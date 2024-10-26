import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GalleryVerticalEnd } from "lucide-react";
import { ScrollAreaRef } from "@/components/ui/scroll-area";

interface ScrollIndicatorProps {
	scrollAreaRef: React.RefObject<ScrollAreaRef>;
	className?: string;
	position?: "top" | "bottom" | "both";
	topIcon?: React.ReactNode;
	bottomIcon?: React.ReactNode;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
	scrollAreaRef,
	className = "",
	position = "both",
	topIcon = (
		<GalleryVerticalEnd className="w-5 h-5 transform rotate-180 hover:scale-110 hover:text-black hover:dark:text-white transition-all duration-300" />
	),
	bottomIcon = (
		<GalleryVerticalEnd className="w-5 h-5 transform hover:scale-110 hover:text-black hover:dark:text-white transition-all duration-300" />
	),
}) => {
	const [isAtTop, setIsAtTop] = useState(true);
	const [isAtBottom, setIsAtBottom] = useState(false);

	// CHECK SCROLL POSITION ON INTERVAL
	useEffect(() => {
		const checkScrollPosition = () => {
			if (scrollAreaRef.current) {
				const { isAtTop, isAtBottom } = scrollAreaRef.current.checkScrollPosition();
				setIsAtTop(isAtTop);
				setIsAtBottom(isAtBottom);
			}
		};

		// INITIAL CHECK
		checkScrollPosition();

		// SET UP INTERVAL TO CHECK SCROLL POSITION
		const intervalId = setInterval(checkScrollPosition, 100);

		// CLEAN UP
		return () => clearInterval(intervalId);
	}, [scrollAreaRef]);

	// SCROLL TO TOP FUNCTION
	const handleScrollToTop = () => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollToTop();
		}
	};

	// SCROLL TO BOTTOM FUNCTION
	const handleScrollToBottom = () => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollToBottom();
		}
	};

	return (
		<>
			{/* TOP SCROLL INDICATOR */}
			{(position === "top" || position === "both") && (
				<motion.div
					className={`text-neutral-500 dark:text-neutral-400 cursor-pointer flex items-center justify-center w-8 h-8 ${className}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: isAtTop ? 0 : 1 }}
					transition={{
						opacity: { duration: 0.5, ease: "easeInOut" },
					}}
					style={{ pointerEvents: isAtTop ? "none" : "auto" }} // DISABLE POINTER EVENTS WHEN HIDDEN
					onClick={handleScrollToTop}
				>
					<motion.div
						animate={{ y: [0, -10, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						{topIcon}
					</motion.div>
				</motion.div>
			)}

			{/* BOTTOM SCROLL INDICATOR */}
			{(position === "bottom" || position === "both") && (
				<motion.div
					className={`text-neutral-500 dark:text-neutral-400 cursor-pointer flex items-center justify-center w-8 h-8 ${className}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: isAtBottom ? 0 : 1 }}
					transition={{
						opacity: { duration: 0.5, ease: "easeInOut" },
					}}
					style={{ pointerEvents: isAtBottom ? "none" : "auto" }} // DISABLE POINTER EVENTS WHEN HIDDEN
					onClick={handleScrollToBottom}
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						{bottomIcon}
					</motion.div>
				</motion.div>
			)}
		</>
	);
};

export default ScrollIndicator;
