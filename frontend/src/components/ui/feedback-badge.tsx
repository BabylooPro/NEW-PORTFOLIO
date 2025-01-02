'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Textarea } from "./textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShowInfo } from "./show-info";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const feedbackSchema = z.object({
    rating: z.number().min(0.5).max(5),
    feedback: z.string().optional(),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

const StarIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
        {...props}
    >
        <path
            d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeMiterlimit="10"
            vectorEffect="non-scaling-stroke"
            style={{
                strokeLinejoin: "round",
                strokeLinecap: "round"
            }}
        />
    </svg>
);

const HalfStarRating = ({
    index,
    currentRating,
    isSelected,
    mouseX,
    containerWidth
}: {
    index: number;
    currentRating: number;
    isSelected: boolean;
    mouseX: number | null;
    containerWidth: number;
}) => {
    const isFullStar = index < Math.floor(currentRating);
    const isHalfStar = Math.ceil(currentRating) === index + 1 && currentRating % 1 !== 0;

    // CALCUL OF SCALE BASED ON MOUSE POSITION
    const getScale = () => {
        if (!mouseX) return 1;

        const starWidth = containerWidth / 5;
        const starCenter = (index * starWidth) + (starWidth / 2);
        const distance = mouseX - starCenter;

        // IF ITS A STAR FOLLOWING CURSOR, NO EFFECT NEXT STARS
        if (distance < 0) return 1;

        const maxDistance = containerWidth / 2;

        // CALCUL ONLY FOR PREIOUS STARS
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const scale = 1 + (0.5 * Math.cos(normalizedDistance * Math.PI));

        // BOOST FOR NEAREST STAR
        const proximity = Math.exp(-distance / (starWidth * 0.7));
        const hoverBoost = 0.3 * proximity;

        return scale + hoverBoost;
    };

    return (
        <motion.div
            className="relative w-5 h-5"
            animate={isSelected ? {
                scale: [1, 1.5, 1],
                transition: {
                    duration: 0.4,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                }
            } : {
                scale: getScale(),
                transition: {
                    duration: 0.15,
                    ease: "easeOut"
                }
            }}
        >
            {/* BASE STAR (BORDER) */}
            <StarIcon
                className="absolute inset-0 transition-all duration-200 opacity-50"
                fill="none"
                stroke="rgb(210, 161, 7)"
                strokeWidth={1.5}
            />

            {/* FULL OR HALF STAR */}
            <div
                className={cn(
                    "absolute inset-0 overflow-hidden",
                    isHalfStar && "w-[50%]"
                )}
                style={{
                    width: isHalfStar ? "60%" : isFullStar ? "100%" : "0%"
                }}
            >
                <StarIcon
                    className="transition-all duration-200"
                    fill="rgb(234 179 8)"
                    stroke="none"
                />
            </div>
        </motion.div>
    );
};

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

const StarParticles = ({ x, y, count }: { x: number; y: number; count: number }) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        // CREATE PARTICLES FOR EACH SELECTED STAR
        const particlesPerStar = 8;
        const starWidth = 28; // LARGEUR OF A STAR (w-7 = 1.75rem = 28px)
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
            const starCenterX = x - (starWidth * (count - 1 - i));

            for (let j = 0; j < particlesPerStar; j++) {
                newParticles.push({
                    x: starCenterX,
                    y: y,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.5) * 12 - 3,
                    life: 1
                });
            }
        }

        setParticles(newParticles);

        const animate = () => {
            setParticles(prevParticles =>
                prevParticles
                    .map(particle => ({
                        ...particle,
                        x: particle.x + particle.vx,
                        y: particle.y + particle.vy,
                        vy: particle.vy + 0.2,
                        life: particle.life - 0.02
                    }))
                    .filter(particle => particle.life > 0)
            );

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [x, y, count]);

    return (
        <div
            className="fixed pointer-events-none"
            style={{
                zIndex: 9999,
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh'
            }}
        >
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-yellow-400"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.life,
                        scale: particle.life,
                        transform: `translate(-50%, -50%)`,
                    }}
                />
            ))}
        </div>
    );
};

export const FeedbackRating = () => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [feedbackActive, setFeedbackActive] = useState(false);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [userFeedback, setUserFeedback] = useState<string>("");
    const ratingContainerRef = useRef<HTMLDivElement>(null);
    const node = useRef<HTMLDivElement>(null);
    const totalStars = 5;
    const [particleProps, setParticleProps] = useState<{ x: number; y: number; show: boolean; count: number }>({ x: 0, y: 0, show: false, count: 0 });
    const [selectedRating, setSelectedRating] = useState<number | null>(() => null);
    const [mouseX, setMouseX] = useState<number | null>(null);

    const defaultValues = {
        rating: 0,
        feedback: "",
    };

    const form = useForm<FeedbackForm>({
        resolver: zodResolver(feedbackSchema),
        defaultValues,
    });

    useEffect(() => {
        if (feedbackActive === true) {
            const handleClickOutside = (e: MouseEvent) => {
                if (node.current && !node.current.contains(e.target as Node)) {
                    setFeedbackActive(false);
                    form.reset(defaultValues);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [feedbackActive, form, defaultValues]);

    // CHECK LOCAL STORAGE ON MOUNT
    useEffect(() => {
        const savedState = localStorage.getItem('feedbackSubmitted');
        const savedRating = localStorage.getItem('userRating');
        const savedFeedback = localStorage.getItem('userFeedback');
        if (savedState === 'true' && savedRating) {
            setHasSubmitted(true);
            setUserRating(parseFloat(savedRating));
            if (savedFeedback) setUserFeedback(savedFeedback);
        }
    }, []);

    // FETCH AVERAGE RATING WHEN NEEDED
    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const statsResponse = await fetch('/api/strapi?path=feedbacks/stats');
                const stats = await statsResponse.json();
                setAverageRating(stats.data.averageRating);
            } catch (error) {
                console.error('Error fetching average rating:', error);
            }
        };

        if (hasSubmitted) {
            fetchAverageRating();
        }
    }, [hasSubmitted]);

    const onSubmit = async (data: FeedbackForm) => {
        try {
            const response = await fetch('/api/strapi?path=feedbacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            // GET STATS AFTER SUBMISSION
            const statsResponse = await fetch('/api/strapi?path=feedbacks/stats');
            const stats = await statsResponse.json();

            setAverageRating(stats.data.averageRating);
            setUserRating(data.rating);
            setUserFeedback(data.feedback || "");
            setHasSubmitted(true);
            // SAVE TO LOCAL STORAGE
            localStorage.setItem('feedbackSubmitted', 'true');
            localStorage.setItem('userRating', data.rating.toString());
            if (data.feedback) localStorage.setItem('userFeedback', data.feedback);
            setFeedbackActive(false);
            form.reset();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const calculateRating = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ratingContainerRef.current) return 0;

        const { width, left } = ratingContainerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const starWidth = width / totalStars;
        const starIndex = Math.floor(x / starWidth);
        const relativeX = x - (starIndex * starWidth); // RELATIVE POSITION IN THE CURRENT STAR

        // ADJUSTMENT OF DETECTION ZONES
        if (relativeX < starWidth * 0.4) { // FIRST 40% OF THE STAR
            return starIndex;
        } else if (relativeX < starWidth * 0.8) { // 40-80% OF THE STAR
            return starIndex + 0.5;
        } else { // LAST 20% OF THE STAR
            return starIndex + 1;
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const newRating = calculateRating(e);
        if (newRating !== hoverRating) {
            setHoverRating(newRating);
        }

        if (ratingContainerRef.current) {
            const rect = ratingContainerRef.current.getBoundingClientRect();
            setMouseX(e.clientX - rect.left);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(null);
        setMouseX(null);
    };

    const resetSelectedRating = useCallback(() => {
        setSelectedRating(() => null);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const newRating = calculateRating(e);
        form.setValue("rating", newRating);
        setSelectedRating(() => newRating);
        setFeedbackActive(true);

        const selectedStarsCount = Math.ceil(newRating);
        setParticleProps({
            x: e.clientX,
            y: e.clientY,
            show: true,
            count: selectedStarsCount
        });

        // RESET SELECTED RATING AFTER ANIMATION
        setTimeout(resetSelectedRating, 400);

        // HIDE PARTICLES AFTER ANIMATION
        setTimeout(() => {
            setParticleProps(prev => ({ ...prev, show: false }));
        }, 1000);
    };

    if (hasSubmitted && averageRating !== null && userRating !== null) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                <Card className="relative overflow-hidden transition-all duration-300 bg-transparent border-none shadow-none w-[20rem] h-[5.5rem] mb-8">
                    <CardHeader className="px-4 pt-2 pb-0 flex items-center justify-center">
                        <CardTitle className="text-sm">Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 flex flex-row items-center justify-between">
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-medium opacity-70 mb-2">
                                Average Rating
                            </span>
                            <div className="flex items-center justify-center gap-3">
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                    <StarIcon
                                        className="absolute inset-0 transition-all duration-200 opacity-50"
                                        fill="none"
                                        stroke="rgb(234 179 8)"
                                        strokeWidth={1.5}
                                        width="100%"
                                        height="100%"
                                    />
                                    <div
                                        className="absolute inset-0 overflow-hidden flex items-center justify-center"
                                        style={{
                                            width: "100%"
                                        }}
                                    >
                                        <StarIcon
                                            className="transition-all duration-200"
                                            fill="rgb(234 179 8)"
                                            stroke="none"
                                            width="100%"
                                            height="100%"
                                        />
                                    </div>
                                </div>
                                <span className="text-2xl">
                                    {averageRating.toFixed(1)}
                                </span>
                            </div>
                        </div>

                        <div className="w-[1px] h-16 bg-border/50" />

                        <div className="flex flex-col items-center">
                            <span className="text-sm font-medium opacity-70 mb-2">
                                Your Rating
                            </span>
                            <div className="flex items-center justify-center gap-3">
                                <ShowInfo wrapMode>
                                    <ShowInfo.Title>
                                        Your Feedback
                                    </ShowInfo.Title>
                                    <ShowInfo.Description className="w-full">
                                        <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground m-0">
                                            {userFeedback || "No feedback provided"}
                                        </pre>
                                    </ShowInfo.Description>
                                    <ShowInfo.Content>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="relative w-6 h-6 flex items-center justify-center">
                                                <StarIcon
                                                    className="absolute inset-0 transition-all duration-200 opacity-50"
                                                    fill="none"
                                                    stroke="rgb(234 179 8)"
                                                    strokeWidth={1.5}
                                                    width="100%"
                                                    height="100%"
                                                />
                                                <div
                                                    className="absolute inset-0 overflow-hidden flex items-center justify-center"
                                                    style={{
                                                        width: "100%"
                                                    }}
                                                >
                                                    <StarIcon
                                                        className="transition-all duration-200"
                                                        fill="rgb(234 179 8)"
                                                        stroke="none"
                                                        width="100%"
                                                        height="100%"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-2xl">
                                                {userRating.toFixed(1)}
                                            </span>
                                        </div>
                                    </ShowInfo.Content>
                                </ShowInfo>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={node}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
            suppressHydrationWarning
        >
            {particleProps.show && (
                <StarParticles
                    x={particleProps.x}
                    y={particleProps.y}
                    count={particleProps.count || 0}
                />
            )}
            <Card className={cn(
                "relative overflow-hidden transition-all duration-300 bg-transparent border-none shadow-none",
                feedbackActive ? "w-[20rem] max-[374px]:w-[15rem]" : "w-[12.3rem]",
                feedbackActive ? "h-[15rem] max-[374px]:h-[16rem]" : "h-[5rem]"
            )}>
                <CardHeader className="px-4 pt-2 pb-0 flex items-center justify-center">
                    <CardTitle className="text-sm">Feedback</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="p-4 pt-1">
                            {feedbackActive && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="feedback"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Your feedback about my portfolio..."
                                                        className="resize-none h-[8rem] bg-card"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}

                            <div className={cn(
                                "flex items-center",
                                form.watch("rating") ? "justify-between" : "justify-center",
                                feedbackActive && "max-[374px]:flex-col gap-4"
                            )}>
                                <div className="flex items-center">
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div
                                                        ref={ratingContainerRef}
                                                        className="flex items-center gap-2"
                                                        onMouseMove={handleMouseMove}
                                                        onMouseLeave={handleMouseLeave}
                                                        onClick={handleClick}
                                                    >
                                                        {[...Array(totalStars)].map((_, index) => (
                                                            <motion.div
                                                                key={index}
                                                                className="relative cursor-pointer p-1 w-7"
                                                            >
                                                                <HalfStarRating
                                                                    index={index}
                                                                    currentRating={hoverRating ?? field.value ?? 0}
                                                                    isSelected={selectedRating !== null && index < selectedRating}
                                                                    mouseX={mouseX}
                                                                    containerWidth={ratingContainerRef.current?.offsetWidth || 0}
                                                                />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch("rating") > 0 && (
                                        <span className="ml-4 text-sm opacity-50">
                                            {form.watch("rating").toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {form.watch("rating") > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                "transition-all duration-200",
                                                "max-[374px]:w-full"
                                            )}
                                        >
                                            Send
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </form>
                </Form>
            </Card>
        </motion.div>
    );
};
