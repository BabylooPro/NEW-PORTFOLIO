"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // SCROLL TO TOP ON PAGE LOAD/RELOAD OR ROUTE CHANGE
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
} 
