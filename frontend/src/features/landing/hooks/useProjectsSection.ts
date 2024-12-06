import { useQuery } from "@tanstack/react-query";

interface ProjectsSectionData {
  title: string;
  titleDescription: string;
  mainTechnologies: string[];
}

interface StrapiResponse {
  data: {
    id: number;
    documentId: string;
    title: string;
    titleDescription: string;
    mainTechnologies: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
}

export const useProjectsSection = () => {
  return useQuery({
    queryKey: ["projects-section"],
    queryFn: async () => {
      const res = await fetch("/api/strapi?path=projects-section");
      const { data } = await res.json() as StrapiResponse;
      
      const mainTechnologies = data.mainTechnologies 
        ? data.mainTechnologies.split(",").map((tech: string) => tech.trim())
        : [];

      return {
        title: data.title,
        titleDescription: data.titleDescription,
        mainTechnologies,
      } as ProjectsSectionData;
    },
  });
};
