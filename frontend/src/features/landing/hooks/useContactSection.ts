import { useQuery } from "@tanstack/react-query";

interface ContactSectionData {
  title: string;
  titleDescription: string;
  paragraphDescription: string;
}

interface StrapiResponse {
  data: ContactSectionData & {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export const useContactSection = () => {
  return useQuery({
    queryKey: ["contact-section"],
    queryFn: async (): Promise<ContactSectionData | null> => {
      try {
        const response = await fetch("/api/strapi?path=contact-section");
        if (!response.ok) {
          throw new Error("Failed to fetch contact section data");
        }
        const json = await response.json() as StrapiResponse;
        
        // EXTRACT ONLY FIELDS NEEDED
        const { title, titleDescription, paragraphDescription } = json.data;
        return { title, titleDescription, paragraphDescription };
      } catch (error) {
        console.error("Error fetching contact section:", error);
        return null;
      }
    }
  });
}; 
