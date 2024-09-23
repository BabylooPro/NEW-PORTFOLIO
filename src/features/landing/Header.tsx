"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { OneClickModeToggle } from "../themes/OneClickModeToggle";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { createPortal } from "react-dom";

// FUNCTION TO RENDER TOOLTIP CONTENT IN A PORTAL
const PortalTooltipContent = ({
	children,
	...props
}: React.PropsWithChildren<React.ComponentProps<typeof TooltipContent>>) => {
	if (typeof window === "undefined") return null;
	return createPortal(<TooltipContent {...props}>{children}</TooltipContent>, document.body);
};

// HEADER COMPONENT
export default function Header() {
	const [isScrolling, setIsScrolling] = useState(false);
	const [isAtTop, setIsAtTop] = useState(true);
	const [isClient, setIsClient] = useState(false);

	// EFFECT TO SET ISCLIENT TO TRUE
	useEffect(() => {
		setIsClient(true);

		// VARIABLE TO STORE SCROLL TIMEOUT
		let scrollTimeout: NodeJS.Timeout;

		// FUNCTION TO HANDLE SCROLL EVENT
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsAtTop(false); // SET FALSE IF NOT AT TOP OF PAGE
				setIsScrolling(true); // SET TRUE IF NOT AT TOP OF PAGE

				clearTimeout(scrollTimeout); // CLEAR SCROLL TIMEOUT IF PRESENT

				// SET SCROLL TIMEOUT TO RESET SCROLLING
				scrollTimeout = setTimeout(() => {
					setIsScrolling(false);
				}, 150);
			} else {
				setIsAtTop(true); // SET TRUE IF AT TOP OF PAGE
				setIsScrolling(false); // SET FALSE IF AT TOP OF PAGE
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(scrollTimeout);
		};
	}, []);

	return (
		<motion.header
			initial={{ opacity: 1 }}
			animate={{ opacity: isScrolling ? 0.5 : 1 }}
			transition={{ duration: 0.3 }}
			className={`overflow-hidden sticky z-50 flex items-center justify-center p-6 max-w-5xl mx-auto shadow-2xl rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-lg transition-all duration-300 ${
				isScrolling ? "top-0" : isAtTop ? "top-10" : "top-10"
			}`}
		>
			<div className="flex flex-col items-center space-y-4">
				{/* PROFILE & DESCRIPTION */}
				<motion.div
					className="flex items-center space-x-4"
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<motion.div
						whileHover={{ scale: 1.1 }}
						transition={{ type: "spring", stiffness: 300, damping: 10 }}
					>
						<Avatar className="w-14 h-14">
							<AvatarImage src="/assets/myFace.png" alt="Profile Image" />
							<AvatarFallback>MR</AvatarFallback>
						</Avatar>
					</motion.div>
					<div className="text-left">
						<h1 className="text-xl font-semibold">Max Remy</h1>
						{/* FullStack Developer for mobile, FullStack Developer | Software Engineer for other sizes */}
						<motion.p
							className="text-neutral-500 sm:hidden"
							initial={{ x: -100, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
						>
							FullStack Developer
						</motion.p>
						<motion.p
							className="text-neutral-500 hidden sm:block"
							initial={{ x: -100, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
						>
							FullStack Developer | Software Engineer
						</motion.p>
					</div>
				</motion.div>

				{/* SEPARATOR HIDDEN ON MOBILE */}
				<Separator className="bg-neutral-500 hidden sm:block" />

				{/* SOCIAL LINKS HIDDEN ON MOBILE */}
				<motion.div
					className="flex items-center space-x-6 hidden sm:flex"
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<TooltipProvider>
						{/* GITHUB */}
						<Tooltip>
							<TooltipTrigger asChild>
								<motion.a
									href="https://github.com/babyloopro"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
									whileHover={{ scale: 1.2, rotate: -10 }}
									whileTap={{ scale: 0.9 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									<Github size={28} />
								</motion.a>
							</TooltipTrigger>
							<PortalTooltipContent side="bottom">
								<span>Github</span>
							</PortalTooltipContent>
						</Tooltip>

						{/* LINKEDIN */}
						<Tooltip>
							<TooltipTrigger asChild>
								<motion.a
									href="https://www.linkedin.com/in/maxremydev/"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									<Linkedin size={28} />
								</motion.a>
							</TooltipTrigger>
							<PortalTooltipContent side="bottom">
								<span>LinkedIn</span>
							</PortalTooltipContent>
						</Tooltip>

						{/* TWITTER/X */}
						<Tooltip>
							<TooltipTrigger asChild>
								<motion.a
									href="https://x.com/babyloopro"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
									whileHover={{ scale: 1.2, rotate: 10 }}
									whileTap={{ scale: 0.9 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									<Twitter size={28} />
								</motion.a>
							</TooltipTrigger>
							<PortalTooltipContent side="bottom">
								<span>Twitter/X</span>
							</PortalTooltipContent>
						</Tooltip>
					</TooltipProvider>
				</motion.div>
			</div>

			{/* CHANGE THEME */}
			{isClient && (
				<div className="absolute right-5 top-5">
					<OneClickModeToggle />
				</div>
			)}
		</motion.header>
	);
}
