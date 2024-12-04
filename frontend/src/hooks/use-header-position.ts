import { useEffect, useState } from "react";

export function useHeaderPosition() {
	const [headerBottom, setHeaderBottom] = useState(0);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [isHeaderMoved, setIsHeaderMoved] = useState(false);
	const [isCompact, setIsCompact] = useState(false);

	useEffect(() => {
		const updatePosition = () => {
			const header = document.querySelector("header");
			if (header) {
				const rect = header.getBoundingClientRect();
				setHeaderBottom(rect.bottom);
				setHeaderHeight(rect.height);
				setIsHeaderMoved(window.scrollY > 0);
				setIsCompact(header.classList.contains("compact") || rect.height < 150);
			}
		};

		updatePosition();
		window.addEventListener("scroll", updatePosition);
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("scroll", updatePosition);
			window.removeEventListener("resize", updatePosition);
		};
	}, []);

	return { headerBottom, headerHeight, isHeaderMoved, isCompact };
}
