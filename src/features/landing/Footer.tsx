import { CodeXml } from "lucide-react";
import React from "react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-16 flex justify-center items-center">
			<div className="flex items-center space-x-2">
				<span className="text-xs sm:text-sm font-bold">
					&copy; {currentYear} MAX REMY DEV
				</span>
				<CodeXml className="w-8 h-8" />
				<span className="text-xs sm:text-sm font-bold">ALL RIGHTS RESERVED</span>
			</div>
		</footer>
	);
};

export default Footer;
