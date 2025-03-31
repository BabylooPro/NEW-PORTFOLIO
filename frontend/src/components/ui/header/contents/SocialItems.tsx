/* eslint-disable @typescript-eslint/no-explicit-any */
import { Github, Linkedin, Youtube } from "lucide-react";

const IconMap = {
    Github: <Github className="h-full w-full hover:-rotate-12 transition-all duration-300" />,
    Linkedin: <Linkedin className="h-full w-full" />,
    Youtube: <Youtube className="h-full w-full" />,
    Twitter: (
        <div className="h-full w-full hover:rotate-12 transition-all duration-300">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="fill-current h-full w-full"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        </div>
    ),
};

export const SocialItems = (socialLinks: any[]) => {
    return socialLinks.map((item, index) => ({
        id: item.id || `social-${index}`,
        title: item.title,
        icon: IconMap[item.iconType as keyof typeof IconMap],
        href: item.href,
        target: item.target,
    }));
};
