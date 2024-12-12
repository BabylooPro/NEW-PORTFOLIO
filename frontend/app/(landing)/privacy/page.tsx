import { Metadata } from "next";
import Header from "@/components/ui/header/Header";
import Footer from "@/features/landing/Footer";
import { PrivacyPolicy } from "@/features/privacy/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Max Remy's Portfolio Website",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-16 max-sm:h-12" />
      <Header />
      <PrivacyPolicy />
      <Footer />
    </div>
  );
} 
