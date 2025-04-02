"use client";

import { useRef, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { OneClickModeToggle } from "../../../features/themes/OneClickModeToggle";
import { useWakaTimeData } from "@/utils/WakaTimeProvider";
import { useHeaderPosition } from "@/hooks/use-header-position";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dock } from "@/components/decoration/dock";

// IMPORT ELEMENTS
import { ProfileContent } from "./contents/ProfileContent";
import { ProfileDescription } from "./contents/ProfileDescription";
import { SocialItems } from "./contents/SocialItems";
import { WIPBadge } from "./contents/WIPBadge";
import { BackButton } from "./contents/BackButton";
import { HEADER_ANIMATION, MULTIDIRECTION_SLIDE_VARIANTS } from "./contents/HeaderAnimation";
import { useHeaderLogic } from "./hooks/useHeaderLogic";
import { HeaderSkeleton } from "./contents/HeaderSkeleton";
import { useHeaderSection } from "./hooks/useHeaderSection";

// HEADER COMPONENT
export default function Header() {
    const {
        isScrolling,
        isClient,
        isCompact,
        // isLoading: headerLogicLoading,
        showWIPBadge,
        lastCommitInfo,
        showDebugButton,
        pathname,
        handleBackNavigation,
        getPreviousPageTitle,
        // toggleDebugBorders,
    } = useHeaderLogic();

    // INITIALIZE DATA
    const { data: headerData, isLoading: _headerDataLoading, error: _error } = useHeaderSection();

    // FORCE DATA REFETCH ON COMPONENT MOUNT - EXTRA PRECAUTION AGAINST DATA INCONSISTENCIES
    useEffect(() => {
        // WAIT A SHORT TIME TO ENSURE DATA IS FETCHED - PREVENTS FLASHING
        const timer = setTimeout(() => {
            if (!headerData || !headerData.profile?.name) {
                console.warn('Header data not loaded properly, forcing refetch');
                // RELOAD THE PAGE TO FORCE A FRESH FETCH
                window.location.reload();
            }
        }, 2000); // WAIT 2 SECONDS

        return () => clearTimeout(timer);
    }, [headerData]);

    // WAKA TIME DATA
    const wakaTimeData = useWakaTimeData();

    // HEADER POSITION
    const { isHeaderMoved } = useHeaderPosition();

    // MEDIA QUERIES
    const isSmallScreen = useMediaQuery("(max-width: 640px)");
    const isLaptop = useMediaQuery("(max-width: 1440px)");

    // REFS
    const profileRef = useRef<HTMLDivElement>(null);
    const separatorRef = useRef(null);
    const socialLinksRef = useRef<HTMLDivElement>(null);

    // NEVER SHOW SKELETON - ALWAYS USE DATA (FALLBACK PROVIDED IN HOOK) //! CHECK IF THIS IS STILL NEEDED
    if (!headerData) {
        console.error('Header data still null after fallbacks');
        return <HeaderSkeleton />;
    }

    return (
        <>
            {/* WIP BADGE */}
            {showWIPBadge && (
                <WIPBadge
                    showDebugButton={showDebugButton}
                    // toggleDebugBorders={toggleDebugBorders}
                    lastCommitInfo={lastCommitInfo}
                />
            )}

            {/* HEADER */}
            <LayoutGroup>
                <motion.header
                    {...HEADER_ANIMATION}
                    animate={{
                        ...HEADER_ANIMATION.animate,
                        top: isScrolling ? 0 : isHeaderMoved ? "2.5rem" : "5rem",
                        padding: isCompact ? "1rem" : "1.5rem",
                        height: isCompact ? "6.5rem" : "auto",
                        width:
                            isCompact && isLaptop
                                ? "100%"
                                : isSmallScreen
                                    ? "90%"
                                    : isCompact
                                        ? "35%"
                                        : "100%",
                    }}
                    className={`sticky z-[98] flex items-center justify-center max-xl:w-3/4 w-full max-w-5xl mx-auto shadow-2xl rounded-2xl bg-neutral-300/30 dark:bg-neutral-900/70 backdrop-blur-md mt-0`}
                    style={{
                        willChange: "transform, opacity, padding, height",
                        minHeight: isCompact ? "5.5rem" : "auto",
                    }}
                    layout
                >
                    {/* BACK BUTTON */}
                    {pathname !== "/" && (
                        <BackButton
                            onClick={handleBackNavigation}
                            previousPageTitle={getPreviousPageTitle()}
                        />
                    )}

                    {/* LAYOUT GROUP */}
                    <LayoutGroup>
                        <motion.div
                            className={`flex relative ${isCompact
                                ? "flex-row justify-between items-center w-full mx-10"
                                : "flex-col items-center"
                                }`}
                            initial={{ opacity: 1 }}
                            animate={{
                                flexDirection: isCompact ? "row" : "column",
                                justifyContent: isCompact ? "space-between" : "center",
                                alignItems: isCompact ? "center" : "center",
                                width: isCompact ? "100%" : "auto",
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                                layout: {
                                    duration: 0.5,
                                    ease: "easeOut",
                                },
                            }}
                            layout="position"
                        >
                            {/* PROFILE */}
                            {isSmallScreen ? (
                                <div className="flex items-center justify-center z-10 space-x-2">
                                    <div className="flex items-center justify-center space-x-2">
                                        <ProfileContent wakaTimeData={wakaTimeData} />
                                        <ProfileDescription
                                            isSmallScreen={isSmallScreen}
                                            isCompact={isCompact}
                                            profile={headerData.profile}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    variants={MULTIDIRECTION_SLIDE_VARIANTS}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    custom={isCompact ? -1 : 1}
                                    style={{
                                        willChange: "transform",
                                        backfaceVisibility: "hidden",
                                    }}
                                >
                                    <motion.div
                                        ref={profileRef}
                                        className={`flex items-center justify-center z-10 ${isCompact ? "space-x-2" : "space-x-2 sm:space-x-4"
                                            }`}
                                        initial={false}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            scale: 1,
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            ease: [0.34, 1.56, 0.64, 1],
                                            scale: {
                                                type: "spring",
                                                damping: 15,
                                                stiffness: 90,
                                                duration: 3,
                                            },
                                        }}
                                        layout
                                    >
                                        <motion.div
                                            className="flex items-center justify-center space-x-2"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1,
                                                x: isCompact ? 0 : 0,
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                ease: [0.34, 1.56, 0.64, 1],
                                                delay: 0.6,
                                            }}
                                        >
                                            <ProfileContent wakaTimeData={wakaTimeData} />
                                            <ProfileDescription
                                                isSmallScreen={isSmallScreen}
                                                isCompact={isCompact}
                                                profile={headerData.profile}
                                            />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* SEPARATOR */}
                            {!isCompact && (
                                <motion.div
                                    ref={separatorRef}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{
                                        width: "100%",
                                        opacity: 1,
                                    }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{
                                        duration: 1,
                                        ease: "easeInOut",
                                    }}
                                    className="mt-2"
                                >
                                    <Separator className="bg-neutral-500 hidden sm:block" />
                                </motion.div>
                            )}

                            {/* SOCIAL LINKS */}
                            <motion.div
                                variants={MULTIDIRECTION_SLIDE_VARIANTS}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                custom={isCompact ? 1 : -1}
                                style={{
                                    willChange: "transform",
                                    backfaceVisibility: "hidden",
                                }}
                            >
                                <motion.div
                                    ref={socialLinksRef}
                                    className={`${isCompact
                                        ? "flex justify-end absolute right-0 top-1/2 -translate-y-1/2 -mt-1"
                                        : "relative hidden sm:flex"
                                        }`}
                                    initial={false}
                                    animate={{
                                        opacity: 1,
                                        x: isCompact ? 0 : 0,
                                        y: isCompact ? "-50%" : 10,
                                        scale: 1,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        opacity: { duration: 0.5 },
                                        y: {
                                            duration: 0.5,
                                            ease: "easeOut",
                                        },
                                    }}
                                    layout
                                >
                                    <motion.div
                                        animate={{
                                            y: isCompact ? 0 : 0,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeOut",
                                        }}
                                    >
                                        <Dock
                                            items={SocialItems(headerData.socialLinks) ?? []}
                                            className="bg-transparent dark:bg-transparent"
                                            styles={{
                                                hoverPosition: isCompact
                                                    ? "expand-center"
                                                    : "expand-down",
                                                containerSize: {
                                                    height: "4vh",
                                                },
                                            }}
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </LayoutGroup>

                    {isClient && (
                        <div className="absolute right-4 sm:right-5 top-4 sm:top-5">
                            <OneClickModeToggle />
                        </div>
                    )}
                </motion.header>
            </LayoutGroup>
        </>
    );
} 
