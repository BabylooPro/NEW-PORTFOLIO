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
            ease: "easeOut" as const,
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
            ease: "easeInOut" as const,
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

    // STATE FOR CODE BLOCKS
    const [snippetPatterns, setSnippetPatterns] = useState<
        Array<Array<{ indent: number; width: number; color: string }>>
    >([]);

    // GENERATE CODE BLOCKS
    useEffect(() => {
        const initialBlocks = new Array(24)
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
                    showErrors={true}
                />
            </div>

            {/* ERROR ICON LAYER */}
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
                    <motion.svg
                        width={iconTotalSize}
                        height={iconTotalSize}
                        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                        style={{
                            overflow: "visible",
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
                            style={{ opacity: 0.5 }}
                        />

                        {/* CIRCLE OUTLINE */}
                        <motion.path
                            d={`M ${center - radius},${center} A ${radius},${radius} 0 1,1 ${center - radius},${center + 0.01}`}
                            fill="none"
                            stroke={color}
                            strokeWidth={viewBoxSize * 0.035}
                            variants={circleVariants}
                            strokeLinecap="round"
                        />

                        {/* EXCLAMATION MARK GROUP */}
                        <motion.g variants={exclamationVariants}>
                            {/* EXCLAMATION MARK LINE */}
                            <motion.rect
                                x={center - (viewBoxSize * 0.06) / 2}
                                y={center - (viewBoxSize * 0.3) / 2}
                                width={viewBoxSize * 0.06}
                                height={viewBoxSize * 0.3 - (viewBoxSize * 0.06) / 2 - 8}
                                fill={color}
                                rx={(viewBoxSize * 0.06) / 2}
                                ry={(viewBoxSize * 0.06) / 2}
                            />

                            {/* EXCLAMATION MARK DOT */}
                            <motion.circle
                                cx={center}
                                cy={center + (viewBoxSize * 0.3) / 2 - (viewBoxSize * 0.06) / 2}
                                r={(viewBoxSize * 0.06) / 2}
                                fill={color}
                            />
                        </motion.g>
                    </motion.svg>
                </motion.div>
            </div>
        </div>
    );
};
