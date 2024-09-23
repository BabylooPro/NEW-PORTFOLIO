"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export function OneClickModeToggle() {
	const { setTheme, theme, systemTheme } = useTheme();
	const [isThemeLoaded, setIsThemeLoaded] = useState(false);

	useEffect(() => {
		if (theme !== undefined) {
			setIsThemeLoaded(true);
		}
	}, [theme]);

	const effectiveTheme = theme === "system" ? systemTheme : theme;

	const variants = {
		enter: { scale: 1, opacity: 1, rotate: 0 },
		exit: { scale: 0, opacity: 0, rotate: 90 },
	};

	if (!isThemeLoaded) {
		return null; // OPTIONALLY RENDER A PLACEHOLDER OR NOTHING UNTIL THE THEME IS FULLY LOADED
	}

	return (
		<TooltipProvider disableHoverableContent>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<motion.div
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Button
							className="relative rounded-full w-8 h-8 bg-transparent border-none hover:bg-transparent"
							variant="outline"
							size="icon"
							onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
						>
							<TooltipContent side="bottom">Switch Theme</TooltipContent>
							<AnimatePresence mode="wait">
								{effectiveTheme === "dark" ? (
									<motion.div
										key="sun"
										variants={variants}
										initial="exit"
										animate="enter"
										exit="exit"
										whileHover={{ rotate: -45 }}
										className="flex items-center justify-center w-full h-full"
									>
										<Sun className="w-[1.2rem] h-[1.2rem] text-white" />
									</motion.div>
								) : (
									<motion.div
										key="moon"
										variants={variants}
										initial="exit"
										animate="enter"
										exit="exit"
										whileHover={{ rotate: 45 }}
										className="flex items-center justify-center w-full h-full"
									>
										<Moon className="w-[1.2rem] h-[1.2rem] text-black" />
									</motion.div>
								)}
							</AnimatePresence>
							<span className="sr-only">Switch Theme</span>
						</Button>
					</motion.div>
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	);
}
