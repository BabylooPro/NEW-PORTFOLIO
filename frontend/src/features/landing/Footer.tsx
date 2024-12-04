import { CodeXml } from "lucide-react";
import React from "react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-8 sm:py-12 md:py-16 flex justify-center items-center">
			<div className="flex items-center space-x-2 text-center">
				<span className="text-xs sm:text-sm md:text-base font-bold">
					&copy; {currentYear} MAX REMY DEV
				</span>
				<CodeXml className="w-6 h-6 sm:w-8 sm:h-8" />
				<span className="text-xs sm:text-sm md:text-base font-bold">
					ALL RIGHTS RESERVED
				</span>
			</div>
		</footer>
	);
};

export default Footer;
