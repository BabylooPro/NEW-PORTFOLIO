"use client";

import { Bug, CircleHelp, Loader2, Undo2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ShowInfo } from "@/components/ui/show-info";
import { ErrorAnimation } from "@/components/decoration/error-animation";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [showErrorDetails, setShowErrorDetails] = useState(false);

	useEffect(() => {
		// LOGGING ERROR TO AN ERROR REPORTING SERVICE
		console.error(error);
	}, [error]);

	// HANDLE RESET ATTEMPT
	const handleReset = () => {
		setIsLoading(true);
		reset();
	};

	// TOGGLE ERROR DETAILS
	const toggleErrorDetails = () => {
		setShowErrorDetails(!showErrorDetails);
	};

	return (
		<>
			{/* ERROR OVERLAY */}
			{showErrorDetails && (
				<div className="fixed inset-0 bg-black/90 z-50 text-white p-4 overflow-auto">
					{/* ERROR DETAILS */}
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-mono">Runtime Error: MRD-{error.digest}</h2>
						<Button
							variant="ghost"
							onClick={toggleErrorDetails}
							className="hover:bg-white/10"
						>
							<X className="size-4" />
						</Button>
					</div>
					{/* ERROR MESSAGE AND CALL STACK */}
					<div className="font-mono">
						<p className="text-red-400 mb-4">{error.message}</p>
						<div className="bg-black/50 p-4 rounded">
							<p className="text-neutral-400 mb-2">Call Stack:</p>
							<pre className="whitespace-pre-wrap text-sm">{error.stack}</pre>
						</div>
					</div>
				</div>
			)}

			{/* ERROR MESSAGE AND ACTIONS */}
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
					Something Went Wrong!
				</motion.h1>

				{/* ERROR MESSAGE */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="text-neutral-500 dark:text-neutral-400 mb-8"
				>
					An unexpected error was encountered. This could be due to a temporary issue.{" "}
					<br />
					Please try again or contact me if the problem persists.
				</motion.p>

				{/* RETRY BUTTON AND SHOW INFO */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="relative flex items-center justify-center"
				>
					{/* RETRY BUTTON */}
					<Button
						variant={["default", "ringHover", "expandIcon"]}
						Icon={<Undo2 className="size-4" />}
						iconPlacement="right"
						onClick={handleReset}
						className="bg-red-500 hover:bg-red-600"
						disabled={isLoading}
					>
						{isLoading ? <Loader2 className="size-4 animate-spin" /> : "Try Again"}
					</Button>

					{/* SHOW INFO */}
					<div className="absolute left-[calc(50%+75px)] mt-1">
						<ShowInfo
							icon={<CircleHelp className="text-red-500" />}
							title="Error Details"
							description={
								<div className="text-left">
									<p className="mb-2">If the error persists:</p>
									<ol className="list-decimal pl-4 space-y-1">
										<li>Refresh your browser</li>
										<li>Clear your browser cache</li>
										<li>Contact support with error code: MRD-{error.digest}</li>
									</ol>
								</div>
							}
						/>
					</div>
				</motion.div>

				{/* SHOW ERROR DETAILS BUTTON */}
				<Button
					variant="icon"
					className="absolute top-4 right-4 hover:bg-white/10"
					onClick={toggleErrorDetails}
				>
					<Bug className="size-4" />
				</Button>
			</motion.div>
		</>
	);
}
