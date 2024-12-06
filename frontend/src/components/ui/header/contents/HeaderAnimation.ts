export const MULTIDIRECTION_SLIDE_VARIANTS = {
	initial: (direction: number) => ({
		x: direction * 200,
		opacity: 0,
		scale: 0.5,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	}),
	animate: {
		x: 0,
		opacity: 1,
		scale: 1,
		transition: {
			duration: 1,
			ease: "easeInOut",
		},
	},
	exit: (direction: number) => ({
		x: direction * -200,
		opacity: 0,
		scale: 0.5,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	}),
};

export const HEADER_ANIMATION = {
	initial: { opacity: 0, scale: 0.98 },
	animate: {
		opacity: 1,
		scale: 1,
	},
	transition: {
		duration: 2.5,
		ease: [0.34, 1.56, 0.64, 1],
		opacity: { duration: 0.5 },
		scale: {
			type: "spring",
			damping: 25,
			stiffness: 150,
			duration: 0.5,
		},
		top: {
			type: "spring",
			damping: 15,
			stiffness: 80,
			duration: 0.5,
		},
		padding: { duration: 0.5 },
		height: {
			type: "spring",
			damping: 20,
			stiffness: 90,
			duration: 0.5,
		},
		width: {
			type: "spring",
			damping: 20,
			stiffness: 90,
			duration: 0.5,
		},
	},
	variants: {
		hidden: { opacity: 0, y: 50, scale: 0.9 },
		visible: { opacity: 1, y: 0, scale: 1 },
	},
}; 
