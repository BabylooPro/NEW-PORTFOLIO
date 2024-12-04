"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			"fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-0 top-0 left-0 right-0",
			className
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-6 pr-8 shadow-lg sm:max-w-[420px]",
	{
		variants: {
			variant: {
				default:
					"bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-md text-foreground duration-300 hover:ring-1 hover:ring-ring dark:hover:ring-ring ",
				destructive:
					"destructive group bg-[#d33030]/70 backdrop-blur-md text-destructive-foreground",
				warning:
					"bg-yellow-500/30 dark:bg-yellow-900/70 backdrop-blur-md text-foreground duration-300 hover:ring-1 hover:ring-ring dark:hover:ring-ring ",
				success:
					"bg-green-500/30 dark:bg-green-900/70 backdrop-blur-md text-foreground duration-300 hover:ring-1 hover:ring-ring dark:hover:ring-ring ",
				info: "bg-blue-500/30 dark:bg-blue-900/70 backdrop-blur-md text-foreground duration-300 hover:ring-1 hover:ring-ring dark:hover:ring-ring ",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

type CustomToastProps = {
	headerBottom?: number;
	headerHeight?: number;
	isHeaderMoved?: boolean;
	isCompact?: boolean;
	showIcon?: boolean;
};

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
		VariantProps<typeof toastVariants> &
		CustomToastProps
>(
	(
		{
			className,
			variant,
			headerBottom = 0,
			headerHeight,
			isHeaderMoved,
			isCompact = false,
			showIcon = false,
			children,
			...props
		},
		ref
	) => {
		const isMobile = useMediaQuery("(max-width: 640px)");

		const icons = {
			default: null,
			info: <Info className="w-8 h-8 text-blue-500" />,
			success: <CheckCircle2 className="w-8 h-8 text-green-500" />,
			warning: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
			destructive: <AlertCircle className="w-8 h-8 text-red-500" />,
		};

		const icon = showIcon && variant ? icons[variant] : null;

		const content = (
			<div className="flex items-center gap-4 w-full">
				{icon && <div className="flex-shrink-0">{icon}</div>}
				<div className="flex-grow">{children}</div>
			</div>
		);

		const getToastPosition = () => {
			if (isMobile) return 0;

			if (isCompact) {
				return headerBottom + 24;
			} else {
				return headerBottom + 48;
			}
		};

		const { open, ...restProps } = props;

		console.log("DEBUG_TOAST:", { headerHeight, isHeaderMoved });

		return (
			<AnimatePresence>
				{open && (
					<ToastPrimitives.Root
						ref={ref}
						{...restProps}
					>
						{isMobile ? (
							<div className={cn(toastVariants({ variant }), className)}>
								{content}
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0, y: 0, scale: 0.1 }}
								animate={{
									opacity: 1,
									y: getToastPosition(),
									scale: 1,
								}}
								exit={{ opacity: 0, y: -200, scale: 0.1 }}
								transition={{ type: "spring", stiffness: 300, damping: 30 }}
								className={cn(toastVariants({ variant }), className)}
							>
								{content}
							</motion.div>
						)}
					</ToastPrimitives.Root>
				)}
			</AnimatePresence>
		);
	}
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			"inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
			className
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			"absolute right-2 top-2 rounded-md p-1 text-foreground/50 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
			className
		)}
		toast-close=""
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn("text-sm font-semibold", className)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn("text-sm opacity-90", className)}
		{...props}
	/>
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	type ToastProps,
	type ToastActionElement,
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastAction,
};
