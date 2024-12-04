"use client";

import { CircleHelp, Loader2, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShowInfo } from "@/components/ui/show-info";
import { NotFoundAnimation } from "@/components/decoration/not-found-animation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// HANDLE BACK TO HOME BUTTON
	const handleBackToHome = () => {
		setIsLoading(true);
		router.push("/");
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full p-4 text-center overflow-hidden"
		>
			{/* ERROR ICON */}
			<div className="mb-4">
				<NotFoundAnimation size={120} />
			</div>

			{/* ERROR TITLE */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="text-2xl font-bold mb-4"
			>
				Page Not Found
			</motion.h1>

			{/* ERROR MESSAGE */}
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="text-neutral-400 mb-8"
			>
				The page you are looking for doesn&apos;t exist or has been moved. <br />
				Please check the URL or return to the homepage.
			</motion.p>

			{/* HOME BUTTON AND SHOW INFO */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className="relative flex items-center justify-center"
			>
				{/* BACK TO HOME BUTTON */}
				<Button
					variant={["default", "ringHover", "expandIcon"]}
					Icon={<Undo2 className="size-4" />}
					iconPlacement="right"
					onClick={handleBackToHome}
					disabled={isLoading}
				>
					{isLoading ? <Loader2 className="size-4 animate-spin" /> : "Back to Home"}
				</Button>

				{/* SHOW INFO */}
				<div className="absolute left-[calc(50%+85px)] mt-1">
					<ShowInfo
						icon={<CircleHelp />}
						title="404 Error"
						description={
							<div className="text-left">
								<p className="mb-2">This could be due to:</p>
								<ol className="list-decimal pl-4 space-y-1">
									<li>A mistyped URL</li>
									<li>A broken link</li>
									<li>A page that has been moved or deleted</li>
								</ol>
							</div>
						}
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}
