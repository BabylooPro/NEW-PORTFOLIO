"use client";

import * as React from "react";
import { Info as InfoIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShowInfoProps {
	title?: string;
	description?: string;
	tooltipText?: string;
	tooltipDescription?: string;
	toastTitle?: string;
	toastDescription?: string;
	position?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	iconSize?: number;
	className?: string;
	icon?: React.ReactNode;
	iconColor?: string;
	iconFill?: boolean;
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
}) => {
	const { toast } = useToast();
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkDevice = () => {
			setIsMobile(window.innerWidth <= 768 ?? "ontouchstart" in window);
		};

		checkDevice();
		window.addEventListener("resize", checkDevice);
		return () => window.removeEventListener("resize", checkDevice);
	}, []);

	const handleInteraction = () => {
		if (isMobile) {
			toast({
				title: toastTitle ?? title ?? "Title - Toast",
				description: toastDescription ?? description ?? "Description - Toast",
			});
		}
	};

	const iconProps = {
		size: iconSize,
		className: cn(
			"cursor-pointer mt-1",
			iconColor,
			iconFill ? "fill-current" : "stroke-current"
		),
	};

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
							<div>
								<div>{tooltipText ?? title ?? "Text - Tooltip"}</div>
								{(tooltipDescription ?? description) && (
									<div className="text-sm text-neutral-500 dark:text-neutral-400">
										{tooltipDescription ?? description}
									</div>
								)}
							</div>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default ShowInfo;
