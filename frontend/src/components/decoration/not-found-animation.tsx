"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { generateStructuredSnippetPatterns, SnippetPatternBackground } from "./snippet-pattern";

// ANIMATION VARIANTS FOR THE CONTAINER
const containerVariants = {
	initial: {
		width: "auto",
	},
	animate: {
		width: "auto",
		transition: {
			duration: 0.8,
			ease: "easeInOut",
		},
	},
};

// ANIMATION VARIANTS FOR THE BRACKETS
const bracketVariants = {
	initial: {
		opacity: 0,
		scale: 0,
	},
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
};

// ANIMATION VARIANTS FOR THE CONTENT
const contentVariants = {
	initial: {
		width: 0,
		opacity: 0,
	},
	animate: {
		width: "auto",
		opacity: 1,
		transition: {
			width: {
				duration: 0.4,
				delay: 0.4,
				ease: "easeInOut",
			},
			opacity: {
				duration: 0.3,
				delay: 0.5,
			},
		},
	},
};

interface NotFoundAnimationProps {
	size?: number;
	color?: string;
}

export const NotFoundAnimation = ({ size = 100, color = "#ef4444" }: NotFoundAnimationProps) => {
	// CALCULATE DIMENSIONS
	const padding = size * 0.2;
	const totalSize = size + padding * 2;
	const fontSize = size * 0.4;
	const backgroundWidth = totalSize * 1.5;
	const backgroundHeight = totalSize * 1;

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
					showWarnings={true}
				/>
			</div>

			{/* 404 LAYER */}
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
					style={{
						position: "relative",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontFamily: "monospace",
						fontSize: fontSize,
						fontWeight: "bold",
						color: color,
						overflow: "hidden",
					}}
					variants={containerVariants}
					initial="initial"
					animate="animate"
				>
					<motion.span
						variants={bracketVariants}
						initial="initial"
						animate="animate"
						className="pointer-events-none"
					>
						&lt;
					</motion.span>

					<motion.div
						style={{
							display: "flex",
							overflow: "hidden",
							whiteSpace: "nowrap",
							pointerEvents: "none",
						}}
						variants={contentVariants}
						initial="initial"
						animate="animate"
					>
						<span>/</span>
						<span className="font-press-start">404</span>
					</motion.div>

					<motion.span
						variants={bracketVariants}
						initial="initial"
						animate="animate"
						className="pointer-events-none"
					>
						&gt;
					</motion.span>
				</motion.div>
			</div>
		</div>
	);
};
