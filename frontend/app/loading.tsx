"use client";

import { motion } from "framer-motion";
import MRDLoader from "@/components/decoration/mrd-loader";

export default function Loading() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full p-4 text-center overflow-hidden"
		>
			{/* MRD LOADER */}
			<motion.div
				initial={{ scale: 0.8 }}
				animate={{
					scale: 1,
					transition: {
						repeat: Infinity,
						repeatType: "reverse",
						duration: 1,
					},
				}}
				className="mb-6"
			>
				<MRDLoader />
			</motion.div>
		</motion.div>
	);
}
