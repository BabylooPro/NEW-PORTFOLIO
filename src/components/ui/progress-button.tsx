import { useEffect, useCallback, useState } from "react";
import { useMachine } from "@xstate/react";
import { ALargeSmall, Check, Ban, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { progressButtonMachine } from "./machines/button-machine";
import { motion } from "framer-motion";

type ButtonVariants =
	| "link"
	| "default"
	| "destructive"
	| "outline"
	| "secondary"
	| "ghost"
	| "expandIcon"
	| "ringHover"
	| "shine"
	| "gooeyRight"
	| "gooeyLeft"
	| "linkHover1"
	| "linkHover2";

type ProgressButtonBaseProps = {
	successColorClass?: string;
	buttonText?: string;
	icon?: React.ElementType;
	iconSize?: string;
	buttonSize?: string;
	buttonVariant?: ButtonVariants;
	onClick?: () => void;
	onComplete?: () => void;
	onError?: (error: Error) => void;
	disabled?: boolean;
	progress?: number;
	hasError?: boolean;
	hasTemporaryError?: boolean;
};

type ManualProgressButtonProps = ProgressButtonBaseProps & {
	progressType: "manual";
	progress: number;
	duration?: never;
	totalDuration?: never;
	numberOfProgressSteps?: never;
};

type AutomaticProgressButtonProps = ProgressButtonBaseProps & {
	progressType?: "automatic";
	progress?: never;
	totalDuration?: number;
	numberOfProgressSteps?: number;
};

type ProgressButtonProps = ManualProgressButtonProps | AutomaticProgressButtonProps;

const ProgressButton = (props: ProgressButtonProps) => {
	const {
		progressType = "automatic",
		successColorClass = "green-500",
		buttonText = "Default",
		icon: Icon = ALargeSmall,
		iconSize = "h-4 w-4",
		buttonSize = "h-10 w-[150px]",
		buttonVariant = "default",
		onClick,
		onComplete,
		onError,
		disabled = false,
		progress,
		hasError = false,
		hasTemporaryError = false,
	} = props;

	const [state, send] = useMachine(progressButtonMachine);
	const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);

	const handleComplete = useCallback(() => {
		onComplete?.();
	}, [onComplete]);

	const handleError = useCallback(
		(error: Error) => {
			if (onError) {
				onError(error);
				setIsRefreshDisabled(false);
			}
		},
		[onError]
	);

	useEffect(() => {
		if (hasError) {
			send({ type: "reset" });
		}
	}, [hasError, send]);

	useEffect(() => {
		if (state.matches("inProgress") && progressType === "manual") {
			if (progress !== undefined && progress >= 100) {
				setTimeout(() => {
					try {
						send({ type: "complete" });
						handleComplete();
					} catch (e: unknown) {
						handleError(e as Error);
					}
				}, 1000);
			} else if (progress !== undefined && state.context.progress !== progress) {
				send({ type: "setProgress", progress });
			}
		}
	}, [progress, progressType, send, handleComplete, handleError, state]);

	const handleClick = () => {
		if (state.matches("idle") && !disabled) {
			send({ type: "click" });
			onClick?.();
		}
	};

	const handleRefresh = () => {
		if (!isRefreshDisabled) {
			send({ type: "reset" });
			onClick?.();
			setIsRefreshDisabled(true);
			setTimeout(() => {
				setIsRefreshDisabled(false);
			}, 10000); // 5 SECONDS DELAY
		}
	};

	return (
		<div className="flex flex-col justify-center items-center h-full">
			<Button
				size="sm"
				variant={buttonVariant}
				className={`gap-2 ${buttonSize} group ${
					(!state.matches("idle") && !state.matches("error") && !hasTemporaryError) ||
					disabled ||
					isRefreshDisabled
						? "pointer-events-none"
						: ""
				}`}
				onClick={hasTemporaryError ? handleRefresh : handleClick}
				disabled={disabled || (hasError && !hasTemporaryError) || isRefreshDisabled}
			>
				{state.matches("idle") && !hasError && !hasTemporaryError && (
					<span className="flex gap-2 items-center">
						<Icon className={iconSize} />
						{buttonText}
					</span>
				)}
				{state.matches("inProgress") && !hasError && !hasTemporaryError && (
					<Progress value={state.context.progress} />
				)}
				{state.matches("success") && !hasError && !hasTemporaryError && (
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							mass: 1,
							bounce: 0.5,
						}}
					>
						<Check className={`size-8 text-${successColorClass}`} />
					</motion.div>
				)}
				{hasTemporaryError && (
					<motion.div
						className="flex items-center justify-center"
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							mass: 1,
							bounce: 0.5,
						}}
					>
						<RefreshCcw
							className={`w-5 h-5 ${
								isRefreshDisabled ? "text-gray-400" : "text-blue-500"
							}`}
						/>
					</motion.div>
				)}
				{hasError && !hasTemporaryError && (
					<motion.div
						className="flex items-center justify-center"
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							mass: 1,
							bounce: 0.5,
						}}
					>
						<Ban className="w-5 h-5 text-red-500" />
					</motion.div>
				)}
			</Button>
		</div>
	);
};

export default ProgressButton;
