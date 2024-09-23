import { OneClickModeToggle } from "@/features/themes/OneClickModeToggle";

export default function HeroSection() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">Max Remy Dev</h1>
			<h2 className="text-lg">Portfolio</h2>
			<OneClickModeToggle />
		</div>
	);
}
