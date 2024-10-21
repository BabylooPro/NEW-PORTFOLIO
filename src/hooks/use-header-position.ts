import { useEffect, useState } from "react";

export function useHeaderPosition() {
	const [headerBottom, setHeaderBottom] = useState(0);
	const [isHeaderMoved, setIsHeaderMoved] = useState(false);

	useEffect(() => {
		const updatePosition = () => {
			const header = document.querySelector("header");
			if (header) {
				const rect = header.getBoundingClientRect();
				setHeaderBottom(rect.bottom);
				setIsHeaderMoved(window.scrollY > 0);
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

	return { headerBottom, isHeaderMoved };
}
