import { useRef, useEffect, useState } from "react";

export function useAudioAnalyser(
	audioRef: React.RefObject<HTMLAudioElement | null>,
	audioContext: AudioContext | null
) {
	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
	const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !audioContext) return;

		const setupAudioAnalyser = () => {
			if (!sourceRef.current) {
				sourceRef.current = audioContext.createMediaElementSource(audio);
			}

			const newAnalyser = audioContext.createAnalyser();
			// INCREASE FFT SIZE FOR MORE DETAILED FREQUENCY DATA
			newAnalyser.fftSize = 256;
			// ADJUST SMOOTHING TIME CONSTANT FOR SMOOTHER TRANSITIONS
			newAnalyser.smoothingTimeConstant = 0.8;

			sourceRef.current.connect(newAnalyser);
			newAnalyser.connect(audioContext.destination);
			setAnalyser(newAnalyser);
		};

		setupAudioAnalyser();

		return () => {
			if (sourceRef.current) {
				sourceRef.current.disconnect();
			}
			if (analyser) {
				analyser.disconnect();
			}
		};

		//! MAYBE THAT IS WHY CAUSE ARTEFACTS IN WAVE ANIMATION ?
		// INFO: DISABLED WARNING FOR BUILD, CANT PUT ANALYSER IN DEPENDENCY ARRAY, IT CAUSES RE-RENDER LOOP = AUDIO LAG
		// Warning: React Hook useEffect has a missing dependency: 'analyser'. Either include it or remove the dependency array.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioRef, audioContext]);

	return analyser;
}
