import { useQuery } from '@tanstack/react-query';
import { SectionData } from '../SoftSkillsSection';

export const useSoftSkillsSection = () => {
    return useQuery<SectionData>({
        queryKey: ['soft-skills-section'],
        queryFn: async () => {
            const response = await fetch('/api/strapi?path=soft-skills-section');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        },
        retry: 1,
        staleTime: 60 * 1000, // 1 MINUTE
    });
};
