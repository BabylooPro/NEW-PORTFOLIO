import { useState, useEffect } from 'react';

// TYPES FOR STRAPI RESPONSE
interface StrapiResponse {
  data: {
    id: number;
    attributes: {
      greeting: string;
      description: string;
      swissArmyKnifeText: string;
      swissArmyKnifeDescription: string;
      learnMoreText: string;
      aboutMeText: string;
      audioTitle: string;
      audioDescription: string;
      audioFile: {
        data: {
          id: number;
          attributes: {
            name: string;
            url: string;
          }
        }
      };
    };
  };
  meta: Record<string, unknown>;
}

// TRANSFORMED DATA TYPE
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
          greeting: result.data.attributes.greeting,
          description: result.data.attributes.description,
          swissArmyKnifeText: result.data.attributes.swissArmyKnifeText,
          swissArmyKnifeDescription: result.data.attributes.swissArmyKnifeDescription,
          learnMoreText: result.data.attributes.learnMoreText,
          aboutMeText: result.data.attributes.aboutMeText,
          audioTitle: result.data.attributes.audioTitle,
          audioDescription: result.data.attributes.audioDescription,
          audioFile: {
            name: result.data.attributes.audioFile.data.attributes.name,
            url: result.data.attributes.audioFile.data.attributes.url
          }
        };

        setHeroData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch hero section data'));
        console.error("Failed to fetch hero section data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return { heroData, isLoading, error };
} 
