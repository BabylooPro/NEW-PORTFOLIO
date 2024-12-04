import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

type ProgressProps = {
	value: number;
	className?: string;
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
	({ className, value, ...props }, ref) => {
		const progressColor =
			value >= 100 ? "bg-green-500 dark:bg-green-500" : "bg-zinc-900 dark:bg-zinc-500";

		return (
			<ProgressPrimitive.Root
				ref={ref}
				className={cn(
					"relative h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800",
					className
				)}
				{...props}
			>
				<ProgressPrimitive.Indicator
					className={`h-full w-full flex-1 transition-all ${progressColor}`}
					style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
				/>
			</ProgressPrimitive.Root>
		);
	}
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
