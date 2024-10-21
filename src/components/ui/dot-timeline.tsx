import React from "react";
import { Badge } from "@/components/ui/badge";

interface DotTimelineProps {
	year?: string;
	children: React.ReactNode;
	showBadge?: boolean;
	dotSize?: string;
	dotColor?: string;
	dotBorderColor?: string;
	badgeClassName?: string;
	badgeTextColor?: string;
	badgeBgColor?: string;
	itemClassName?: string;
	dotClassName?: string;
	badgeComponent?: React.ReactNode;
	dotComponent?: React.ReactNode;
	dotShape?: string;
	badgeSpacing?: string;
	isRight?: boolean;
	isCentered?: boolean;
}

const DotTimeline: React.FC<DotTimelineProps> = ({
	year,
	children,
	showBadge = true,
	dotSize = "w-4 h-4",
	dotColor = "bg-neutral-200 dark:bg-neutral-700",
	dotBorderColor = "border-neutral-100 dark:border-neutral-600",
	badgeClassName = "",
	badgeTextColor = "text-neutral-900 dark:text-neutral-300",
	badgeBgColor = "bg-neutral-200 dark:bg-neutral-700",
	itemClassName = "mb-10",
	dotClassName = "",
	badgeComponent,
	dotComponent,
	dotShape = "rounded-full border",
	badgeSpacing = "mb-1",
	isRight = false,
	isCentered = false,
}) => {
	if (isCentered) {
		return (
			<li className={`relative ${itemClassName}`}>
				{showBadge &&
					(badgeComponent ||
						(year && (
							<Badge
								className={`absolute ${
									isRight ? "left-[calc(50%+1rem)]" : "right-[calc(50%+1rem)]"
								} top-0 ${badgeSpacing} ${badgeBgColor} ${badgeTextColor} ${badgeClassName}`}
							>
								{year}
							</Badge>
						)))}

				{dotComponent || (
					<div
						className={`absolute left-1/2 top-0 -translate-x-1/2 ${dotShape} ${dotSize} ${dotColor} ${dotBorderColor} ${dotClassName}`}
					/>
				)}

				<div className={`pt-8 ${isRight ? "pl-8 text-right" : "pr-8 text-left"}`}>
					{children}
				</div>
			</li>
		);
	}

	return (
		<li className={`mb-10 ml-6 ${itemClassName}`}>
			{dotComponent || (
				<div
					className={`absolute -left-2 ${dotShape} ${dotSize} ${dotColor} ${dotBorderColor} ${dotClassName}`}
				/>
			)}

			{showBadge &&
				(badgeComponent ||
					(year && (
						<Badge
							className={`${badgeSpacing} ${badgeBgColor} ${badgeTextColor} ${badgeClassName}`}
						>
							{year}
						</Badge>
					)))}

			{children}
		</li>
	);
};

export default DotTimeline;
