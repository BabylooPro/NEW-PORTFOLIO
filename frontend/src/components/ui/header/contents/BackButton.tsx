import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PortalTooltipContent } from "./PortalTooltipContent";

interface BackButtonProps {
	onClick: () => void;
	previousPageTitle: string;
}

export const BackButton = ({ onClick, previousPageTitle }: BackButtonProps) => (
	<TooltipProvider delayDuration={0}>
		<Tooltip>
			<TooltipTrigger asChild>
				<motion.button
					onClick={onClick}
					className="absolute left-4 sm:left-5 top-4 sm:top-5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					<ArrowLeft size={24} />
				</motion.button>
			</TooltipTrigger>
			<PortalTooltipContent side="bottom">
				<span>Back to {previousPageTitle}</span>
			</PortalTooltipContent>
		</Tooltip>
	</TooltipProvider>
); 
