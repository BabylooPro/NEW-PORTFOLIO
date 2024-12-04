"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Youtube } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function SocialSection() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 640);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isMobile) return null;

	return (
		<Section>
			<motion.div
				className="flex justify-center items-start space-x-6 py-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* GITHUB */}
				<motion.a
					href="https://github.com/babyloopro"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					transition={{ type: "spring", stiffness: 400, damping: 10 }}
				>
					<Github size={24} />
					<span className="text-xs mt-1">GitHub</span>
				</motion.a>

				{/* LINKEDIN */}
				<motion.a
					href="https://www.linkedin.com/in/maxremydev/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					transition={{ type: "spring", stiffness: 400, damping: 10 }}
				>
					<Linkedin size={24} />
					<span className="text-xs mt-1">LinkedIn</span>
				</motion.a>

				{/* YOUTUBE */}
				<motion.a
					href="https://www.youtube.com/@MaxRemyDev"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					transition={{ type: "spring", stiffness: 400, damping: 10 }}
				>
					<Youtube size={24} />
					<span className="text-xs mt-1">YouTube</span>
				</motion.a>

				{/* TWITTER/X */}
				<motion.a
					href="https://x.com/babyloopro"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center text-center hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					transition={{ type: "spring", stiffness: 400, damping: 10 }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={24}
						height={24}
						className="fill-current"
					>
						<path d="m26.37 26-8.795-12.822.015.012L25.52 4h-2.65l-6.46 7.48L11.28 4H4.33l8.211 11.971-.001-.001L3.88 26h2.65l7.182-8.322L19.42 26h6.95zM10.23 6l12.34 18h-2.1L8.12 6h2.11z" />
					</svg>
					<span className="text-xs mt-1 ml-1">X</span>
				</motion.a>
			</motion.div>
		</Section>
	);
}
