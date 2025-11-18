"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import AppleEmoji from "./apple-emoji";

interface ProcessAnimationProps {
    size?: number;
    color?: string;
}

export function ProcessAnimation({ size = 64, color = "#3b82f6" }: ProcessAnimationProps) {
    // STORE RANDOM DELAYS IN STATE WITH TIMESTAMP TO FORCE UPDATES
    const [delays, setDelays] = useState<{ values: number[]; timestamp: number }>({
        values: [],
        timestamp: Date.now(),
    });

    // GENERATE NEW RANDOM DELAYS WITH TIMESTAMP AND MORE EXAGGERATED VALUES
    const generateNewDelays = useCallback(() => {
        const baseDelays = new Array(4)
            .fill(0)
            .map((_, index) => {
                // GENERATE PROGRESSIVE BASE DELAYS (0.5, 1, 1.5, 2)
                const baseDelay = (index + 1) * 0.5;
                // ADD RANDOM VARIATION BETWEEN 0 AND 1.5 SECONDS
                const randomVariation = Math.random() * 1.5;
                return baseDelay + randomVariation;
            });

        // SHUFFLE DELAYS TO MAKE IT MORE RANDOM
        const shuffledDelays = [...baseDelays].sort(() => Math.random() - 0.5);

        setDelays({
            values: shuffledDelays,
            timestamp: Date.now(),
        });
    }, []);

    // INITIALIZE DELAYS
    useEffect(() => {
        generateNewDelays();
    }, [generateNewDelays]);

    // STATE TO TRACK IF A FILE TOUCHES SERVER
    const [isFileOverlapping, setIsFileOverlapping] = useState(false);

    // STATE TO TRACK NUMBER OF FILES IN ZONE
    const [filesInZone, setFilesInZone] = useState<Set<number>>(new Set());

    // FUNCTION TO UPDATE FOR MULTIPLE FILES
    const checkFileOverlap = useCallback(
        (y: number, fileIndex: number) => {
            const isNearCenter = y > size * 1.5 && y < size * 2.2;

            // UPDATE NUMBER OF FILES IN ZONE
            setFilesInZone((prev) => {
                const newSet = new Set(prev);
                if (isNearCenter) {
                    newSet.add(fileIndex);
                } else {
                    newSet.delete(fileIndex);
                }
                return newSet;
            });

            // UPDATE OVERLAPPING STATE
            setIsFileOverlapping((prev) => isNearCenter || (prev && filesInZone.size > 0));
        },
        [size, filesInZone]
    );

    const filePositions = [
        { startX: "-500%", startY: -100, angle: 75, delay: delays.values[0] || 0 },
        { startX: "-100%", startY: -140, angle: 60, delay: delays.values[1] || 0 },
        { startX: "100%", startY: -160, angle: 30, delay: delays.values[2] || 0 },
        { startX: "500%", startY: -100, angle: -75, delay: delays.values[3] || 0 },
    ];

    // CREATE INDIVIDUAL MOTION VALUES
    const x1 = useMotionValue(0);
    const y1 = useMotionValue(0);
    const x2 = useMotionValue(0);
    const y2 = useMotionValue(0);
    const x3 = useMotionValue(0);
    const y3 = useMotionValue(0);
    const x4 = useMotionValue(0);
    const y4 = useMotionValue(0);

    // COMBINE MOTION VALUES
    const motionValues = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
        { x: x4, y: y4 },
    ];

    const { toast } = useToast();

    // FUNCTION TO DISPLAY TOAST WHEN DROPPING
    const handleDragEnd = (index: number) => {
        setIsDragging(false);

        // CHECK IF FILE IS IN ANIMATION ZONE
        const isInAnimationZone = filesInZone.has(index);

        // MARK AS DROPPED ONLY IF FILE IS OUTSIDE ANIMATION ZONE
        if (!isInAnimationZone) {
            setDroppedFiles((prev) => {
                const newSet = new Set(prev);
                newSet.add(index);
                return newSet;
            });
            toast({
                title: "Oops!",
                description: (
                    <>
                        <span>
                            Oh, so you wanted to retrieve some data you gave me? Shame, because you
                            broke it ! <AppleEmoji emojiShortName={"angry"} />
                        </span>
                        <br />
                        <span>
                            Now it&apos;s stuck forever. That&apos;s what happens when you try to
                            play developer.
                        </span>
                        <br />
                        <span>Classic move! HAHA!</span>
                    </>
                ),
                variant: "destructive",
                showIcon: true,
            });
        }
    };

    // STATE TO TRACK IF THE DRAG IS ACTIVE
    const [isDragging, setIsDragging] = useState(false);

    // STATE TO TRACK DROPPED FILES
    const [droppedFiles, setDroppedFiles] = useState<Set<number>>(new Set());

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    width: size * 4,
                    height: size * 3,
                    margin: `${-size}px 0 0 ${-size * 1.5}px`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* FILES IN ANIMATION ZONE */}
                {filePositions.map((position, index) => (
                    <motion.div
                        key={`${index}-${delays.timestamp}`}
                        className="absolute cursor-grab active:cursor-grabbing"
                        style={{
                            top: position.startY,
                            left: "50%",
                            width: size * 0.3,
                            height: size * 0.3,
                            transformOrigin: "center",
                            opacity: 0,
                            x: motionValues[index].x,
                            y: motionValues[index].y,
                        }}
                        initial={{
                            x: position.startX,
                            y: 0,
                            opacity: 0,
                            rotate: position.angle,
                        }}
                        animate={{
                            y: [0, size * 2.2],
                            x: [position.startX, "0%"],
                            opacity: [0, 1, 1, 1, 0],
                            rotate: [position.angle, position.angle],
                        }}
                        drag
                        dragConstraints={{
                            top: -200,
                            right: 200,
                            bottom: 200,
                            left: -200,
                        }}
                        dragElastic={0.1}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                        whileDrag={{ scale: 1.2, zIndex: 1 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear" as const,
                            delay: position.delay,
                            repeatDelay: 0.5,
                            times: [0, 0.1, 0.9, 0.95, 1],
                            onRepeat: generateNewDelays,
                        }}
                        onUpdate={(latest: { y: number }) => {
                            checkFileOverlap(latest.y, index);
                        }}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => handleDragEnd(index)}
                    >
                        <motion.svg
                            width={size * 0.3}
                            height={size * 0.3}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke={
                                isDragging ? "#ef4444" : droppedFiles.has(index) ? "#ef4444" : color
                            }
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={
                                droppedFiles.has(index)
                                    ? {
                                        x: [0, -4, 4, -4, 4, 0],
                                        rotate: [0, -3, 3, -3, 3, 0],
                                        transition: {
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut" as const,
                                        },
                                    }
                                    : {}
                            }
                        >
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                            <path d="M10 9H8" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                        </motion.svg>
                    </motion.div>
                ))}
            </motion.div>

            {/* SERVER ICON WITH FLAME OVERLAY ICON */}
            <motion.div
                className="relative z-10"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" as const }}
            >
                {/* FLAME OVERLAY */}
                {droppedFiles.size > 0 && (
                    <motion.svg
                        className="absolute left-[60%] top-[30%] -translate-x-[75%] -translate-y-[10%] z-20"
                        width={size * 0.3}
                        height={size * 0.3}
                        viewBox="0 0 24 24"
                        fill="#ef4444"
                        xmlns="http://www.w3.org/2000/svg"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: [0, -2, 2, -2, 0],
                        }}
                        transition={{
                            duration: 0.3,
                            x: {
                                duration: 0.5,
                                repeat: Infinity,
                                ease: "easeInOut" as const,
                            },
                        }}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <motion.path
                            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                            animate={{
                                d: [
                                    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
                                    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-4.5-1.072-2.143-.224-5.054 3-7 .5 2.5 2.5 6.4 5 8 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
                                    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
                                ],
                                transition: {
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: "easeInOut" as const,
                                },
                            }}
                        />
                    </motion.svg>
                )}

                {/* LIGHT MODE ICON SERVER */}
                <motion.svg
                    className="dark:hidden"
                    width={size * 0.8}
                    height={size * 0.8}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                        stroke: isFileOverlapping
                            ? droppedFiles.size > 0
                                ? "#f97316"
                                : "#22c55e"
                            : "#000000",
                        scale: isFileOverlapping ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <rect width="20" height="8" x="2" y="14" rx="2" />
                    <path d="M6 18h.01" />
                    <path d="M10 18h.01" />
                </motion.svg>

                {/* DARK MODE ICON SERVER*/}
                <motion.svg
                    className="hidden dark:block"
                    width={size * 0.8}
                    height={size * 0.8}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{
                        stroke: isFileOverlapping
                            ? droppedFiles.size > 0
                                ? "#f97316"
                                : "#22c55e"
                            : "#ffffff",
                        scale: isFileOverlapping ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <rect width="20" height="8" x="2" y="14" rx="2" />
                    <path d="M6 18h.01" />
                    <path d="M10 18h.01" />
                </motion.svg>
            </motion.div>
        </div>
    );
}
