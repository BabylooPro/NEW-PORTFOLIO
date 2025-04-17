"use client";

import AppleEmoji from "@/components/decoration/apple-emoji";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { PocketKnife } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ShowInfo } from "@/components/ui/show-info";
import AudioReader from "@/components/ui/AudioReader";
import { useState, useRef } from "react";
import { useHeroSection } from '@/hooks/useHeroSection';
import { Skeleton } from "@/components/ui/skeleton";

const HeroSectionSkeleton: React.FC<{
    status?: 'loading' | 'error' | 'no-data';
}> = ({ status }) => {
    const getStatusContent = () => {
        switch (status) {
            case 'error':
                return (
                    <div className="flex items-center gap-2 text-red-500">
                        <Skeleton className="h-8 w-8 bg-red-200" />
                        <span>Error loading hero section. Please try again later.</span>
                    </div>
                );
            case 'no-data':
                return (
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Skeleton className="h-8 w-8 bg-yellow-200" />
                        <span>No data available.</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Section className="px-4 md:px-8">
            <div className="space-y-8">
                {/* TITLE SKELETON */}
                <div className="flex items-center">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-12 w-12 ml-2" />
                </div>

                {/* DESCRIPTION SKELETON */}
                <Skeleton className="h-6 w-full" />

                {/* SWISS ARMY KNIFE SKELETON */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                </div>

                {/* LEARN MORE SKELETON */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-10 w-10" />
                </div>

                {getStatusContent()}
            </div>
        </Section>
    );
};

export default function HeroSection() {
    const ref = useRef<HTMLSpanElement>(null);
    const mouseX = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
    const [isCardVisible, setIsCardVisible] = useState(false);
    const { heroData, isLoading, error } = useHeroSection();

    const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
        const element = ref.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const centerX = element.offsetWidth / 2;
            mouseX.set(relativeX - centerX);
        }
    };

    const handleClick = () => {
        setIsCardVisible(!isCardVisible);
    };

    if (isLoading) return <HeroSectionSkeleton status="loading" />;
    if (error) return <HeroSectionSkeleton status="error" />;
    if (!heroData) return <HeroSectionSkeleton status="no-data" />;

    return (
        <Section className="px-4 md:px-8">
            {/* TITLE */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 flex items-center">
                {heroData.greeting}
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    style={{ originX: 0.7, originY: 0.7 }}
                >
                    <AppleEmoji emojiShortName="wave" size={60} className="ml-2" />
                </motion.div>
            </h1>

            {/* DESCRIPTION */}
            <p className="md:text-xl">{heroData.description}</p>

            {/* SWISS ARMY KNIFE */}
            <div className="md:text-xl mt-4">
                In short, I&apos;m your{" "}
                <span
                    ref={ref}
                    className="relative inline-block cursor-pointer"
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                >
                    <span>{heroData.swissArmyKnifeText}</span>
                    {isCardVisible && (
                        <motion.div
                            className="absolute top-full left-0 md:-top-12 md:left-1/2 z-10 w-auto"
                            style={{ x: springX }}
                        >
                            <Card className="p-2 whitespace-nowrap">
                                <PocketKnife size={24} className="text-red-400 flex-shrink-0" />
                            </Card>
                        </motion.div>
                    )}
                </span>{" "}
                {heroData.swissArmyKnifeDescription}
            </div>

            {/* LEARN MORE REDIRECT */}
            <div className="text-base md:text-xl mt-4 flex justify-between items-center">
                <div>
                    {heroData.learnMoreText}
                    <Button variant="linkHover1" className="text-base md:text-xl -ml-2">
                        <Link href="/about">{heroData.aboutMeText}</Link>
                    </Button>
                </div>

                <ShowInfo wrapMode>
                    <ShowInfo.Title>{heroData.audioTitle}</ShowInfo.Title>
                    <ShowInfo.Description>{heroData.audioDescription}</ShowInfo.Description>
                    <ShowInfo.Content>
                        <AudioReader
                            src={heroData.audioFile.url.startsWith('http')
                                ? heroData.audioFile.url
                                : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/uploads/${heroData.audioFile.url.split('/uploads/')[1]}`}
                            onError={(error: Error) => console.error('Audio error:', error)}
                        />
                    </ShowInfo.Content>
                </ShowInfo>
            </div>
        </Section>
    );
}
