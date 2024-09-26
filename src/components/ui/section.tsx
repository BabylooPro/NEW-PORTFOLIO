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
}>;

export const Section = (props: SectionProps) => {
	const ref = useRef(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsInView(true);
					} else {
						setIsInView(false);
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
	}, [ref]);

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
				duration: 0.8,
				ease: "easeInOut",
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
