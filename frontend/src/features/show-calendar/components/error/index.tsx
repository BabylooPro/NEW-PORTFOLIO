"use client";

import { CircleHelp, Loader2, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShowInfo } from "@/components/ui/show-info";
import { ErrorAnimation } from "@/components/decoration/error-animation";

export function ErrorAppointment() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// HANDLE BACK TO CALENDAR BUTTON
	const handleBackToCalendar = () => {
		setIsLoading(true);
		router.push("/showcalendar");
	};

	return (
		<>
			{/* ERROR MESSAGE */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full p-4 text-center overflow-hidden"
			>
				{/* ERROR ICON */}
				<div className="mb-6">
					<ErrorAnimation size={120} color="#ef4444" />
				</div>

				{/* ERROR TITLE */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="text-2xl font-bold mb-4 text-red-500"
				>
					Appointment Scheduling Failed
				</motion.h1>

				{/* ERROR MESSAGE */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="text-neutral-500 dark:text-neutral-400 mb-8"
				>
					We couldn&apos;t schedule your appointment at this time. This could be due to a
					scheduling conflict or technical issue. <br /> Please try selecting another time
					slot.
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
						onClick={handleBackToCalendar}
						className="bg-red-500 hover:bg-red-600"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Try Another Time Slot"
						)}
					</Button>

					{/* SHOW INFO */}
					<div className="absolute left-[calc(50%+120px)] mt-1">
						<ShowInfo
							icon={<CircleHelp className="text-red-500" />}
							title="Scheduling Issue"
							description={
								<div className="text-left">
									<p className="mb-2">Possible reasons:</p>
									<ol className="list-decimal pl-4 space-y-1">
										<li>The time slot is no longer available</li>
										<li>There was an issue with the calendar sync</li>
										<li>
											Please try selecting a different time or contact me
											directly
										</li>
									</ol>
								</div>
							}
						/>
					</div>
				</motion.div>
			</motion.div>
		</>
	);
}
