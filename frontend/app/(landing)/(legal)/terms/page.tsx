import { Metadata } from "next";
import Header from "@/components/ui/header/Header";
import Footer from "@/features/landing/Footer";
import { TermsOfUse } from "@/features/legal/TermsOfUse";

export const metadata: Metadata = {
    title: "Terms of Use",
    description: "Terms of Use for Max Remy's Portfolio Website",
};

export default function PrivacyPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="h-16 max-sm:h-12" />
            <Header />
            <TermsOfUse />
            <Footer />
        </div>
    );
} 
