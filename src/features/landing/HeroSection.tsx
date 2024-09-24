"use client";

import AppleEmoji from "@/components/decoration/apple-emoji";
import { Section } from "@/components/ui/section";
import { motion } from "framer-motion";

export default function HeroSection() {
	return (
		<Section>
			<h1 className="text-5xl font-bold tracking-tight mb-4 flex items-center">
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
			<p className="text-xl">
				I’m a Developer or Software Engineer, call me what you want, but I’m a “young-old”
				C# specialist. You could say I’m a FullStack Developer with 9 years of experience. I
				work on everything that interests me. As a Swiss Freelance Developer, I do a bit of
				everything: building CLI, RESTful API, web or mobile application, and even DevOps
				for deployment. <br />
				<br /> In short, I’m your Swiss army knife for any development needs.
			</p>
		</Section>
	);
}
