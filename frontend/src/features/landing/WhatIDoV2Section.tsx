"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useWhatIDoSection } from "./utils/useWhatIDoSection";
import { useShowcaseVideos } from "./utils/useShowcaseVideos";
import ClientOnly from "./components/what-i-do-v2/components/ClientOnly";
import VideoPlayer from "./components/what-i-do-v2/components/VideoPlayer";
import VideoCard from "./components/what-i-do-v2/components/VideoCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/Carousel";

// CSS FOR HIDING DISABLED BUTTONS
const carouselStyles = `
  .carousel-buttons button[disabled] {
    display: none;
  }
`;

const WhatIDoV2Section: React.FC = () => {
    const { resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);
    const { data: sectionData, isLoading: isSectionLoading } = useWhatIDoSection();
    const { data: videosData, isLoading: isVideosLoading } = useShowcaseVideos();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [_forceShow, setForceShow] = useState(false);
    const [activeVideo, setActiveVideo] = useState("");
    const [videoPositions, setVideoPositions] = useState<Record<string, number>>({});
    const prevActiveVideoRef = useRef<string | null>(null);
    const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
    const autoSwitchedRef = useRef(false);
    const finishedVideosRef = useRef<Set<string>>(new Set());
    const [resetTrigger, setResetTrigger] = useState(0);

    // FILTER VIDEOS WITH VALID SRC
    const validVideos = useMemo(() =>
        videosData?.filter(video => video.src)
            .sort((a, b) => {
                // SORT BY DATE IN DESCENDING ORDER (NEWEST FIRST)
                if (!a.date) return 1; // ITEMS WITHOUT DATE GO LAST
                if (!b.date) return -1;
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }) || []
        , [videosData]);

    // SET INITIAL ACTIVE VIDEO WHEN VIDEOS DATA LOADS
    useEffect(() => {
        if (validVideos.length > 0 && !activeVideo) {
            // USE FIRST VIDEO (NEWEST BY DATE) DIRECTLY FROM SORTED ARRAY
            setActiveVideo(validVideos[0].id);
        }
    }, [validVideos, activeVideo]);

    // VISIBILITY CHANGE HANDLER
    const handleVisibilityChange = useCallback((isVisible: boolean) => {
        setIsInView(isVisible);
    }, []);

    // SAVE CURRENT VIDEO POSITION
    const saveCurrentPosition = useCallback(() => {
        if (prevActiveVideoRef.current && videoPlayerRef.current) {
            const currentVideoId = prevActiveVideoRef.current;
            const currentTime = videoPlayerRef.current.currentTime;

            setVideoPositions(prev => ({
                ...prev,
                [currentVideoId]: currentTime
            }));
        }
    }, []);

    // HANDLE CHANGING VIDEOS - SAVE CURRENT POSITION BEFORE CHANGING
    const handleVideoChange = useCallback((videoId: string, isManualSelection = false) => {
        saveCurrentPosition(); // SAVE CURRENT VIDEO POSITION

        // IF MANUAL SELECTION, RESET AUTO-SWITCHED FLAG
        if (isManualSelection) {
            autoSwitchedRef.current = false;
            if (finishedVideosRef.current.has(videoId)) {
                setVideoPositions(prev => ({
                    ...prev,
                    [videoId]: 0
                }));

                // TRIGGER A RESET AFTER THE VIDEO HAS CHANGED
                setTimeout(() => {
                    setResetTrigger(prev => prev + 1);
                }, 50);
            }
        }

        // UPDATE ACTIVE VIDEO
        setActiveVideo(videoId);
        prevActiveVideoRef.current = videoId;
    }, [saveCurrentPosition]);

    // HANDLE VIDEO ENDED - MOVE TO NEXT VIDEO
    const handleVideoEnded = useCallback(() => {
        if (activeVideo && validVideos.length > 0) {
            // ADD TO FINISHED VIDEOS SET
            finishedVideosRef.current.add(activeVideo);

            const currentIndex = validVideos.findIndex(v => v.id === activeVideo);
            const nextIndex = (currentIndex + 1) % validVideos.length;
            const nextVideoId = validVideos[nextIndex].id;

            // SET AUTO-SWITCHED FLAG
            autoSwitchedRef.current = true;

            handleVideoChange(nextVideoId);
        }
    }, [activeVideo, handleVideoChange, validVideos]);

    // SET INITIAL ACTIVE VIDEO REF
    useEffect(() => {
        prevActiveVideoRef.current = activeVideo;

        // RESET AUTO-SWITCHED FLAG AFTER THE VIDEO HAS STARTED PLAYING
        // THIS ENSURES THAT WHEN MANUALLY SELECTING THE VIDEO LATER, IT WILL RESUME FROM SAVED POSITION
        if (autoSwitchedRef.current) {
            const timer = setTimeout(() => {
                autoSwitchedRef.current = false;
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [activeVideo]);

    // INITIALIZE
    useEffect(() => {
        if (typeof window === 'undefined') return;

        setIsMounted(true);

        // SHOW AFTER DELAY
        setTimeout(() => {
            setForceShow(true);
        }, 500);
    }, []);

    // INTERSECTION OBSERVER
    useEffect(() => {
        if (!sectionRef.current || typeof window === 'undefined') return;

        const currentRef = sectionRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                handleVisibilityChange(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );

        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
    }, [handleVisibilityChange]);

    // PRELIMINARY CHECKS
    if (!resolvedTheme || !isMounted || isSectionLoading || isVideosLoading) {
        return null;
    }

    // NO VIDEOS TO DISPLAY
    if (!validVideos || validVideos.length === 0) {
        return (
            <Section id="whatido" onVisibilityChange={handleVisibilityChange} disableAnimations={false}>
                <div ref={sectionRef} className="w-full">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                        {sectionData?.title || "What I Do"}
                        <ShowInfo
                            description={
                                <>
                                    {sectionData?.titleDescription} <br />{" "}
                                    <span className="text-xs text-neutral-500">
                                        {sectionData?.paragraphDescription}
                                    </span>
                                </>
                            }
                        />
                    </h2>
                    <div className="p-8 text-center border rounded-xl">
                        <p>No showcase videos available.</p>
                    </div>
                </div>
            </Section>
        );
    }

    // MAKE SURE ACTIVE VIDEO EXISTS AND HAS SRC
    const currentVideo = validVideos.find(v => v.id === activeVideo) || validVideos[0];
    const initialTime = autoSwitchedRef.current ? 0 : videoPositions[currentVideo.id] || 0;
    const needsReset = resetTrigger > 0 && finishedVideosRef.current.has(currentVideo.id);
    const shouldUseCarousel = validVideos.length > 4;

    return (
        <Section id="whatido" onVisibilityChange={handleVisibilityChange} disableAnimations={false}>
            <style jsx global>{carouselStyles}</style>
            <div ref={sectionRef} className="w-full">
                {/* TITLE */}
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    {sectionData?.title || "What I Do"}
                    <ShowInfo
                        description={
                            <>
                                {sectionData?.titleDescription} <br />{" "}
                                <span className="text-xs text-neutral-500">
                                    {sectionData?.paragraphDescription}
                                </span>
                            </>
                        }
                    />
                </h2>

                {/* CAROUSEL OF VIDEOCARDS IF MORE THAN 4 VIDEOS IS PRESENT */}
                <div className="space-y-4">
                    {shouldUseCarousel ? (
                        <div className="relative mb-8">
                            <Carousel
                                opts={{ align: "start" }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {validVideos.map((video) => (
                                        <CarouselItem key={video.id + (video.date || '')} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                            <div className="h-full w-full p-1">
                                                <VideoCard
                                                    video={video}
                                                    isActive={isInView}
                                                    onClick={() => handleVideoChange(video.id, true)}
                                                    isSelected={activeVideo === video.id}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="carousel-buttons">
                                    <CarouselPrevious className="left-1 hidden-when-disabled" />
                                    <CarouselNext className="right-1 hidden-when-disabled" />
                                </div>
                            </Carousel>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                            {validVideos.map((video) => (
                                <VideoCard
                                    key={video.id + (video.date || '')}
                                    video={video}
                                    isActive={isInView}
                                    onClick={() => handleVideoChange(video.id, true)}
                                    isSelected={activeVideo === video.id}
                                />
                            ))}
                        </div>
                    )}

                    {/* VIDEO PLAYER */}
                    {currentVideo && currentVideo.src && (
                        <Card
                            className={`rounded-xl overflow-hidden border-none ${resolvedTheme === "dark" ? "bg-neutral-900 text-white" : "bg-white text-black"
                                }`}
                        >
                            <ClientOnly id="video-container">
                                <div className="relative h-[600px]">
                                    <VideoPlayer
                                        ref={videoPlayerRef}
                                        src={currentVideo.src}
                                        isActive={isInView}
                                        recap={currentVideo.recap}
                                        project={currentVideo.project}
                                        initialTime={initialTime}
                                        onEnded={handleVideoEnded}
                                        loop={false}
                                        resetVideo={needsReset}
                                        debug={false}
                                        advancedDebug={false}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                        {currentVideo.project && (
                                            <p className="text-sm font-medium text-white/80 mb-1">{currentVideo.project}</p>
                                        )}
                                        <h3 className="text-xl font-bold text-white">{currentVideo.title}</h3>
                                        <p className="text-white/80">{currentVideo.description}</p>
                                    </div>
                                </div>
                            </ClientOnly>
                        </Card>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default WhatIDoV2Section; 
