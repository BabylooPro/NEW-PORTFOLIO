import { TooltipContent } from "@/components/ui/tooltip";
import { createPortal } from "react-dom";

export const PortalTooltipContent = ({
	children,
	...props
}: React.PropsWithChildren<React.ComponentProps<typeof TooltipContent>>) => {
	if (typeof window === "undefined") return null;
	return createPortal(<TooltipContent {...props}>{children}</TooltipContent>, document.body);
}; 
