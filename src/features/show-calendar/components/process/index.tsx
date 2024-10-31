"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProcessAnimation } from "@/components/decoration/process-animation";
import { CombinedFormValues } from "@/features/show-calendar/utils/schema";
import { WordRotate } from "@/components/decoration/word-rotate";

export function ProcessAppointment() {
	const router = useRouter();
	const [progress, setProgress] = useState(0);

	// SIMULATE PROCESSING STEPS
	useEffect(() => {
		const processSteps = async () => {
			try {
				// GET STORED DATA
				const storedData = sessionStorage.getItem("preFilledFormData");
				const formData = storedData ? JSON.parse(storedData) : null;

				if (!formData) {
					throw new Error("No form data found");
				}

				// SIMULATE API CALLS AND PROCESSING
				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(15);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(25);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(35);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(50);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(65);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(75);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(85);

				await new Promise((resolve) => setTimeout(resolve, 2500));
				setProgress(100);
				await new Promise((resolve) => setTimeout(resolve, 2500));

				// PREPARE FINAL DATA
				const finalData: CombinedFormValues = {
					...formData.formData,
					scheduling: formData.combinedData,
				};

				// STORE FINAL DATA
				sessionStorage.setItem("finalSubmissionData", JSON.stringify(finalData));

				await new Promise((resolve) => setTimeout(resolve, 1000));
				setProgress(100);

				// REDIRECT TO SUCCESS PAGE
				router.push("/showcalendar/success");
			} catch (error) {
				console.error("Processing error:", error);
				router.push("/showcalendar/error");
			}
		};

		processSteps();
	}, [router]);

	const getProcessingWord = () => {
		if (progress < 15) {
			return ["Analyzing Your Request"];
		} else if (progress < 25) {
			return ["Checking Available Slots"];
		} else if (progress < 35) {
			return ["Validating Time Preferences"];
		} else if (progress < 50) {
			return ["Reserving Your Time Slot"];
		} else if (progress < 65) {
			return ["Last Check of Your Information"];
		} else if (progress < 75) {
			return ["Preparing Our Meeting"];
		} else if (progress < 85) {
			return ["Finalizing Your Reservation"];
		} else if (progress < 100) {
			return ["Syncing Calendar"];
		} else {
			return ["Our Appointment is Ready !"];
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full p-4 text-center"
		>
			{/* PROCESS ANIMATION */}
			<div className="mb-6">
				<ProcessAnimation size={120} color="#3b82f6" />
			</div>

			{/* PROCESS TITLE */}
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="text-2xl font-bold mb-4"
			>
				<WordRotate
					words={getProcessingWord()}
					className="text-2xl font-semibold text-center"
					duration={2000}
				/>
			</motion.h1>

			{/* PROGRESS BAR */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="w-64 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden"
			>
				<motion.div
					className="h-full bg-blue-500"
					initial={{ width: 0 }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.5 }}
				/>
			</motion.div>

			{/* PROGRESS TEXT */}
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className="text-neutral-500 dark:text-neutral-400 mt-4"
			>
				Please wait while my code processes our appointment...
			</motion.p>
		</motion.div>
	);
}
