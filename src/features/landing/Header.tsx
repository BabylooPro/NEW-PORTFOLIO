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
import { ShowInfo } from "@/components/ui/show-info";
import AvatarStatus from "@/components/ui/avatar-status";
import { useWakaTimeData } from "@/utils/WakaTimeProvider";
import { useHeaderPosition } from "@/hooks/use-header-position";
import { useMediaQuery } from "@/hooks/use-media-query";
import { WakaTimeData } from "../../../app/api/wakatime/types";

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
					<ul className="list-disc pl-4">
						<li>
							{wakaTimeData.status === "available" && "Today, i've been "}
							{wakaTimeData.status === "away" && "i've been "}
							{wakaTimeData.status === "busy" && "I've already spent "}
							{wakaTimeData.data.categories.length > 0
								? wakaTimeData.data.categories[0].name.toLowerCase()
								: "inactive"}{" "}
							for{" "}
							{wakaTimeData.data.categories.length > 0
								? wakaTimeData.data.categories[0].digital
								: "00:00"}
							{wakaTimeData.status === "away" && " so far today"}
							{wakaTimeData.status === "busy" && " coding today"}
						</li>
						<li>
							{wakaTimeData.status === "available" && "currently using "}
							{wakaTimeData.status === "away" && "last active on "}
							{wakaTimeData.status === "busy" &&
								"not working at the moment, but earlier i was on "}
							{wakaTimeData.data.operating_systems.length > 0
								? wakaTimeData.data.operating_systems[0].name
								: "an unknown system"}
							, with{" "}
							{wakaTimeData.data.editors.length > 0
								? wakaTimeData.data.editors[0].name
								: "no editor"}
						</li>
					</ul>

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
						<strong>Last update:</strong>{" "}
						{new Date(wakaTimeData.cached_at).toLocaleString()}
					</p>
				</>
			) : (
				<p>Loading Status...</p>
			)}
		</ShowInfo.Description>
	</ShowInfo>
);

const ProfileDescription = ({ isSmallScreen }: { isSmallScreen: boolean }) => (
	<div className="text-left">
		<h1 className="text-lg sm:text-xl font-semibold">Max Remy</h1>
		{isSmallScreen ? (
			<p className="text-neutral-500">FullStack Developer</p>
		) : (
			<p className="text-neutral-500 hidden sm:block">
				FullStack Developer | Software Engineer
			</p>
		)}
	</div>
);

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
			// const isMobile = window.innerWidth < 640;
			setIsCompact(false);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		let scrollTimeout: NodeJS.Timeout;

		const handleScroll = () => {
			const isMobile = window.innerWidth < 640;
			if (window.scrollY > 0) {
				setIsScrolling(true);
				if (!isMobile) {
					setIsCompact(true);
				}

				clearTimeout(scrollTimeout);

				scrollTimeout = setTimeout(() => {
					setIsScrolling(false);
				}, 150);
			} else {
				setIsScrolling(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
			clearTimeout(scrollTimeout);
		};
	}, []);

	const isSmallScreen = useMediaQuery("(max-width: 640px)");

	return (
		<>
			{/* WIP BADGE */}
			{!isLoading && showWIPBadge && (
				<div className="fixed top-2 left-2 flex items-center gap-2 z-[99]">
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
							<Badge className="z-[99] w-full h-7 flex items-center gap-1 cursor-default">
								<AppleEmoji emojiShortName="construction" size={16} />
								<span>WIP</span>
								<AppleEmoji emojiShortName="construction" size={16} />
							</Badge>
						</ShowInfo.Content>
					</ShowInfo>
				</div>
			)}

			{/* HEADER */}
			<motion.header
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: "easeInOut", delay: 0.25 }}
				variants={{
					hidden: { opacity: 0, y: 50, scale: 0.9 },
					visible: { opacity: 1, y: 0, scale: 1 },
				}}
				className={`sticky z-[98] flex items-center justify-center p-4 sm:p-6 max-xl:w-3/4 w-full max-w-5xl mx-auto shadow-2xl rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-md transition-all duration-300 ${
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
						{/* PROFILE & DESCRIPTION - MOBILE & DESKTOP */}
						{isSmallScreen ? (
							<div
								ref={profileRef}
								className={`flex items-center justify-center mt-2 ${
									isCompact ? "space-x-2" : "space-x-2 sm:space-x-4"
								}`}
							>
								<ProfileContent wakaTimeData={wakaTimeData} avatarUrl={avatarUrl} />
								<ProfileDescription isSmallScreen={isSmallScreen} />
							</div>
						) : (
							<motion.div
								ref={profileRef}
								className={`flex items-center justify-center ${
									isCompact ? "space-x-2" : "space-x-2 sm:space-x-4"
								}`}
								initial={{ opacity: 0, x: isCompact ? -100 : 100 }}
								animate={{
									opacity: 1,
									x: 0,
									alignSelf: isCompact ? "flex-start" : "center",
								}}
								transition={{
									duration: 1,
									ease: "easeInOut",
									delay: isCompact ? 0 : 1,
								}}
								layout
							>
								<ProfileContent wakaTimeData={wakaTimeData} avatarUrl={avatarUrl} />
								<ProfileDescription isSmallScreen={isSmallScreen} />
							</motion.div>
						)}

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
