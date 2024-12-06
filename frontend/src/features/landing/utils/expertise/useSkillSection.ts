import { useEffect, useState } from "react";

interface SkillSectionData {
  title: string;
  titleDescription: string;
  paragraphDescription: string;
}

interface StrapiResponse {
  data: {
    id: number;
    documentId: string;
    title: string;
    titleDescription: string;
    paragraphDescription: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
  };
}

export const useSkillSection = () => {
  const [data, setData] = useState<SkillSectionData>({
    title: "",
    titleDescription: "",
    paragraphDescription: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillSection = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/strapi?path=skill-section');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json() as StrapiResponse;
        
        if (!result?.data) {
          throw new Error('No data received from API');
        }

        if (!result.data.publishedAt) {
          throw new Error('Skill section is not published');
        }

        setData({
          title: result.data.title,
          titleDescription: result.data.titleDescription,
          paragraphDescription: result.data.paragraphDescription || ""
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching skill section:', err);
        setError(err instanceof Error ? err.message : 'Failed to load skill section');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillSection();
  }, []);

  return {
    ...data,
    loading,
    error
  };
}; 
