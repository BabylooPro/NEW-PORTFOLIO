"use client";

import AppleEmoji from "@/components/decoration/apple-emoji";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { PocketKnife } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { ShowInfo } from "@/components/ui/show-info";
import AudioReader from "@/components/ui/AudioReader";
import { useState } from "react";

export default function HeroSection() {
	const ref = useRef<HTMLSpanElement>(null);
	const mouseX = useMotionValue(0);
	const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
	const [isCardVisible, setIsCardVisible] = useState(false);

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

	return (
		<Section className="px-4 md:px-8">
			{/* TITLE */}
			<h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 flex items-center">
				Hello,
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
			<p className="md:text-xl">
				I’m a Developer or Software Engineer, call me what you want, but I’m a “young-old”
				C# specialist. You could say I’m a FullStack Developer with 9 years of experience. I
				work on everything that interests me. As a Swiss Freelance Developer, I do a bit of
				everything: building CLI, RESTful API, web or mobile application, and even DevOps
				for deployment.
			</p>

			{/* SWISS ARMY KNIFE */}
			<div className="md:text-xl mt-4">
				In short, I&apos;m your{" "}
				<span
					ref={ref}
					className="relative inline-block cursor-pointer"
					onMouseMove={handleMouseMove}
					onClick={handleClick}
				>
					<span>Swiss Army Knife</span>
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
				for any development needs.
			</div>

			{/* LEARN MORE REDIRECT */}
			<div className="text-base md:text-xl mt-4 flex justify-between items-center">
				<div>
					Learn more
					<Button variant="linkHover1" className="text-base md:text-xl -ml-3">
						<Link href="/about">about me.</Link>
					</Button>
				</div>

				<ShowInfo wrapMode>
					<ShowInfo.Title>Audio version</ShowInfo.Title>
					<ShowInfo.Description>Listen to my resume</ShowInfo.Description>
					<ShowInfo.Content>
						<AudioReader src="/assets/audio/HeroTextAudio.mp3" />
					</ShowInfo.Content>
				</ShowInfo>
			</div>
		</Section>
	);
}
