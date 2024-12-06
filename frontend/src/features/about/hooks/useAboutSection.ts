import { useQuery } from '@tanstack/react-query';

interface Language {
  id: number;
  name: string;
  level: string;
  description: string;
}

interface Platform {
  id: number;
  name: string;
  url: string;
}

interface AboutSectionData {
  data: {
    id: number;
    documentId: string;
    title: string;
    titleDescription: string;
    audioTitle: string;
    audioDescription: string;
    story: string;
    audioFile: {
      id: number;
      url: string;
      name: string;
    };
    personalInfo: {
      id: number;
      name: string;
      age: string;
      location: string;
      city: string;
      phone: string;
      workMode: string;
      contractType: string;
      company: string;
      email: string;
    };
    languages: {
      id: number;
      title: string;
      description: string;
      languages: Language[];
    };
    education: {
      id: number;
      title: string;
      description: string;
      platforms: Platform[];
    };
  };
  meta: any;
}

export const useAboutSection = () => {
  return useQuery<AboutSectionData>({
    queryKey: ['about-section'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/strapi?path=about-section');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Failed to fetch about section data');
      }
    }
  });
};
