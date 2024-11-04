import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

export default function MRDLoader() {
	const [scope, animate] = useAnimate();

	// INITIATE LOADER ANIMATION
	useEffect(() => {
		const initiateLoaderAnimation = async () => {
			animate(
				[
					[".m1", { pathLength: 0.5, pathOffset: 0 }], // STARTING POINT FOR PATH 1
					[".m1", { pathLength: 0.005, pathOffset: 0 }], // END POINT FOR PATH 1
					[".m2", { pathLength: 0.5, pathOffset: 0.5 }, { at: "<" }], // STARTING POINT FOR PATH 2
				],
				{
					duration: 2,
					ease: "linear",
					repeat: Infinity,
				}
			);
		};
		initiateLoaderAnimation();
	}, [animate]); // INITIATE ANIMATION ONCE

	return (
		<svg
			ref={scope} // REFERENCE TO SCOPE FOR ANIMATION
			width="30mm"
			height="30mm"
			viewBox="0 0 30 30"
			className="stroke-foreground stroke-[1.7] fill-none"
		>
			<motion.path
				className="m1"
				initial={{ pathLength: 0.5, pathOffset: 0.5 }}
				d="M 1.0913967,27.435857 6.1678497,0.90879279 14.446371,20.084977 23.021669,0.90879279 27.582665,27.435857 H 23.84952 L 21.522164,12.542343 14.38389,28.570437 7.4486773,12.526363 4.8557837,27.435857 Z"
			/>
			<motion.path
				className="m2"
				initial={{ pathLength: 0, pathOffset: 1 }}
				d="M 1.0913967,27.435857 6.1678497,0.90879279 14.446371,20.084977 23.021669,0.90879279 27.582665,27.435857 H 23.84952 L 21.522164,12.542343 14.38389,28.570437 7.4486773,12.526363 4.8557837,27.435857 Z"
			/>
		</svg>
	);
}
