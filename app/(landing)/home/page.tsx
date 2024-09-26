import ExperienceSection from "@/features/landing/ExperienceSection";
import Footer from "@/features/landing/Footer";
import Header from "@/features/landing/Header";
import HeroSection from "@/features/landing/HeroSection";
import SkillSection from "@/features/landing/SkillSection";
import SideProjectsSection from "@/features/landing/SideProjectsSection";
// import { ContactSection } from "@/features/landing/ContactSection";

export default function Home() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-16 max-sm:h-12" />
			<Header />
			<HeroSection />
			<ExperienceSection />
			<SkillSection />
			<SideProjectsSection />
			{/* <ContactSection /> */} {/* WARN: THIS SECTION IS NOT WORKING YET*/}
			<Footer />
		</div>
	);
}
