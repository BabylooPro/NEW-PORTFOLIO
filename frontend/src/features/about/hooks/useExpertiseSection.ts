import { useQuery } from '@tanstack/react-query';

interface ExpertiseSectionData {
  data: {
    id: number;
    title: string;
    titleDescription: string;
    expertises: {
      id: number;
      title: string;
      icon: 'Code' | 'Server' | 'Palette' | 'Layers' | 'Cog';
      description: string;
      skillIdentifier: string;
    }[];
  };
}

export const useExpertiseSection = () => {
  return useQuery<ExpertiseSectionData>({
    queryKey: ['expertise-section'],
    queryFn: async () => {
      const response = await fetch('/api/strapi?path=expertise-section');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    }
  }); 
};
