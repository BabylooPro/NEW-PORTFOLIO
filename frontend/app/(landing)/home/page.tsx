import type { Metadata } from "next";
//import { Suspense } from "react";
import ExperienceSection from "@/features/landing/ExperienceSection";
import Footer from "@/features/landing/Footer";
import Header from "@/components/ui/header/Header";
import HeroSection from "@/features/landing/HeroSection";
import SkillSection from "@/features/landing/SkillSection";
import SideProjectsSection from "@/features/landing/SideProjectsSection";
import SocialSection from "@/features/landing/SocialSection";
import ContactSection from "@/features/landing/ContactSection";
import { ScrollToSection } from '@/components/ScrollToSection';
//import { ShowCalendarIndex } from "@/features/show-calendar";
//import { Loader } from "lucide-react";
import WhatIDoV2Section from "@/features/landing/WhatIDoV2Section";

export const metadata: Metadata = {
    title: "Home",
    description: "Home",
};

export default function Home() {
    return (
        <div className="flex flex-col gap-4">
            <ScrollToSection />
            <div className="h-16 max-sm:h-12" />
            <Header />
            <HeroSection />
            <SocialSection />
            <SkillSection />
            <ExperienceSection />
            <SideProjectsSection />
            <WhatIDoV2Section />
            {/*<Suspense fallback={<Loader className="animate-spin" />}>
                 <ShowCalendarIndex />
            </Suspense>*/}
            <ContactSection />
            <Footer />
        </div>
    );
}
