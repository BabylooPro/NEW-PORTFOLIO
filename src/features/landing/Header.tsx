"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Github, Linkedin, ArrowLeft, Youtube } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { OneClickModeToggle } from "../themes/OneClickModeToggle";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import AppleEmoji from "@/components/decoration/apple-emoji";
import ShowInfo from "@/components/ui/show-info";

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
	const router = useRouter();
	const pathname = usePathname();
	const [isScrolling, setIsScrolling] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [isCompact, setIsCompact] = useState(false);
	const [isHeaderMoved, setIsHeaderMoved] = useState(false);

	const profileRef = useRef<HTMLDivElement>(null);
	const separatorRef = useRef(null);
	const socialLinksRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		console.log(`isCompact: ${isCompact}`);

		//! Log positions of "Profile & Description" and "Social Links"
		if (profileRef.current) {
			const profileRect = profileRef.current.getBoundingClientRect();
			console.log("Profile & Description position:", {
				top: profileRect.top,
				left: profileRect.left,
				bottom: profileRect.bottom,
				right: profileRect.right,
			});
		}

		if (socialLinksRef.current) {
			const socialLinksRect = socialLinksRef.current.getBoundingClientRect();
			console.log("Social Links position:", {
				top: socialLinksRect.top,
				left: socialLinksRect.left,
				bottom: socialLinksRect.bottom,
				right: socialLinksRect.right,
			});
		}
	}, [isCompact]);

	const handleBackNavigation = () => {
		const pathSegments = pathname.split("/").filter((segment) => segment !== "");
		if (pathSegments.length > 1) {
			const parentPath = "/" + pathSegments.slice(0, -1).join("/");
			router.push(parentPath);
		} else {
			router.push("/");
		}
	};

	const getPreviousPageTitle = () => {
		const pathSegments = pathname.split("/").filter((segment) => segment !== "");
		if (pathSegments.length > 1) {
			// RETURN CAPITALIZED LAST SEGMENT OF PREVIOUS ROUTE
			return (
				pathSegments[pathSegments.length - 2].charAt(0).toUpperCase() +
				pathSegments[pathSegments.length - 2].slice(1)
			);
		}
		return "Home";
	};

	// FETCH GITHUB PROFILE PICTURE
	useEffect(() => {
		const fetchGitHubAvatar = async () => {
			try {
				const response = await fetch("https://api.github.com/users/babyloopro");
				const data = await response.json();
				setAvatarUrl(data.avatar_url); // SET AVATAR URL FROM GITHUB API
			} catch (error) {
				console.error("Failed to fetch GitHub avatar", error);
			}
		};
		fetchGitHubAvatar();
	}, []);

	// EFFECT TO SET ISCLIENT TO TRUE AND HANDLE SCREEN SIZE
	useEffect(() => {
		setIsClient(true);

		const handleResize = () => {
			const isMobile = window.innerWidth < 640;
			setIsSmallScreen(isMobile);
			setIsCompact(false);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		let scrollTimeout: NodeJS.Timeout;

		const handleScroll = () => {
			const isMobile = window.innerWidth < 640;
			if (window.scrollY > 0) {
				setIsScrolling(true);
				setIsHeaderMoved(true);
				if (!isMobile) {
					setIsCompact(true);
				}

				clearTimeout(scrollTimeout);

				scrollTimeout = setTimeout(() => {
					setIsScrolling(false);
				}, 150);
			} else {
				setIsScrolling(false);
				setIsHeaderMoved(false);
				setIsCompact(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
			clearTimeout(scrollTimeout);
		};
	}, []);

	return (
		<>
			{/* WIP BADGE */}
			<div className="fixed top-2 left-2 flex items-center gap-2 z-[99]">
				<ShowInfo
					title="Work In Progress"
					description={
						<>
							This project is currently under active development. <br /> Features and
							content may change frequently.
						</>
					}
					wrapMode={true}
				>
					<Badge className="z-[99] w-full h-7 flex items-center gap-1 cursor-progress">
						<AppleEmoji emojiShortName="construction" size={16} />
						<span>WIP</span>
						<AppleEmoji emojiShortName="construction" size={16} />
					</Badge>
				</ShowInfo>
			</div>

			{/* HEADER */}
			<motion.header
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: "easeInOut", delay: 0.25 }}
				variants={{
					hidden: { opacity: 0, y: 50, scale: 0.9 },
					visible: { opacity: 1, y: 0, scale: 1 },
				}}
				className={`sticky z-50 flex items-center justify-center p-4 sm:p-6 max-xl:w-3/4 w-full max-w-5xl mx-auto shadow-2xl rounded-lg sm:rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-lg transition-all duration-300 ${
					isScrolling ? "top-0" : isHeaderMoved ? "top-6 sm:top-10" : "top-6 sm:top-10"
				}`}
			>
				{/* BACK BUTTON WITH TOOLTIP - ONLY SHOW IF NOT ON HOME PAGE */}
				{pathname !== "/" && (
					<TooltipProvider delayDuration={0}>
						<Tooltip>
							<TooltipTrigger asChild>
								<motion.button
									onClick={handleBackNavigation}
									className="absolute left-4 sm:left-5 top-4 sm:top-5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3 }}
								>
									<ArrowLeft size={24} />
								</motion.button>
							</TooltipTrigger>
							<PortalTooltipContent side="bottom">
								<span>Back to {getPreviousPageTitle()}</span>
							</PortalTooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}

				<LayoutGroup>
					<motion.div
						className={`flex ${
							isCompact
								? "flex-row justify-between items-center w-full mx-10"
								: "flex-col items-center"
						}`}
						initial={{ opacity: 1 }}
						animate={{
							flexDirection: isCompact ? "row" : "column",
							justifyContent: isCompact ? "space-between" : "center",
							alignItems: isCompact ? "center" : "center",
							width: isCompact ? "100%" : "auto",
							transition: { duration: 0.5, ease: "easeInOut" },
						}}
						layout
					>
						{/* PROFILE & DESCRIPTION */}
						<motion.div
							ref={profileRef}
							className={`flex items-center justify-center  ${
								isCompact ? "space-x-2" : "space-x-2 sm:space-x-4"
							}`}
							initial={{ opacity: 0, x: isCompact ? -100 : 100 }}
							animate={{
								opacity: 1,
								x: 0,
								alignSelf: isCompact ? "flex-start" : "center",
								transition: {
									duration: 1,
									ease: "easeInOut",
									delay: isCompact ? 0 : 1,
								},
							}}
							layout
						>
							<motion.div
								whileHover={{ scale: 1.1 }}
								transition={{ type: "spring", stiffness: 300, damping: 10 }}
							>
								<Avatar className="w-10 h-10 sm:w-14 sm:h-14">
									<AvatarImage src={avatarUrl ?? ""} alt="Profile Image" />
									<AvatarFallback>MR</AvatarFallback>
								</Avatar>
							</motion.div>
							<div className="text-left">
								<motion.h1
									className="text-lg sm:text-xl font-semibold"
									initial={{ opacity: 0, y: -20 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: { duration: 0.6, ease: "easeOut" },
									}}
								>
									Max Remy
								</motion.h1>
								<motion.p
									className="text-neutral-500 sm:hidden"
									initial={{ x: -100, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: -100, opacity: 0 }}
									transition={{ duration: 0.6, delay: 0.4 }}
								>
									FullStack Developer
								</motion.p>
								<motion.p
									className="text-neutral-500 hidden sm:block"
									initial={{ x: -100, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: -100, opacity: 0 }}
									transition={{ duration: 0.6, delay: 0.4 }}
								>
									FullStack Developer | Software Engineer
								</motion.p>
							</div>
						</motion.div>

						{/* SEPARATOR HIDDEN ON MOBILE */}
						{!isCompact && (
							<motion.div
								ref={separatorRef}
								initial={{ width: 0, opacity: 0 }}
								animate={{
									width: isCompact ? 0 : "100%",
									opacity: isCompact ? 0 : 1,
									transition: { duration: 0.7, ease: "easeInOut", delay: 0.6 },
								}}
								exit={{ width: 0, opacity: 0 }}
								className="my-2"
							>
								<Separator className="bg-neutral-500 hidden sm:block" />
							</motion.div>
						)}

						{/* SOCIAL LINKS HIDDEN ON MOBILE */}
						<motion.div
							ref={socialLinksRef}
							className={`flex items-center space-x-6  ${
								isCompact ? "flex justify-end" : "hidden sm:flex"
							}`}
							initial={{ opacity: 0, x: isCompact ? 100 : -100 }}
							animate={{
								opacity: 1,
								x: 0,
								alignSelf: isCompact ? "flex-end" : "center",
								transition: {
									duration: 1,
									ease: "easeInOut",
									delay: isCompact ? 0 : 1,
								},
							}}
							layout
						>
							<TooltipProvider delayDuration={0}>
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
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 10,
											}}
										>
											<Github size={isSmallScreen ? 24 : 28} />
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
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 10,
											}}
										>
											<Linkedin size={isSmallScreen ? 24 : 28} />
										</motion.a>
									</TooltipTrigger>
									<PortalTooltipContent side="bottom">
										<span>LinkedIn</span>
									</PortalTooltipContent>
								</Tooltip>

								{/* YOUTUBE */}
								<Tooltip>
									<TooltipTrigger asChild>
										<motion.a
											href="https://www.youtube.com/@MaxRemyDev"
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 10,
											}}
										>
											<Youtube size={isSmallScreen ? 24 : 28} />
										</motion.a>
									</TooltipTrigger>
									<PortalTooltipContent side="bottom">
										<span>YouTube</span>
									</PortalTooltipContent>
								</Tooltip>

								{/* X */}
								<Tooltip>
									<TooltipTrigger asChild>
										<motion.a
											href="https://x.com/babyloopro"
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
											whileHover={{ scale: 1.2, rotate: 10 }}
											whileTap={{ scale: 0.9 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 10,
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width={30}
												height={30}
												className="fill-current"
											>
												<path d="m26.37 26-8.795-12.822.015.012L25.52 4h-2.65l-6.46 7.48L11.28 4H4.33l8.211 11.971-.001-.001L3.88 26h2.65l7.182-8.322L19.42 26h6.95zM10.23 6l12.34 18h-2.1L8.12 6h2.11z" />
											</svg>
										</motion.a>
									</TooltipTrigger>
									<PortalTooltipContent side="bottom">
										<span>X</span>
									</PortalTooltipContent>
								</Tooltip>
							</TooltipProvider>
						</motion.div>
					</motion.div>
				</LayoutGroup>

				{/* CHANGE THEME */}
				{isClient && (
					<div className="absolute right-4 sm:right-5 top-4 sm:top-5">
						<OneClickModeToggle />
					</div>
				)}
			</motion.header>
		</>
	);
}
