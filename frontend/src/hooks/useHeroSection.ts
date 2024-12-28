import { useState, useEffect } from 'react';

// TYPES FOR STRAPI RESPONSE
interface StrapiResponse {
    data: {
        id: number;
        documentId: string;
        greeting: string;
        description: string;
        swissArmyKnifeText: string;
        swissArmyKnifeDescription: string;
        learnMoreText: string;
        aboutMeText: string;
        audioTitle: string;
        audioDescription: string;
        audioFile: {
            id: number;
            documentId: string;
            name: string;
            url: string;
            mime: string;
            hash: string;
            ext: string;
            size: number;
        };
    };
    meta: Record<string, unknown>;
}

// TRANSFORMED DATA TYPE FOR COMPONENT
interface HeroData {
    greeting: string;
    description: string;
    swissArmyKnifeText: string;
    swissArmyKnifeDescription: string;
    learnMoreText: string;
    aboutMeText: string;
    audioTitle: string;
    audioDescription: string;
    audioFile: {
        name: string;
        url: string;
    };
}

export function useHeroSection() {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch('/api/strapi?path=hero-section');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result: StrapiResponse = await response.json();

                // TRANSFORM THE DATA
                const transformedData: HeroData = {
                    greeting: result.data.greeting,
                    description: result.data.description,
                    swissArmyKnifeText: result.data.swissArmyKnifeText,
                    swissArmyKnifeDescription: result.data.swissArmyKnifeDescription,
                    learnMoreText: result.data.learnMoreText,
                    aboutMeText: result.data.aboutMeText,
                    audioTitle: result.data.audioTitle,
                    audioDescription: result.data.audioDescription,
                    audioFile: {
                        name: result.data.audioFile.name,
                        url: result.data.audioFile.url
                    }
                };

                setHeroData(transformedData);
            } catch (err) {
                console.error("Raw error:", err);
                setError(err instanceof Error ? err : new Error('Failed to fetch hero section data'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    return { heroData, isLoading, error };
} 
