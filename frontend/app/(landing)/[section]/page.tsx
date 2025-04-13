'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as React from 'react';
import { notFound } from 'next/navigation';

// LIST OF VALID SECTIONS
const validSections = ['contact', 'projects', 'skills', 'experience', 'whatido'];

// MAPPING OF ALTERNATIVE VERSIONS OF SECTIONS TO CANONICAL VERSIONS
const sectionAlternatives: Record<string, string> = {
    'project': 'projects',
    'skill': 'skills',
    'experiences': 'experience'
};

type SectionParams = {
    section: string;
};

export default function SectionPage({ params }: { params: Promise<SectionParams> }) {
    const router = useRouter();
    const { section: rawSection } = React.use(params);
    let section = rawSection;

    // CHECK IF THE SECTION IS AN ALTERNATIVE, AND CONVERT IF NECESSARY
    if (sectionAlternatives[section]) {
        section = sectionAlternatives[section];
    }

    // CHECK IF THE SECTION IS VALID
    if (!validSections.includes(section)) {
        notFound();
    }

    // SET THE SECTION IN LOCAL STORAGE
    useEffect(() => {
        const sectionKey = `scrollTo${section.charAt(0).toUpperCase() + section.slice(1)}`;
        localStorage.setItem(sectionKey, 'true');
        router.push('/');
    }, [router, section]);

    return null;
} 
