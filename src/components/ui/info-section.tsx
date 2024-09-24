"use client";

import * as React from "react";
import { Info as InfoIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { useToast } from "@/hooks/use-toast";

interface InfoSectionProps {
	mode: "tooltip" | "toast";
	tooltipText?: string;
	toastTitle?: string;
	toastDescription?: string;
	position?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	iconSize?: number;
	className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({
	mode = "tooltip",
	tooltipText = "Information",
	toastTitle = "Title",
	toastDescription = "Description",
	position = "top",
	sideOffset = 4,
	iconSize = 24,
	className = "",
}) => {
	const { toast } = useToast();

	const handleClick = () => {
		if (mode === "toast") {
			toast({
				title: toastTitle,
				description: toastDescription,
			});
		}
	};

	return (
		<div className={className}>
			{mode === "tooltip" ? (
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<InfoIcon size={iconSize} className="cursor-pointer" />
						</TooltipTrigger>
						<TooltipContent side={position} sideOffset={sideOffset}>
							{tooltipText}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<button onClick={handleClick}>
					<InfoIcon size={iconSize} className="cursor-pointer" />
				</button>
			)}
		</div>
	);
};

export default InfoSection;
