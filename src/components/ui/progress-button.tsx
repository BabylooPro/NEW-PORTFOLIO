import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { ALargeSmall, Check } from "lucide-react";
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
		totalDuration = 5000,
		numberOfProgressSteps = 50,
		successColorClass = "green-500",
		buttonText = "Default",
		icon: Icon = ALargeSmall,
		iconSize = "h-4 w-4",
		buttonSize = "h-10 w-[150px]",
		buttonVariant = "default",
		onClick,
		onComplete,
		onError,
		progress,
	} = props;

	const [state, send] = useMachine(progressButtonMachine);

	useEffect(() => {
		if (progress && progressType === "manual") {
			send({ type: "setProgress", progress });
			if (progress >= 100) {
				setTimeout(() => {
					try {
						send({ type: "complete" });
						handleComplete();
					} catch (e: unknown) {
						handleError(e as Error);
					}
				}, 1000);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress, send, progressType]);

	// Fonction pour planifier la progression automatique
	const scheduleProgressUpdates = (totalDuration: number, steps: number) => {
		const stepDuration = totalDuration / steps;
		const stepIncrement = 100 / steps;

		let accumulatedProgress = 0;

		for (let i = 0; i < steps; i++) {
			setTimeout(() => {
				accumulatedProgress += stepIncrement;
				send({ type: "setProgress", progress: Math.min(accumulatedProgress, 100) });

				if (accumulatedProgress >= 100) {
					setTimeout(() => {
						try {
							send({ type: "complete" });
							handleComplete();
						} catch (e: unknown) {
							handleError(e as Error);
						}
					}, 1000);
				}
			}, stepDuration * i);
		}
	};

	const isManualComplete = () => progressType === "manual" && state.context.progress >= 100;
	const shouldStartAutomaticProgress = () =>
		progressType === "automatic" && state.matches("inProgress");

	// Effet pour la progression automatique
	useEffect(() => {
		if (isManualComplete()) {
			handleComplete();
		} else if (shouldStartAutomaticProgress()) {
			scheduleProgressUpdates(totalDuration, numberOfProgressSteps);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progressType, state.value, totalDuration, numberOfProgressSteps]);

	const handleClick = () => {
		if (state.matches("idle")) {
			send({ type: "click" });
			onClick?.();
		}
	};

	const handleComplete = () => {
		onComplete?.();
	};

	const handleError = (error: Error) => {
		onError?.(error);
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center h-full">
				<Button
					size="sm"
					variant={buttonVariant}
					className={`gap-1 ${buttonSize} group ${
						!state.matches("idle") ? "pointer-events-none" : ""
					}`}
					onClick={handleClick}
				>
					{state.matches("idle") && (
						<span className="flex gap-2 items-center">
							<Icon className={iconSize} />
							{buttonText}
						</span>
					)}
					{state.matches("inProgress") && <Progress value={state.context.progress} />}
					{state.matches("success") && (
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
				</Button>
			</div>
		</>
	);
};

export default ProgressButton;
