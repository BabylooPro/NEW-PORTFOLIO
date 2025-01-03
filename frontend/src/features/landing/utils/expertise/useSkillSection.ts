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

                setData({
                    title: result.data.title || "My Skills",
                    titleDescription: result.data.titleDescription || "Here are my skills and expertise",
                    paragraphDescription: result.data.paragraphDescription || "I have experience with various technologies and frameworks"
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
