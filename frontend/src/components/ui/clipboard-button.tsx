"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ClipboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title?: string;
	text: string;
	onCopy?: () => void;
	variant?: string | string[];
	size?: "default" | "sm" | "lg" | "icon";
	CopyIcon?: LucideIcon;
	iconOnly?: boolean;
}

const ClipboardButton: React.FC<ClipboardButtonProps> = ({
	title,
	text,
	onCopy,
	className,
	variant = "default",
	size = "default",
	CopyIcon = Copy,
	iconOnly = false,
	...props
}) => {
	const [isCopied, setIsCopied] = useState(false);
	const { toast } = useToast();

	const handleCopy = async () => {
		if (isCopied) return;

		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				const textArea = document.createElement("textarea");
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
			}
			setIsCopied(true);
			onCopy?.();
			toast({
				title: "Copied to clipboard",
				description: `${
					title ? title.charAt(0).toUpperCase() + title.slice(1) : ""
				} has been copied to your clipboard.`,
			});
			setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("FAILED TO COPY TEXT: ", err);
			toast({
				title: "Copy failed",
				description: `Failed to copy ${title} to your clipboard. Please try again.`,
				variant: "destructive",
			});
		}
	};

	return (
		<Button
			onClick={handleCopy}
			variant={variant}
			size={size}
			className={cn("gap-2", className)}
			disabled={isCopied}
			{...props}
		>
			{isCopied ? (
				<>
					<Check />
					{!iconOnly && `Copied ${title}`}
				</>
			) : (
				<>
					<CopyIcon />
					{!iconOnly && `Copy ${title}`}
				</>
			)}
		</Button>
	);
};

export { ClipboardButton };
