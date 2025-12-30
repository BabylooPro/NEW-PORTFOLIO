"use client";

import { CodeXml } from "lucide-react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import React from "react";
import { ShowInfo } from "@/components/ui/show-info";
// import { FeedbackRating } from "@/components/ui/feedback-badge";
// import { VisitorCounter } from "@/components/ui/visitor-counter";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    // const pathname = usePathname();

    return (
        <footer className="py-8 sm:py-12 md:py-16 flex flex-col justify-center items-center space-y-4">
            {/* <div className="flex flex-col items-center space-y-4 mb-8">
                {pathname === "/" && (
                    <>
                        <FeedbackRating />
                        <VisitorCounter />
                    </>
                )}
            </div> */}

            <div className="flex items-center space-x-2 text-center">
                <ShowInfo wrapMode>
                    <ShowInfo.Title>Terms of Use</ShowInfo.Title>
                    <ShowInfo.Description>
                        Click to read the terms of use
                    </ShowInfo.Description>
                    <ShowInfo.Content>
                        <Link href="/terms">
                            <span className="text-xs sm:text-sm md:text-base font-bold">
                                &copy; {currentYear} MAX REMY DEV
                            </span>
                        </Link>
                    </ShowInfo.Content>
                </ShowInfo>

                <CodeXml className="w-6 h-6 sm:w-8 sm:h-8" />

                <ShowInfo wrapMode>
                    <ShowInfo.Title>Privacy Policy</ShowInfo.Title>
                    <ShowInfo.Description>
                        Click to read our privacy policy
                    </ShowInfo.Description>
                    <ShowInfo.Content>
                        <Link href="/privacy">
                            <span className="text-xs sm:text-sm md:text-base font-bold">
                                ALL RIGHTS RESERVED
                            </span>
                        </Link>
                    </ShowInfo.Content>
                </ShowInfo>
            </div>
        </footer>
    );
};

export default Footer;
