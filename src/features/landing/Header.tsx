"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Github, Linkedin, ArrowLeft, Youtube, Bug } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { OneClickModeToggle } from "../themes/OneClickModeToggle";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import AppleEmoji from "@/components/decoration/apple-emoji";
import { ShowInfo } from "@/components/ui/show-info";
import AvatarStatus from "@/components/ui/avatar-status";
import { useWakaTimeData } from "@/utils/WakaTimeProvider";
import { useHeaderPosition } from "@/hooks/use-header-position";
import { useMediaQuery } from "@/hooks/use-media-query";
import { WakaTimeData } from "../../../app/api/wakatime/types";
import { Dock } from "@/components/decoration/dock";
import { cn } from "@/lib/utils";

// FUNCTION TO RENDER TOOLTIP CONTENT IN A PORTAL
const PortalTooltipContent = ({
	children,
	...props
}: React.PropsWithChildren<React.ComponentProps<typeof TooltipContent>>) => {
	if (typeof window === "undefined") return null;
	return createPortal(<TooltipContent {...props}>{children}</TooltipContent>, document.body);
};

const ProfileContent = ({
	wakaTimeData,
	avatarUrl,
}: {
	wakaTimeData: WakaTimeData | null;
	avatarUrl: string | null;
}) => (
	<ShowInfo wrapMode>
		<ShowInfo.Title>Activity Status</ShowInfo.Title>
		<ShowInfo.Content>
			<motion.div
				whileHover={{ scale: 1.1 }}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 10,
				}}
				className="relative"
			>
				<div className="relative">
					<Avatar className="w-10 h-10 sm:w-14 sm:h-14">
						<AvatarImage src={avatarUrl ?? ""} alt="Profile Image" />
						<AvatarFallback>MR</AvatarFallback>
					</Avatar>
					<AvatarStatus size={14} />
				</div>
			</motion.div>
		</ShowInfo.Content>
		<ShowInfo.Description>
			{wakaTimeData ? (
				<>
					<strong>
						{wakaTimeData.status === "available" && "I'm currently available:"}
						{wakaTimeData.status === "away" && "I'm currently away:"}
						{wakaTimeData.status === "busy" && "I'm currently busy:"}
					</strong>
					{wakaTimeData.data.categories.length > 0 &&
					wakaTimeData.data.categories[0].digital !== "0:00" ? (
						<ul className="list-disc pl-4">
							<li>
								{wakaTimeData.status === "available" && "Today, I've been "}
								{wakaTimeData.status === "away" && "I've been "}
								{wakaTimeData.status === "busy" && "I've already spent "}
								{wakaTimeData.data.categories[0].name.toLowerCase()} for{" "}
								{wakaTimeData.data.categories[0].digital}
								{wakaTimeData.status === "away" && " so far today"}
								{wakaTimeData.status === "busy" && " coding today"}
							</li>
							<li>
								{wakaTimeData.status === "available" && "Currently using "}
								{wakaTimeData.status === "away" && "Last active on "}
								{wakaTimeData.status === "busy" &&
									"Not working at the moment, but earlier I was on "}
								{wakaTimeData.data.operating_systems.length > 0
									? wakaTimeData.data.operating_systems[0].name
									: "an unknown system"}
								, with{" "}
								{wakaTimeData.data.editors.length > 0
									? wakaTimeData.data.editors[0].name
									: "no editor"}
							</li>
						</ul>
					) : (
						<p>No activity has been logged since the start of the day.</p>
					)}

					<Separator className="my-4" />

					<ul className="mt-2">
						<li>
							<span className="text-green-500">●</span> <strong>Available: </strong>
							Active in the last 15 minutes
						</li>
						<li>
							<span className="text-orange-500">●</span> <strong>Away: </strong>
							Inactive for 15 to 60 minutes
						</li>
						<li>
							<span className="text-red-500">●</span> <strong>Busy: </strong>
							Inactive for more than an hour
						</li>
					</ul>

					<Separator className="my-4" />

					<p className="text-neutral-500 text-sm font-extralight">
						<strong>Time Zone:</strong> {wakaTimeData.data.range.timezone}
					</p>

					<p className="text-neutral-500 text-sm font-extralight">
						<strong>Last Update:</strong>{" "}
						{new Date(wakaTimeData.cached_at).toLocaleString()}
					</p>
				</>
			) : (
				<p>Loading Status...</p>
			)}
		</ShowInfo.Description>
	</ShowInfo>
);

const ProfileDescription = ({
	isSmallScreen,
	isCompact,
}: {
	isSmallScreen: boolean;
	isCompact: boolean;
}) => (
	<div className="text-left">
		<h1 className="text-lg sm:text-xl font-semibold">Max Remy</h1>
		{isSmallScreen ? (
			<div className="text-neutral-500 relative">
				<div className="h-4 overflow-hidden">
					<div className="flex flex-col">
						<span className="h-4 flex items-center animate-show-hide-first">
							FullStack Developer
						</span>
						<span className="h-4 flex items-center absolute top-0 left-0 animate-show-hide-second">
							Software Engineer
						</span>
					</div>
				</div>
			</div>
		) : (
			<div className="text-neutral-500 hidden sm:block relative">
				<div
					className={cn(
						"absolute inset-0 overflow-hidden h-8",
						!isCompact ? "hidden" : "block"
					)}
				>
					<span className="absolute inset-0 flex items-start justify-start animate-show-hide-first">
						FullStack Developer
					</span>
					<span className="absolute inset-0 flex items-start justify-start animate-show-hide-second">
						Software Engineer
					</span>
				</div>

				<span
					className={cn(
						"transition-opacity duration-200 ease-in-out",
						isCompact ? "opacity-0 invisible" : "opacity-100"
					)}
				>
					FullStack Developer | Software Engineer
				</span>
			</div>
		)}
	</div>
);

// SOCIAL ITEMS FOR DOCK
const socialItems = [
	{
		title: "Github",
		icon: <Github className="h-full w-full hover:-rotate-12 transition-all duration-300" />,
		href: "https://github.com/babyloopro",
		target: "_blank",
	},
	{
		title: "LinkedIn",
		icon: <Linkedin className="h-full w-full" />,
		href: "https://www.linkedin.com/in/maxremydev/",
		target: "_blank",
	},
	{
		title: "YouTube",
		icon: <Youtube className="h-full w-full" />,
		href: "https://www.youtube.com/@MaxRemyDev",
		target: "_blank",
	},
	{
		title: "X | Twitter",
		icon: (
			<div className="h-full w-full hover:rotate-12 transition-all duration-300">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="fill-current h-full w-full"
				>
					<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
				</svg>
			</div>
		),
		href: "https://x.com/babyloopro",
		target: "_blank",
	},
];

// UPDATED ANIMATION VARIANTS WITHOUT SPRING
const MULTIDIRECTION_SLIDE_VARIANTS = {
	initial: (direction: number) => ({
		x: direction * 200,
		opacity: 0,
		scale: 0.5,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	}),
	animate: {
		x: 0,
		opacity: 1,
		scale: 1,
		transition: {
			duration: 1,
			ease: "easeInOut",
		},
	},
	exit: (direction: number) => ({
		x: direction * -200,
		opacity: 0,
		scale: 0.5,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	}),
};

// ADD THIS CONSTANT AT THE TOP OF THE FILE
const DEBUG_STORAGE_KEY = "debug_borders_enabled";

// HEADER COMPONENT
export default function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const [isScrolling, setIsScrolling] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [isCompact, setIsCompact] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showWIPBadge, setShowWIPBadge] = useState(true);
	const [lastCommitInfo, setLastCommitInfo] = useState<{
		date: string;
		message: string;
		hiddenDate: string;
	} | null>(null);
	const wakaTimeData = useWakaTimeData();
	const { isHeaderMoved } = useHeaderPosition();
	const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
	const [showDebugButton, setShowDebugButton] = useState(() => {
		if (typeof window !== "undefined") {
			return (
				localStorage.getItem(DEBUG_STORAGE_KEY) === "true" ||
				process.env.NODE_ENV === "development"
			);
		}
		return false;
	});

	const profileRef = useRef<HTMLDivElement>(null);
	const separatorRef = useRef(null);
	const socialLinksRef = useRef<HTMLDivElement>(null);

	// FETCH LAST COMMIT INFO FROM GITHUB
	const fetchLastCommitInfo = async () => {
		try {
			const response = await fetch(
				"https://api.github.com/repos/BabylooPro/NEW-PORTFOLIO/commits?per_page=1"
			);
			const [latestCommit] = await response.json();
			const commitDate = new Date(latestCommit.commit.author.date);
			const currentDate = new Date();
			const daysSinceLastCommit = Math.floor(
				(currentDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24)
			);

			// CHECK IF LAST COMMIT IS RECENT
			const isRecent = daysSinceLastCommit <= 60;
			const daysUntilHidden = Math.max(60 - daysSinceLastCommit, 0);

			const hiddenDate = new Date(commitDate.getTime() + 60 * 24 * 60 * 60 * 1000); // CALCULATE HIDDEN DATE

			// FORMAT DATE WITH TIMEZONE FOR DISPLAY
			const dateTimeFormat = {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Europe/Zurich",
			} as const;
			const formattedCommitDate = commitDate.toLocaleString("fr-CH", dateTimeFormat);
			const formattedHiddenDate = hiddenDate.toLocaleString("fr-CH", dateTimeFormat);

			// RETURN LAST COMMIT INFO
			return {
				date: formattedCommitDate,
				message: latestCommit.commit.message.split("\n")[0],
				isRecent,
				daysUntilHidden,
				hiddenDate: formattedHiddenDate,
			};
		} catch (error) {
			console.error("Failed to fetch last commit info", error);
			return null;
		}
	};

	useEffect(() => {
		setIsLoading(true);
		fetchLastCommitInfo().then((info) => {
			if (info) {
				setLastCommitInfo(info);
				setShowWIPBadge(info.isRecent);
			}
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		// Vérifier uniquement si on est en développement
		setShowDebugButton(process.env.NODE_ENV === "development");
	}, []);

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
			// ONLY RESET ISCOMPACT IF USER HASN'T SCROLLED YET
			if (!hasScrolledOnce) {
				setIsCompact(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		let scrollTimeout: NodeJS.Timeout;
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const isMobile = window.innerWidth < 640;
			const currentScrollY = window.scrollY;

			// SET HASSCROLLEDONCE TO TRUE ON FIRST SCROLL
			if (!hasScrolledOnce && currentScrollY > 0) {
				setHasScrolledOnce(true);
			}

			// DETECT SCROLL DIRECTION AND MOVEMENT
			if (currentScrollY > lastScrollY) {
				// SCROLLING DOWN
				setIsScrolling(true);
				if (!isMobile) {
					setIsCompact(true);
				}
			} else if (currentScrollY < lastScrollY) {
				// SCROLLING UP
				setIsScrolling(true);
				if (!isMobile) {
					setIsCompact(true);
				}
			}

			lastScrollY = currentScrollY;

			// CLEAR PREVIOUS TIMEOUT
			clearTimeout(scrollTimeout);

			// SET NEW TIMEOUT TO DETECT WHEN SCROLLING STOPS
			scrollTimeout = setTimeout(() => {
				setIsScrolling(false);
				// ONLY RESET ISCOMPACT IF AT TOP AND HASN'T SCROLLED BEFORE
				if (currentScrollY === 0 && !hasScrolledOnce) {
					setIsCompact(false);
				}
			}, 150);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
			clearTimeout(scrollTimeout);
		};
	}, [hasScrolledOnce]); // ADD HASSCROLLEDONCE TO DEPENDENCIES

	const isSmallScreen = useMediaQuery("(max-width: 640px)");
	const isLaptop = useMediaQuery("(max-width: 1440px)");

	const toggleDebugBorders = useCallback(() => {
		document.documentElement.classList.toggle("debug-borders");
		// STORE THE NEW STATE IN LOCALSTORAGE
		const isDebugEnabled = document.documentElement.classList.contains("debug-borders");
		localStorage.setItem(DEBUG_STORAGE_KEY, isDebugEnabled.toString());
	}, []);

	// ADD THIS EFFECT TO INITIALIZE DEBUG BORDERS ON MOUNT
	useEffect(() => {
		if (typeof window !== "undefined") {
			const isDebugEnabled = localStorage.getItem(DEBUG_STORAGE_KEY) === "true";
			if (isDebugEnabled) {
				document.documentElement.classList.add("debug-borders");
			}
		}
	}, []);

	return (
		<>
			{/* MODIFY THE WIP BADGE SECTION TO ALWAYS SHOW THE BADGE BUT CONDITIONALLY SHOW DEBUG BUTTON */}
			{!isLoading && showWIPBadge && (
				<div className="fixed top-2 left-2 flex items-center gap-2 z-[9999]">
					<ShowInfo wrapMode>
						<ShowInfo.Title>Work In Progress</ShowInfo.Title>
						<ShowInfo.Description>
							This project is currently under active development. <br />
							Features and content may change frequently.
							{lastCommitInfo && (
								<>
									<br />
									<br />
									<strong>Last Update :</strong> {lastCommitInfo.date}
									<br />
									<strong>Latest Change :</strong> {lastCommitInfo.message}
								</>
							)}
						</ShowInfo.Description>
						<ShowInfo.Content>
							{showDebugButton ? (
								<Badge
									className="z-[9999] w-full h-7 flex items-center gap-1 cursor-pointer"
									onClick={toggleDebugBorders}
								>
									<Bug size={16} />
								</Badge>
							) : (
								<Badge className="z-[9999] w-full h-7 flex items-center gap-1">
									<AppleEmoji emojiShortName="construction" size={16} />
									<span>WIP</span>
									<AppleEmoji emojiShortName="construction" size={16} />
								</Badge>
							)}
						</ShowInfo.Content>
					</ShowInfo>
				</div>
			)}

			<LayoutGroup>
				{/* HEADER */}
				<motion.header
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{
						opacity: 1,
						scale: 1,
						top: isScrolling ? 0 : isHeaderMoved ? "2.5rem" : "5rem",
						padding: isCompact ? "1rem" : "1.5rem",
						height: isCompact ? "6.5rem" : "auto",
						width:
							isCompact && isLaptop
								? "100%"
								: isSmallScreen
								? "90%"
								: isCompact
								? "35%"
								: "100%",
					}}
					transition={{
						duration: 2.5,
						ease: [0.34, 1.56, 0.64, 1],
						opacity: { duration: 0.5 },
						scale: {
							type: "spring",
							damping: 25,
							stiffness: 150,
							duration: 0.5,
						},
						top: {
							type: "spring",
							damping: 15,
							stiffness: 80,
							duration: 0.5,
						},
						padding: { duration: 0.5 },
						height: {
							type: "spring",
							damping: 20,
							stiffness: 90,
							duration: 0.5,
						},
						width: {
							type: "spring",
							damping: 20,
							stiffness: 90,
							duration: 0.5,
						},
					}}
					variants={{
						hidden: { opacity: 0, y: 50, scale: 0.9 },
						visible: { opacity: 1, y: 0, scale: 1 },
					}}
					className={`sticky z-[98] flex items-center justify-center max-xl:w-3/4 w-full max-w-5xl mx-auto shadow-2xl rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-md mt-0`}
					style={{
						willChange: "transform, opacity, padding, height",
						minHeight: isCompact ? "5.5rem" : "auto",
					}}
					layout
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
							className={`flex relative ${
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
							}}
							transition={{
								duration: 0.5,
								ease: "easeOut",
								layout: {
									duration: 0.5,
									ease: "easeOut",
								},
							}}
							layout="position"
						>
							<motion.div
								variants={MULTIDIRECTION_SLIDE_VARIANTS}
								initial="initial"
								animate="animate"
								exit="exit"
								custom={isCompact ? -1 : 1}
								style={{
									willChange: "transform",
									backfaceVisibility: "hidden",
								}}
							>
								{/* Profile Section */}
								<motion.div
									ref={profileRef}
									className={`flex items-center justify-center z-10 ${
										isCompact ? "space-x-2" : "space-x-2 sm:space-x-4"
									}`}
									initial={false}
									animate={{
										opacity: 1,
										x: 0,
										scale: 1,
									}}
									transition={{
										duration: 2.5,
										ease: [0.34, 1.56, 0.64, 1],
										scale: {
											type: "spring",
											damping: 15,
											stiffness: 90,
											duration: 3,
										},
									}}
									layout
								>
									<motion.div
										className="flex items-center justify-center space-x-2"
										animate={{
											opacity: 1,
											x: isCompact ? 0 : 0,
										}}
										transition={{
											duration: 2.5,
											ease: [0.34, 1.56, 0.64, 1],
											delay: 0.6,
										}}
									>
										<ProfileContent
											wakaTimeData={wakaTimeData}
											avatarUrl={avatarUrl}
										/>
										<ProfileDescription
											isSmallScreen={isSmallScreen}
											isCompact={isCompact}
										/>
									</motion.div>
								</motion.div>
							</motion.div>

							{/* Separator */}
							{!isCompact && (
								<motion.div
									ref={separatorRef}
									initial={{ width: 0, opacity: 0 }}
									animate={{
										width: "100%",
										opacity: 1,
									}}
									exit={{ width: 0, opacity: 0 }}
									transition={{
										duration: 1,
										ease: "easeInOut",
									}}
									className="mt-2"
								>
									<Separator className="bg-neutral-500 hidden sm:block" />
								</motion.div>
							)}

							<motion.div
								variants={MULTIDIRECTION_SLIDE_VARIANTS}
								initial="initial"
								animate="animate"
								exit="exit"
								custom={isCompact ? 1 : -1}
								style={{
									willChange: "transform",
									backfaceVisibility: "hidden",
								}}
							>
								{/* Social Links */}
								<motion.div
									ref={socialLinksRef}
									className={`${
										isCompact
											? "flex justify-end absolute right-0 top-1/2 -translate-y-1/2"
											: "relative hidden sm:flex"
									}`}
									initial={false}
									animate={{
										opacity: 1,
										x: isCompact ? 0 : 0,
										y: isCompact ? "-50%" : 10,
										scale: 1,
									}}
									transition={{
										duration: 0.5,
										ease: "easeOut",
										opacity: { duration: 0.5 },
										y: {
											duration: 0.5,
											ease: "easeOut",
										},
									}}
									layout
								>
									<motion.div
										animate={{
											y: isCompact ? 0 : 0,
										}}
										transition={{
											duration: 0.5,
											ease: "easeOut",
										}}
									>
										<Dock
											items={socialItems}
											className="bg-transparent dark:bg-transparent"
											styles={{
												hoverPosition: isCompact
													? "expand-center"
													: "expand-down",
												containerSize: {
													height: "4vh",
												},
											}}
										/>
									</motion.div>
								</motion.div>
							</motion.div>
						</motion.div>
					</LayoutGroup>

					{/* Change Theme */}
					{isClient && (
						<div className="absolute right-4 sm:right-5 top-4 sm:top-5">
							<OneClickModeToggle />
						</div>
					)}
				</motion.header>
			</LayoutGroup>
		</>
	);
}
