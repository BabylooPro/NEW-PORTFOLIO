"use client";

import { CircleHelp, Loader2, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SuccessAnimation } from "@/components/decoration/success-animation";
import { ShowInfo } from "@/components/ui/show-info";

export function SuccessAppointment() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// HANDLE BACK TO HOME BUTTON
	const handleBackToHome = () => {
		setIsLoading(true);
		router.push("/");
	};

	return (
		<>
			{/* <Confetti
				style={{
					position: "fixed",
					pointerEvents: "none",
					width: "100%",
					height: "100%",
					top: 0,
					left: 0,
				}}
			/> */}

			{/* SUCCESS MESSAGE */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full p-4 text-center overflow-hidden"
			>
				{/* SUCCESS ICON */}
				<div className="mb-6">
					<SuccessAnimation size={120} color="#22c55e" />
				</div>

				{/* SUCCESS TITLE */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="text-2xl font-bold mb-4"
				>
					Meeting Successfully Planned and Reserved !
				</motion.h1>

				{/* SUCCESS MESSAGE */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="text-neutral-500 dark:text-neutral-400 mb-8"
				>
					You will receive a confirmation email shortly with all the meeting details and
					invitation link.
				</motion.p>

				{/* BACK BUTTON AND SHOW INFO */}
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
						className="px-8"
						disabled={isLoading}
					>
						{isLoading ? <Loader2 className="size-4 animate-spin" /> : "Back to Home"}
					</Button>

					{/* SHOW INFO */}
					<div className="absolute left-[calc(50%+120px)] mt-1">
						<ShowInfo
							icon={<CircleHelp />}
							title="Check your email"
							description={
								<div className="text-left">
									A confirmation email has been sent to you. <br /> It contains
									all the information regarding our appointment as well as the
									next steps to follow. <br /> Don&apos;t forget to check your
									spam folder if you can&apos;t find the email.
								</div>
							}
						/>
					</div>
				</motion.div>
			</motion.div>
		</>
	);
}
