"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { generateStructuredSnippetPatterns, SnippetPatternBackground } from "./snippet-pattern";

// ANIMATION VARIANTS FOR BACKGROUND CIRCLE
const backgroundVariants = {
	hidden: {
		scale: 0,
		opacity: 0,
	},
	visible: {
		scale: 1,
		opacity: [0, 1, 1, 0],
		transition: {
			duration: 1.6,
			opacity: {
				times: [0, 0.2, 0.5, 1],
			},
			scale: {
				type: "spring",
				stiffness: 200,
			},
		},
	},
};

// ANIMATION VARIANTS FOR CIRCLE
const circleVariants = {
	hidden: {
		pathLength: 0,
		opacity: 0,
		scale: 0,
	},
	visible: {
		pathLength: 1,
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.8,
			ease: "easeInOut" as const,
			scale: {
				type: "spring",
				stiffness: 200,
			},
		},
	},
};

// ANIMATION VARIANTS FOR CHECKMARK
const checkVariants = {
	hidden: {
		pathLength: 0,
		opacity: 0,
		scale: 0,
	},
	visible: {
		pathLength: 1,
		opacity: 1,
		scale: 1,
		transition: {
			delay: 0.8,
			duration: 0.4,
			ease: "easeInOut" as const,
			scale: {
				type: "spring",
				stiffness: 200,
				delay: 0.8,
			},
		},
	},
};

interface SuccessAnimationProps {
	size?: number;
	color?: string;
}

export const SuccessAnimation = ({ size = 100, color = "#22c55e" }: SuccessAnimationProps) => {
	// CALCULATE DIMENSIONS FOR ICON
	const padding = size * 0.5;
	const iconTotalSize = size + padding * 2;

	// CALCULATE BACKGROUND DIMENSIONS
	const backgroundPadding = size * 0.2;
	const backgroundTotalSize = size + backgroundPadding * 2;
	const backgroundWidth = backgroundTotalSize * 1.5;
	const backgroundHeight = backgroundTotalSize * 1;

	const viewBoxSize = 100;
	const center = viewBoxSize / 2;
	const radius = viewBoxSize * 0.23;

	// CALCULATE CHECKMARK DIMENSIONS
	const checkWidth = viewBoxSize * 0.12;
	const checkHeight = viewBoxSize * 0.08;
	const checkStrokeWidth = viewBoxSize * 0.035;

	// STATE FOR CODE BLOCKS
	const [snippetPatterns, setSnippetPatterns] = useState<
		Array<Array<{ indent: number; width: number; color: string }>>
	>([]);

	useEffect(() => {
		const initialBlocks = Array(24)
			.fill(null)
			.flatMap(() => generateStructuredSnippetPatterns());
		setSnippetPatterns(initialBlocks);

		const interval = setInterval(() => {
			setSnippetPatterns((prevBlocks) => {
				const additionalBlocks = generateStructuredSnippetPatterns();
				const newBlocks = [...prevBlocks];
				newBlocks.push(...additionalBlocks);
				return newBlocks.slice(-1000);
			});
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			style={{
				position: "relative",
				width: backgroundWidth,
				height: backgroundHeight,
			}}
		>
			{/* BACKGROUND LAYER */}
			<div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
				<SnippetPatternBackground
					snippetPatterns={snippetPatterns}
					width={backgroundWidth}
					height={backgroundHeight}
				/>
			</div>

			{/* SUCCESS ICON LAYER */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					pointerEvents: "none",
					zIndex: 2,
				}}
			>
				<motion.div
					initial="hidden"
					animate="visible"
					style={{
						width: size,
						height: size,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						overflow: "visible",
					}}
				>
					<svg
						width={iconTotalSize}
						height={iconTotalSize}
						viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
						style={{
							overflow: "visible",
						}}
					>
						{/* BACKGROUND FILL CIRCLE */}
						<motion.circle
							cx={center}
							cy={center}
							r={radius}
							fill={color}
							variants={backgroundVariants}
							style={{ opacity: 0.2 }}
						/>

						{/* CIRCLE OUTLINE */}
						<motion.path
							d={`M ${center - radius},${center} A ${radius},${radius} 0 1,1 ${
								center - radius
							},${center + 0.01}`}
							fill="none"
							stroke={color}
							strokeWidth={checkStrokeWidth}
							variants={circleVariants}
							strokeLinecap="round"
						/>

						{/* CHECKMARK */}
						<motion.path
							d={`M ${center - checkWidth} ${center} L ${center - checkWidth * 0.3} ${
								center + checkHeight
							} L ${center + checkWidth} ${center - checkHeight}`}
							fill="none"
							stroke={color}
							strokeWidth={checkStrokeWidth}
							variants={checkVariants}
							style={{ transformOrigin: "center" }}
						/>
					</svg>
				</motion.div>
			</div>
		</div>
	);
};
