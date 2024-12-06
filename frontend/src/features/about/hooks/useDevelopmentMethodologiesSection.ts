import { useQuery } from '@tanstack/react-query';

interface DevelopmentMethodologiesSectionData {
  data: {
    id: number;
    title: string;
    titleDescription: string;
    methodologies: {
      id: number;
      title: string;
      icon: 'GitBranch' | 'Building' | 'Cog' | 'GitPullRequest' | 'Users' | 'TestTube' | 'Smartphone' | 'Server';
      description: string;
    }[];
  };
}

export const useDevelopmentMethodologiesSection = () => {
  return useQuery<DevelopmentMethodologiesSectionData>({
    queryKey: ['development-methodologies-section'],
    queryFn: async () => {
      const response = await fetch('/api/strapi?path=development-methodologies-section');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    }
  }); 
};
