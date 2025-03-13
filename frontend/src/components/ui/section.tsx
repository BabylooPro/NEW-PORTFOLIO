/*
    INFO: THIS FILE DEFINES 'SECTION' COMPONENT WHICH IS USED IN VARIOUS PARTS OF LANDING PAGE.
    INFO: IT PROVIDES A UNIFORM STRUCTURING OF SECTIONS WITH FLEXIBILITY THROUGH PROPS FOR CLASSES AND IDS,
    INFO: THUS FACILITATING CODE REUSE AND DESIGN UNIFORMITY ACROSS PAGE.
*/

"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export type SectionProps = PropsWithChildren<{
    className?: string;
    sectionClassName?: string;
    id?: string;
    disableAnimations?: boolean;
    onVisibilityChange?: (isVisible: boolean) => void;
}>;

export const Section = (props: SectionProps) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    const prevIsInViewRef = useRef(false); // TRACK PREVIOUS STATE TO PREVENT DUPLICATE NOTIFICATIONS
    const { onVisibilityChange } = props;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const newIsInView = entry.isIntersecting;
                    setIsInView(newIsInView);

                    // ONLY NOTIFY WHEN STATE ACTUALLY CHANGES TO PREVENT LOOPS
                    if (onVisibilityChange && prevIsInViewRef.current !== newIsInView) {
                        prevIsInViewRef.current = newIsInView;
                        onVisibilityChange(newIsInView);
                    }
                });
            },
            { threshold: 0.1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, [onVisibilityChange]);

    const variants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    if (props.disableAnimations) {
        return (
            <section id={props.id} className={cn(props.sectionClassName)} ref={ref}>
                <div
                    className={cn(
                        "flex flex-col justify-center w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 max-md:py-5",
                        props.className
                    )}
                >
                    {props.children}
                </div>
            </section>
        );
    }

    return (
        <motion.section
            id={props.id}
            className={cn(props.sectionClassName)}
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.25,
            }}
        >
            <div
                className={cn(
                    "flex flex-col justify-center w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 max-md:py-5",
                    props.className
                )}
            >
                {props.children}
            </div>
        </motion.section>
    );
};
