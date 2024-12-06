"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Youtube } from "lucide-react";
import { Section } from "@/components/ui/section";
import { useHeaderSection } from "@/components/ui/header/hooks/useHeaderSection";

export default function SocialSection() {
	const [isMobile, setIsMobile] = useState(false);
	const { data, isLoading } = useHeaderSection();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 640);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isMobile || isLoading || !data?.socialLinks) return null;

	// HELPER FUNCTION TO GET ICON COMPONENT
	const getIconComponent = (iconType: string) => {
		switch (iconType.toLowerCase()) {
			case 'github':
				return <Github size={24} />;
			case 'linkedin':
				return <Linkedin size={24} />;
			case 'youtube':
				return <Youtube size={24} />;
			case 'twitter':
				return (
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						width={24} 
						height={24} 
						viewBox="0 0 24 24" 
						className="fill-current"
					>
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				);
			default:
				return null;
		}
	};

	return (
		<Section>
			<motion.div
				className="flex justify-center items-start space-x-6 py-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{data.socialLinks.map((link) => (
					<motion.a
						key={link.id}
						href={link.href}
						target={link.target}
						rel="noopener noreferrer"
						className="flex flex-col items-center hover:text-neutral-400 dark:hover:text-neutral-400 text-black dark:text-white transition-colors duration-200"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						{getIconComponent(link.iconType)}
						<span className="text-xs mt-1">{link.title}</span>
					</motion.a>
				))}
			</motion.div>
		</Section>
	);
}
