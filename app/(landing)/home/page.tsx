import Header from "@/features/landing/Header";
import HeroSection from "@/features/landing/HeroSection";

export default function Home() {
	return (
		<div className="flex flex-col gap-4">
			<Header />
			<HeroSection />
		</div>
	);
}
