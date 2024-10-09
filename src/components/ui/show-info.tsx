"use client";

import * as React from "react";
import { Info as InfoIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShowInfoProps {
	title?: string;
	description?: string | React.ReactNode;
	tooltipText?: string;
	tooltipDescription?: string | React.ReactNode;
	toastTitle?: string;
	toastDescription?: string | React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	iconSize?: number;
	className?: string;
	icon?: React.ReactNode;
	iconColor?: string;
	iconFill?: boolean;
	children?: React.ReactNode;
	wrapMode?: boolean;
}

const ShowInfo: React.FC<ShowInfoProps> = ({
	title,
	description,
	tooltipText,
	tooltipDescription,
	toastTitle,
	toastDescription,
	position = "top",
	sideOffset = 4,
	iconSize = 24,
	className = "",
	icon,
	iconColor = "text-current",
	iconFill = false,
	children,
	wrapMode = false,
}) => {
	const { toast } = useToast();
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkDevice = () => {
			setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
		};

		checkDevice();
		window.addEventListener("resize", checkDevice);
		return () => window.removeEventListener("resize", checkDevice);
	}, []);

	const handleInteraction = () => {
		if (isMobile) {
			toast({
				title: toastTitle ?? title ?? "Title - Toast",
				description:
					typeof toastDescription === "string" ? (
						<div dangerouslySetInnerHTML={{ __html: toastDescription }} />
					) : (
						toastDescription ?? description ?? "Description - Toast"
					),
			});
		}
	};

	const renderDescription = (content: string | React.ReactNode) => {
		if (typeof content === "string") {
			return <div dangerouslySetInnerHTML={{ __html: content }} />;
		}
		return content;
	};

	const iconProps = {
		size: iconSize,
		className: cn(
			"cursor-pointer mt-1",
			iconColor,
			iconFill ? "fill-current" : "stroke-current"
		),
	};

	const content = (
		<div>
			<div>{tooltipText ?? title ?? "Text - Tooltip"}</div>
			{(tooltipDescription ?? description) && (
				<div className="text-sm text-neutral-500 dark:text-neutral-400">
					{renderDescription(tooltipDescription ?? description)}
				</div>
			)}
		</div>
	);

	if (wrapMode) {
		return (
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<div onClick={handleInteraction} className={className}>
							{children}
						</div>
					</TooltipTrigger>
					{!isMobile && (
						<TooltipContent side={position} sideOffset={sideOffset}>
							{content}
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<div className={className}>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<button onClick={handleInteraction}>
							{icon ? (
								React.cloneElement(icon as React.ReactElement, iconProps)
							) : (
								<InfoIcon {...iconProps} />
							)}
						</button>
					</TooltipTrigger>
					{!isMobile && (
						<TooltipContent side={position} sideOffset={sideOffset}>
							{content}
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default ShowInfo;
