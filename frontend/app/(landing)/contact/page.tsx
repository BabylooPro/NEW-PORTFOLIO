'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ContactPage() {
    const router = useRouter();

    useEffect(() => {
        localStorage.setItem('scrollToContact', 'true');
        router.push('/');
    }, [router]);

    return null;
}
