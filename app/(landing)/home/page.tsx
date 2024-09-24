import ExperienceSection from "@/features/landing/ExperienceSection";
import Footer from "@/features/landing/Footer";
import Header from "@/features/landing/Header";
import HeroSection from "@/features/landing/HeroSection";
import SkillSection from "@/features/landing/SkillSection";

export default function Home() {
	return (
		<div className="flex flex-col gap-4">
			<Header />
			<HeroSection />
			<ExperienceSection />
			<SkillSection />
			<Footer />
		</div>
	);
}
