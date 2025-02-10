import type { Metadata } from "next";
import ExperienceSection from "@/features/landing/ExperienceSection";
import Footer from "@/features/landing/Footer";
import Header from "@/components/ui/header/Header";
import HeroSection from "@/features/landing/HeroSection";
import SkillSection from "@/features/landing/SkillSection";
import SideProjectsSection from "@/features/landing/SideProjectsSection";
import WhatIDoSection from "@/features/landing/WhatIDoSection";
import SocialSection from "@/features/landing/SocialSection";
import ContactSection from "@/features/landing/ContactSection";
import { ScrollToContact } from '@/components/ScrollToContact';
import { ShowCalendarIndex } from "@/features/show-calendar";

export const metadata: Metadata = {
    title: "Home",
    description: "Home",
};

export default function Home() {
    return (
        <div className="flex flex-col gap-4">
            <ScrollToContact />
            <div className="h-16 max-sm:h-12" />
            <Header />
            <HeroSection />
            <SocialSection />
            <SkillSection />
            <ExperienceSection />
            <SideProjectsSection />
            <WhatIDoSection />
            <ShowCalendarIndex />
            <ContactSection />
            <Footer />
        </div>
    );
}
