import { useQuery } from '@tanstack/react-query';

interface SoftSkillsSectionData {
  data: {
    id: number;
    title: string;
    titleDescription: string;
    softSkills: {
      id: number;
      title: string;
      icon: 'MessageSquare' | 'Users' | 'Lightbulb' | 'RefreshCw' | 'BookOpen' | 'Timer' | 'Crosshair' | 'Sparkles';
      description: string;
    }[];
  };
}

export const useSoftSkillsSection = () => {
  return useQuery<SoftSkillsSectionData>({
    queryKey: ['soft-skills-section'],
    queryFn: async () => {
      const response = await fetch('/api/strapi?path=soft-skills-section');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    }
  });
};
