import { useQuery } from '@tanstack/react-query';
import { SectionData } from '../DevelopmentMethodologiesSection';

export const useDevelopmentMethodologiesSection = () => {
    return useQuery<SectionData>({
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
