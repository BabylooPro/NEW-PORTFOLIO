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
			ease: "easeInOut",
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
	// CALCULATE PADDING FOR SCALE ANIMATION
	const padding = size * 0.5;
	const totalSize = size + padding * 2;
	const viewBoxSize = 100;
	const center = viewBoxSize / 2;
	const radius = viewBoxSize * 0.23;

	// CALCULATE CHECKMARK DIMENSIONS (REDUCED SIZES)
	const checkWidth = viewBoxSize * 0.12;
	const checkHeight = viewBoxSize * 0.08;
	const checkStrokeWidth = viewBoxSize * 0.035;

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
				filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.2))",
			}}
		>
			<svg
				width={totalSize}
				height={totalSize}
				viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
				style={{
					overflow: "visible",
					filter: "drop-shadow(0 0 5px rgba(34, 197, 94, 0.15))",
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
	);
};
