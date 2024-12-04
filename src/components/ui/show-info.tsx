"use client";

import * as React from "react";
import { Info as InfoIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ShowInfoChildProps = {
	children: React.ReactNode;
	className?: string;
};

interface ShowInfoProps {
	title?: string | React.ReactNode;
	description?: React.ReactNode;
	className?: string;
	position?: "top" | "bottom" | "left" | "right";
	icon?: React.ReactNode;
	children?: React.ReactNode;
	wrapMode?: boolean;
	sideOffset?: number;
	iconSize?: number;
	iconColor?: string;
	iconFill?: boolean;
	disableTooltip?: boolean;
	disableToast?: boolean;
}

const ShowInfoTitle: React.FC<ShowInfoChildProps> = ({
	children,
	className,
}) => <div className={className}>{children}</div>;

const ShowInfoDescription: React.FC<ShowInfoChildProps> = ({
	children,
	className,
}) => <div className={className}>{children}</div>;

const ShowInfoContent: React.FC<ShowInfoChildProps> = ({
	children,
	className,
}) => <div className={className}>{children}</div>;

const ShowInfo = React.forwardRef<HTMLSpanElement, ShowInfoProps>(
	(
		{
			title,
			description,
			className,
			position = "top",
			icon,
			children,
				wrapMode,
				sideOffset = 4,
				iconSize = 24,
				iconColor = "text-current",
				iconFill = false,
				disableTooltip = false,
				disableToast = false,
		},
		ref
	) => {
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

		const handleClick = () => {
			if (isMobile && !disableToast) {
				const titleContent = wrapMode
					? (
							React.Children.toArray(children).find(
								(child): child is React.ReactElement<ShowInfoChildProps> =>
									React.isValidElement(child) && child.type === ShowInfoTitle
							) as React.ReactElement<ShowInfoChildProps>
					  )?.props?.children || title
					: title;

				toast({
					title: titleContent?.toString() ?? "",
					description: wrapMode
						? (
								React.Children.toArray(children).find(
									(child): child is React.ReactElement<ShowInfoChildProps> =>
										React.isValidElement(child) && child.type === ShowInfoDescription
								) as React.ReactElement<ShowInfoChildProps>
						  )?.props?.children || description
						: description,
				});
			}
		};

		const renderContent = (content: string | React.ReactNode, className?: string) => {
			if (typeof content === "string") {
				return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
			}
			return <div className={className}>{content}</div>;
		};

		const iconProps = {
			size: iconSize,
			className: cn(
				"cursor-pointer",
				iconColor,
				iconFill ? "fill-current" : "stroke-current"
			),
		};

		const content = (
			<span
				ref={ref}
				onClick={handleClick}
				className={cn("inline-flex items-center cursor-pointer", className)}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						handleClick();
					}
				}}
				aria-label={typeof title === 'string' ? title : 'Info'}
			>
				{wrapMode
					? React.Children.toArray(children).find(
							(child): child is React.ReactElement<ShowInfoChildProps> =>
								React.isValidElement(child) && child.type === ShowInfoContent
					  )
					: icon || <InfoIcon {...iconProps} />}
			</span>
		);

		const tooltipContent = (
			<>
				{renderContent(
					wrapMode
						? (
								React.Children.toArray(children).find(
									(child): child is React.ReactElement<ShowInfoChildProps> =>
										React.isValidElement(child) && child.type === ShowInfoTitle
								) as React.ReactElement<ShowInfoChildProps>
						  )?.props?.children || title
						: title,
					wrapMode
						? (
								React.Children.toArray(children).find(
									(child): child is React.ReactElement<ShowInfoChildProps> =>
										React.isValidElement(child) && child.type === ShowInfoTitle
								) as React.ReactElement<ShowInfoChildProps>
						  )?.props?.className
						: undefined
				)}
				{renderContent(
					wrapMode
						? (
								React.Children.toArray(children).find(
									(child): child is React.ReactElement<ShowInfoChildProps> =>
										React.isValidElement(child) &&
										child.type === ShowInfoDescription
								) as React.ReactElement<ShowInfoChildProps>
						  )?.props?.children || description
						: description,
					cn(
						"text-sm text-neutral-500 dark:text-neutral-400",
						wrapMode
							? (
									React.Children.toArray(children).find(
										(child): child is React.ReactElement<ShowInfoChildProps> =>
											React.isValidElement(child) &&
											child.type === ShowInfoDescription
									) as React.ReactElement<ShowInfoChildProps>
							  )?.props?.className
							: undefined
					)
				)}
			</>
		);

		return disableTooltip ? (
			content
		) : (
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>{content}</TooltipTrigger>
					<TooltipContent side={position} sideOffset={sideOffset}>
						{tooltipContent}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}
);

ShowInfo.displayName = "ShowInfo";

const ShowInfoWithSubcomponents = ShowInfo as typeof ShowInfo & {
	Title: typeof ShowInfoTitle;
	Description: typeof ShowInfoDescription;
	Content: typeof ShowInfoContent;
};

ShowInfoWithSubcomponents.Title = ShowInfoTitle;
ShowInfoWithSubcomponents.Description = ShowInfoDescription;
ShowInfoWithSubcomponents.Content = ShowInfoContent;

export { ShowInfoWithSubcomponents as ShowInfo };
