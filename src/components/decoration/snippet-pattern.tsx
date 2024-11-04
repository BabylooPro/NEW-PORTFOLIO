"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

interface SnippetPatternBackgroundProps {
	snippetPatterns: Array<Array<{ indent: number; width: number; color: string }>>;
	className?: string;
	width?: number;
	height?: number;
	showErrors?: boolean;
	showWarnings?: boolean;
}

interface IssueLens {
	lineIndex: number;
	type: "error" | "warning";
}

// GENERATES A SINGLE LINE OF CODE PATTERN WITH RANDOM WIDTHS AND COLORS
const generateSnippetPatterns = (numBlocks: number, indentLevel: number = 0) => {
	const minWidth = 10;
	const maxWidth = 100;

	// CREATES AN ARRAY OF BLOCKS WITH RANDOM PROPERTIES
	return Array.from({ length: numBlocks }, () => ({
		indent: indentLevel,
		width: minWidth + Math.floor(Math.random() * (maxWidth - minWidth)),
		color: [
			"#6e768166", // GRAY
			"#6095c966", // BLUE
			"#9a6ee766", // PURPLE
			"#e5646566", // RED
			"#d9b15066", // YELLOW
			"#4ec27066", // GREEN
		][Math.floor(Math.random() * 6)],
	}));
};

// GENERATES A COMPLETE CODE STRUCTURE WITH MULTIPLE SECTIONS
export const generateStructuredSnippetPatterns = () => {
	const blocks: Array<Array<{ indent: number; width: number; color: string }>> = [];

	// SIMULATE REALISTIC CODE STRUCTURE
	const patterns = [
		() => {
			blocks.push(generateSnippetPatterns(1, 0));
			blocks.push(generateSnippetPatterns(1, 1));
			blocks.push(generateSnippetPatterns(2, 2));
			blocks.push(generateSnippetPatterns(3, 3));
			blocks.push(generateSnippetPatterns(3, 3));
			blocks.push(generateSnippetPatterns(2, 2));
			blocks.push(generateSnippetPatterns(1, 1));
			blocks.push(generateSnippetPatterns(1, 0));
		},
	];

	// FOR EACH PATTERN, DETERMINES NUMBER OF REPETITIONS AND GENERATES BLOCKS
	patterns.forEach((pattern) => {
		const repetitions = Math.floor(Math.random() * 2) + 1;
		for (let i = 0; i < repetitions; i++) {
			pattern();
		}
	});

	// COMBINES ALL BLOCKS INTO A FINAL ARRAY
	const finalBlocks: Array<Array<{ indent: number; width: number; color: string }>> = [];
	blocks.forEach((block) => {
		finalBlocks.push(block);
		if (Math.random() > 0.7) {
			finalBlocks.push(
				generateSnippetPatterns(
					Math.floor(Math.random() * 2) + 1,
					Math.floor(Math.random() * 2)
				)
			);
		}
	});

	return finalBlocks;
};

// GENERATES RANDOM ERROR AND WARNING INDICATORS FOR CODE LINES
const generateRandomIssuesLens = (
	totalLines: number,
	showErrors: boolean,
	showWarnings: boolean
): IssueLens[] => {
	const issues: IssueLens[] = [];
	const numberOfIssues = Math.floor(Math.random() * 24) + 60;
	const availableLines = Array.from({ length: totalLines }, (_, i) => i);
	const errorProbability = Math.floor(Math.random() * 24) + 60;

	// ITERATES THROUGH AVAILABLE LINES TO GENERATE ERRORS AND WARNINGS
	for (let i = 0; i < numberOfIssues && availableLines.length > 0; i++) {
		const randomIndex = Math.floor(Math.random() * availableLines.length);
		const lineIndex = availableLines[randomIndex];
		availableLines.splice(randomIndex, 1);

		const isError = showErrors && (!showWarnings || Math.random() < errorProbability);

		if (isError && showErrors) {
			issues.push({
				lineIndex,
				type: "error",
			});
		} else if (showWarnings) {
			issues.push({
				lineIndex,
				type: "warning",
			});
		}
	}

	return issues;
};

// RENDERS A SINGLE LINE OF CODE PATTERN WITH OPTIONAL ERROR/WARNING INDICATOR
export const SnippetPatternLine = React.memo(
	({
		line,
		style,
		error,
	}: {
		line: Array<{ indent: number; width: number; color: string }>;
		style?: React.CSSProperties;
		error?: IssueLens;
	}) => (
		<div style={{ position: "relative" }}>
			<div
				style={{
					display: "flex",
					gap: "4px",
					opacity: 1,
					justifyContent: "flex-start",
					height: "4px",
					marginBottom: "0px",
					willChange: "transform",
					backfaceVisibility: "hidden",
					transform: "translateZ(0)",
					...style,
				}}
			>
				{/* INDENTATION SPACE */}
				{line[0]?.indent > 0 && (
					<div
						style={{
							width: `${line[0].indent * 8}px`,
							flexShrink: 0,
						}}
					/>
				)}

				{/* BLOCKS REPRESENTING CODE CONTENT */}
				{line.map((block, blockIndex) => (
					<div
						key={blockIndex}
						style={{
							height: "100%",
							width: `${block.width * 0.7}px`,
							backgroundColor: block.color,
							borderRadius: "1px",
							flexShrink: 0,
							marginRight: "0px",
						}}
					/>
				))}
			</div>

			{/* ERROR/WARNING INDICATOR */}
			{error && (
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: -2,
						bottom: -2,
						backgroundColor:
							error.type === "error"
								? "rgba(255, 0, 0, 0.15)"
								: "rgba(255, 200, 0, 0.15)",
						border: `2px solid ${
							error.type === "error"
								? "rgba(255, 0, 0, 0.4)"
								: "rgba(255, 200, 0, 0.4)"
						}`,
						borderRadius: "3px",
						pointerEvents: "none",
						zIndex: 10,
					}}
				/>
			)}
		</div>
	),
	(prevProps, nextProps) => {
		return (
			prevProps.error?.lineIndex === nextProps.error?.lineIndex &&
			prevProps.error?.type === nextProps.error?.type
		);
	}
);

SnippetPatternLine.displayName = "SnippetPatternLine";

// MAIN COMPONENT THAT RENDERS ANIMATED CODE PATTERN BACKGROUND
export const SnippetPatternBackground = ({
	snippetPatterns,
	className = "",
	width,
	height,
	showErrors = false,
	showWarnings = false,
}: SnippetPatternBackgroundProps) => {
	const constraintsRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [issues, setIssues] = useState<IssueLens[]>([]);
	const isFirstRender = useRef(true);

	// GENERATE ISSUES ONCE ON MOUNT
	useEffect(() => {
		if (isFirstRender.current && snippetPatterns.length > 0) {
			const newIssues = generateRandomIssuesLens(
				snippetPatterns.length,
				showErrors,
				showWarnings
			);
			setIssues(newIssues);
			isFirstRender.current = false;
		}
	}, [snippetPatterns.length, showErrors, showWarnings]);

	// TRIPLE PATTERN TO CREATE SEAMLESS LOOP
	const repeatedBlocks = useMemo(() => {
		return [...snippetPatterns, ...snippetPatterns, ...snippetPatterns];
	}, [snippetPatterns]);

	// CALCULATE TOTAL HEIGHT OF ONE SET OF PATTERNS
	const contentHeight = snippetPatterns.length * 5;

	return (
		<motion.div
			ref={constraintsRef}
			style={{
				position: "relative",
				width: width || "100%",
				height: height || "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				overflow: "hidden",
				cursor: isDragging ? "grabbing" : "grab",
				touchAction: "none",
			}}
		>
			{/* CONTAINER FOR ANIMATED CODE PATTERNS */}
			<div
				className={className}
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.75,
					display: "flex",
					flexDirection: "column",
					gap: "1px",
					padding: "10px",
					overflow: "hidden",
				}}
			>
				{/* ANIMATED CONTAINER WITH INFINITE SCROLL EFFECT */}
				<motion.div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "1px",
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						willChange: "transform",
						backfaceVisibility: "hidden",
						transform: "translateZ(0)",
					}}
					initial={{ y: 0 }}
					animate={{ y: -contentHeight }}
					transition={{
						y: {
							duration: 60,
							repeat: Infinity,
							repeatType: "loop",
							ease: "linear",
						},
					}}
					drag="y"
					dragConstraints={constraintsRef}
					dragElastic={0}
					onDragStart={() => setIsDragging(true)}
					onDragEnd={() => setIsDragging(false)}
				>
					{/* RENDER EACH LINE OF CODE PATTERN */}
					{repeatedBlocks.map((line, lineIndex) => {
						const error = issues.find(
							(issue) => issue.lineIndex === lineIndex % snippetPatterns.length
						);
						return <SnippetPatternLine key={lineIndex} line={line} error={error} />;
					})}
				</motion.div>
			</div>
		</motion.div>
	);
};
