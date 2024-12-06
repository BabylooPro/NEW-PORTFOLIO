import { useState, useEffect } from 'react';

// TYPES FOR STRAPI DATA
interface HeroSectionData {
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
      name: string;
      url: string;
    };
  };
  meta: {};
}

export function useHeroSection() {
  const [heroData, setHeroData] = useState<HeroSectionData['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/strapi?path=hero-section');
        const { data } = await response.json();
        setHeroData(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to fetch hero section data'));
        console.error("Failed to fetch hero section data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return { heroData, isLoading, error };
} 
