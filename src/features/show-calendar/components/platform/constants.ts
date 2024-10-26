import { Phone, MapPin, Monitor } from "lucide-react";
import { FaDiscord, FaMicrosoft } from "react-icons/fa";
import { SiGooglemeet, SiZoom } from "react-icons/si";

// LIST OF PLATFORMS COMPATIBLE WITH CALENDAR
export const platforms = [
	{ value: "phone", label: "Phone call", icon: Phone },
	{ value: "teams", label: "Microsoft Teams", icon: FaMicrosoft },
	{ value: "meet", label: "Google Meet", icon: SiGooglemeet },
	{ value: "zoom", label: "Zoom", icon: SiZoom },
	{ value: "discord", label: "Discord", icon: FaDiscord },
	{ value: "other", label: "Other", icon: Monitor },
	{ value: "physical", label: "Physical Location", icon: MapPin },
];
