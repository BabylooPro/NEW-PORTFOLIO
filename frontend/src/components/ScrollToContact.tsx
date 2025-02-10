'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const ScrollToContact = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isMounted || !resolvedTheme) return;

        const shouldScroll = localStorage.getItem('scrollToContact');
        if (shouldScroll) {
            localStorage.removeItem('scrollToContact');

            const scrollToContact = () => {
                const element = document.getElementById('contact');
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

            const timers = [
                setTimeout(scrollToContact, 0),
                setTimeout(scrollToContact, 500),
                setTimeout(scrollToContact, 1000)
            ];

            return () => timers.forEach(timer => clearTimeout(timer));
        }
    }, [isMounted, resolvedTheme]);

    return null;
};
