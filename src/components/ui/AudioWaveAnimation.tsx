import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { useAudioAnalyser } from "./useAudioAnalyser";

interface WaveAnimationProps {
	isPlaying: boolean;
	isEnded: boolean;
	audioRef: React.RefObject<HTMLAudioElement>;
	audioContext: AudioContext | null;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({
	isPlaying,
	isEnded,
	audioRef,
	audioContext,
}) => {
	const [levels, setLevels] = useState<number[]>(Array(6).fill(2));
	const analyser = useAudioAnalyser(audioRef, audioContext);
	const animationFrameRef = useRef<number | null>(null);
	const prevLevelsRef = useRef<number[]>(Array(6).fill(2));

	const generateRandomLevels = () => Array.from({ length: 6 }, () => Math.random() * 80 + 20);

	useEffect(() => {
		setLevels(generateRandomLevels());
	}, []);

	useEffect(() => {
		if (!analyser) {
			return;
		}

		const dataArray = new Uint8Array(analyser.frequencyBinCount);

		const updateLevels = () => {
			analyser.getByteFrequencyData(dataArray);
			const newLevels = Array.from({ length: 6 }, (_, i) => {
				// USE A WIDER RANGE OF FREQUENCIES
				const start = i * 8;
				const end = start + 8;
				const slice = dataArray.slice(start, end);
				const average = slice.reduce((a, b) => a + b, 0) / slice.length;
				const rawLevel = Math.max(2, (average / 255) * 100);
				const prevLevel = prevLevelsRef.current[i];
				// SMOOTH THE TRANSITION BETWEEN LEVELS
				return prevLevel + (rawLevel - prevLevel) * 0.15;
			});
			setLevels(newLevels);
			prevLevelsRef.current = newLevels;
			animationFrameRef.current = requestAnimationFrame(updateLevels);
		};

		if (isPlaying) {
			updateLevels();
		} else {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (isEnded) {
				const randomLevels = generateRandomLevels();
				setLevels(randomLevels);
				prevLevelsRef.current = randomLevels;
			} else {
				// GRADUALLY RETURN TO IDLE STATE
				const idleLevels = Array(6).fill(2);
				setLevels(
					prevLevelsRef.current.map((level, i) => level + (idleLevels[i] - level) * 0.1)
				);
			}
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isPlaying, isEnded, analyser]);

	return (
		<div className="flex justify-between items-center h-6 w-10">
			{levels.map((level, idx) => (
				<div key={idx} className="h-full w-[10%] flex flex-col justify-center">
					<motion.div
						className="bg-neutral-400 rounded-t-md w-full"
						style={{ height: `${level / 2}%` }}
						initial={{ height: "1%" }}
						animate={{ height: `${level / 2}%` }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					/>
					<motion.div
						className="bg-neutral-400 rounded-b-md w-full"
						style={{ height: `${level / 2}%` }}
						initial={{ height: "1%" }}
						animate={{ height: `${level / 2}%` }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					/>
				</div>
			))}
		</div>
	);
};

export default WaveAnimation;
