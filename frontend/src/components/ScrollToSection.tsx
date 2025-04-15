'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const ScrollToSection = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // SET IS MOUNTED TO TRUE AFTER 1 SECOND
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // SCROLL TO SECTION IF LOCAL STORAGE HAS THE SECTION KEY
    useEffect(() => {
        if (!isMounted || !resolvedTheme) return;

        // LIST OF ALL POSSIBLE SECTION KEYS
        const sections = [
            'contact',
            'projects',
            'skills',
            'experience',
            'whatido'
        ];

        let sectionToScroll = null; // SECTION TO SCROLL TO

        // CHECK IF ANY SECTION NEEDS SCROLLING
        for (const section of sections) {
            const key = `scrollTo${section.charAt(0).toUpperCase() + section.slice(1)}`;
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                sectionToScroll = section;
                break;
            }
        }

        // SCROLL TO SECTION IF IT EXISTS
        if (sectionToScroll) {
            const scrollToSection = () => {
                const element = document.getElementById(sectionToScroll);

                // SCROLL TO SECTION IF IT EXISTS
                if (element) {
                    const headerOffset = 225;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            };

            // SCROLL TO SECTION AFTER 0, 500 AND 1000 MS
            const timers = [
                setTimeout(scrollToSection, 0),
                setTimeout(scrollToSection, 500),
                setTimeout(scrollToSection, 1000)
            ];

            return () => timers.forEach(timer => clearTimeout(timer));
        }
    }, [isMounted, resolvedTheme]);

    return null;
}; 
