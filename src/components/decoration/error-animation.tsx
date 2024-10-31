import { motion } from "framer-motion";

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
			ease: "easeInOut",
			scale: {
				type: "spring",
				stiffness: 200,
			},
		},
	},
};

// ANIMATION VARIANTS FOR EXCLAMATION MARK
const exclamationVariants = {
	hidden: {
		scaleY: 0,
		opacity: 0,
	},
	visible: {
		scaleY: 1,
		opacity: 1,
		transition: {
			delay: 0.8,
			duration: 0.4,
			ease: "easeOut",
		},
	},
};

// SHARED PULSE ANIMATION
const pulseVariants = {
	hidden: {
		scale: 0,
	},
	visible: {
		scale: 1,
		transition: {
			duration: 0.8,
		},
	},
	pulse: {
		scale: [1, 1.05, 1],
		opacity: [1, 0.8, 1],
		transition: {
			duration: 2,
			ease: "easeInOut",
			repeat: Infinity,
			repeatType: "mirror" as const,
			delay: 1.2,
		},
	},
};

interface ErrorAnimationProps {
	size?: number;
	color?: string;
}

export const ErrorAnimation = ({ size = 100, color = "#ef4444" }: ErrorAnimationProps) => {
	// CALCULATE PADDING FOR SCALE ANIMATION
	const padding = size * 0.5;
	const totalSize = size + padding * 2;
	const viewBoxSize = 100;
	const center = viewBoxSize / 2;
	const radius = viewBoxSize * 0.23;

	// CALCULATE EXCLAMATION MARK DIMENSIONS
	const exclamationHeight = viewBoxSize * 0.3;
	const exclamationWidth = viewBoxSize * 0.06;
	const dotSize = viewBoxSize * 0.06;
	const strokeWidth = viewBoxSize * 0.035;

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			style={{
				width: totalSize,
				height: totalSize,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				margin: -padding,
				overflow: "visible",
				filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.2))",
			}}
		>
			<motion.svg
				width={totalSize}
				height={totalSize}
				viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
				style={{
					overflow: "visible",
					filter: "drop-shadow(0 0 5px rgba(239, 68, 68, 0.15))",
				}}
				initial="hidden"
				animate={["visible", "pulse"]}
				variants={pulseVariants}
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
					strokeWidth={strokeWidth}
					variants={circleVariants}
					strokeLinecap="round"
				/>

				{/* EXCLAMATION MARK GROUP */}
				<motion.g variants={exclamationVariants}>
					{/* EXCLAMATION MARK LINE */}
					<motion.rect
						x={center - exclamationWidth / 2}
						y={center - exclamationHeight / 2}
						width={exclamationWidth}
						height={exclamationHeight - dotSize - 4}
						fill={color}
						rx={exclamationWidth / 2}
						ry={exclamationWidth / 2}
					/>

					{/* EXCLAMATION MARK DOT */}
					<motion.circle
						cx={center}
						cy={center + exclamationHeight / 2 - dotSize / 2}
						r={dotSize / 2}
						fill={color}
					/>
				</motion.g>
			</motion.svg>
		</motion.div>
	);
};
