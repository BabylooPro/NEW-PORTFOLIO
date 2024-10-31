"use client";

import { useToast } from "@/hooks/use-toast";
import {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { useHeaderPosition } from "@/hooks/use-header-position";
import { useEffect, useCallback } from "react";

interface ToasterProps {
	readonly showTestToast?: boolean;
}

export function Toaster({ showTestToast = false }: ToasterProps) {
	const { toasts, toast } = useToast();
	const { headerBottom, isHeaderMoved } = useHeaderPosition();

	const showTestToastMessage = useCallback(() => {
		toast({
			title: "Test Toast",
			description: "This is a test toast description",
			action: (
				<ToastAction altText="Try again" onClick={showTestToastMessage}>
					Try again
				</ToastAction>
			),
		});
	}, [toast]);

	useEffect(() => {
		if (showTestToast) {
			showTestToastMessage();
		}
	}, [showTestToast, showTestToastMessage]);

	return (
		<ToastProvider swipeDirection="up">
			{toasts.map(function ({ id, title, description, action, showIcon, ...props }) {
				return (
					<Toast
						key={id}
						{...props}
						headerBottom={headerBottom}
						isHeaderMoved={isHeaderMoved}
						showIcon={showIcon}
					>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && <ToastDescription>{description}</ToastDescription>}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport className="sm:max-w-[420px] sm:left-1/2 sm:-translate-x-1/2 z-[100] md:z-[97] " />
		</ToastProvider>
	);
}
