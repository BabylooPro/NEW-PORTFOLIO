"use client";

import * as React from "react";
import { Info as InfoIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { useToast } from "@/hooks/use-toast";

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
				title: toastTitle || title || "Title - Toast",
				description: toastDescription || description || "Description - Toast",
			});
		}
	};

	return (
		<div className={className}>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<button onClick={handleInteraction}>
							<InfoIcon size={iconSize} className="cursor-pointer" />
						</button>
					</TooltipTrigger>
					{!isMobile && (
						<TooltipContent side={position} sideOffset={sideOffset}>
							<div>
								<p>{tooltipText || title || "Text - Tooltip"}</p>
								<p className="text-sm text-neutral-500 dark:text-neutral-400">
									{(tooltipDescription || description) && (
										<p>{tooltipDescription || description}</p>
									)}
								</p>
							</div>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default ShowInfo;
