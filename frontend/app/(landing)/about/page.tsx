import AboutSection from "@/features/about/AboutSection";
import DevelopmentMethodologiesSection from "@/features/about/DevelopmentMethodologiesSection";
import ExpertiseSection from "@/features/about/ExpertiseSection";
import SoftSkillsSection from "@/features/about/SoftSkillsSection";
import Footer from "@/features/landing/Footer";
import Header from "@/components/ui/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description: "Information of about Max Remy",
};

export default function AboutPage() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-16 max-sm:h-12" />
			<Header />
			<AboutSection />
			<ExpertiseSection />
			<SoftSkillsSection />
			<DevelopmentMethodologiesSection />
			<Footer />
		</div>
	);
}
