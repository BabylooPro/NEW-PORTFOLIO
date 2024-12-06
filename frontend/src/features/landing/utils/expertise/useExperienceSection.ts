import { useQuery } from "@tanstack/react-query";

interface ExperienceSection {
  data: {
    id: number;
    title: string;
    titleDescription: string;
    paragraphDescription: string;
}
}

export const useExperienceSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["experienceSection"],
    queryFn: async () => {
      const response = await fetch("/api/strapi?path=experience-section");
      if (!response.ok) {
        throw new Error("Failed to fetch experience section");
      }
      return response.json() as Promise<ExperienceSection>;
    },
  });

  return {
    title: data?.data?.title ?? "My Experience",
    titleDescription: data?.data?.titleDescription ?? "",
    paragraphDescription: data?.data?.paragraphDescription ?? "",
    loading: isLoading,
  };
}; 
