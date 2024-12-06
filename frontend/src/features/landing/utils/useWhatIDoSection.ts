import { useQuery } from "@tanstack/react-query";

interface WhatIDoSectionData {
  id: number;
  documentId: string;
  title: string;
  titleDescription: string;
  paragraphDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse {
  data: {
    id: number;
    documentId: string;
    title: string;
    titleDescription: string;
    paragraphDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export const useWhatIDoSection = () => {
  return useQuery({
    queryKey: ["whatIDoSection"],
    queryFn: async (): Promise<WhatIDoSectionData> => {
      const response = await fetch("/api/strapi?path=what-i-do-section");
      const { data } = await response.json() as StrapiResponse;
      
      if (!data) {
        throw new Error("No data returned from API");
      }
      
      return data;
    },
  });
}; 
