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

                // CHECK IF DATA EXISTS AND IS PUBLISHED
                if (!result?.data) {
                    throw new Error('No data received from API');
                }

                // TRANSFORM THE DATA EVEN IF NOT PUBLISHED
                const transformedData: HeroData = {
                    greeting: result.data.greeting || "Hello,",
                    description: result.data.description || "Welcome to my portfolio",
                    swissArmyKnifeText: result.data.swissArmyKnifeText || "Swiss Army Knife",
                    swissArmyKnifeDescription: result.data.swissArmyKnifeDescription || "for any development needs.",
                    learnMoreText: result.data.learnMoreText || "Learn more",
                    aboutMeText: result.data.aboutMeText || "about me.",
                    audioTitle: result.data.audioTitle || "Audio version",
                    audioDescription: result.data.audioDescription || "Listen to my resume",
                    audioFile: result.data.audioFile ? {
                        name: result.data.audioFile.name,
                        url: result.data.audioFile.url
                    } : {
                        name: "default.mp3",
                        url: "/default.mp3"
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
