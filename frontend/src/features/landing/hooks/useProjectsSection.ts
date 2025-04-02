import { useQuery } from "@tanstack/react-query";

export interface LiveProject {
    name: string;
    notes?: string;
    url: string;
    isOnline: boolean;
    isWip?: boolean;
    technologies?: string[];
    deployDate?: string;
}

interface ProjectsSectionData {
    title: string;
    titleDescription: string;
    mainTechnologies: string[];
    liveProjects: LiveProject[];
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

interface StrapiProject {
    id: number;
    publishedAt: string | null;
    name: string;
    url: string;
    isOnline: boolean;
    isWip?: boolean;
    notes?: string;
    technologies?: string[];
    deployDate?: string;
}

// DEFAULT STATE
const DEFAULT_STATE: ProjectsSectionData = {
    title: '',
    titleDescription: '',
    mainTechnologies: [],
    liveProjects: []
};

// VALIDATE STRAPI RESPONSE
const isValidStrapiResponse = (response: unknown): response is StrapiResponse => {
    if (!response || typeof response !== 'object') return false;
    const typedResponse = response as Record<string, unknown>;
    if (!typedResponse.data || typeof typedResponse.data !== 'object') return false;
    const data = typedResponse.data as Record<string, unknown>;
    return typeof data.title === 'string' &&
        typeof data.titleDescription === 'string' &&
        typeof data.mainTechnologies === 'string';
};

export const useProjectsSection = () => {
    return useQuery({
        queryKey: ["projects-section"],
        queryFn: async () => {
            try {
                // FIRST FETCH THE SECTION DATA
                const sectionRes = await fetch("/api/strapi?path=projects-section");
                if (!sectionRes.ok) {
                    throw new Error('Failed to fetch projects section data');
                }

                // PARSE THE RESPONSE
                const sectionData = await sectionRes.json();

                // VALIDATE THE RESPONSE
                if (!isValidStrapiResponse(sectionData)) {
                    throw new Error('Invalid section data format');
                }

                // THEN TRY TO FETCH LIVE PROJECTS
                let liveProjects: LiveProject[] = [];
                try {
                    const liveProjectsRes = await fetch("/api/strapi?path=live-projects");

                    // VALIDATE RESPONSE
                    if (liveProjectsRes.ok) {
                        const liveProjectsResponse = await liveProjectsRes.json();

                        // CHECK IF THE RESPONSE HAS DATA
                        if (!liveProjectsResponse?.data) {
                            console.warn('No data in response');
                            liveProjects = [];
                        } else {
                            // CHECK IF RESPONSE IS AN ARRAY
                            const projectsData = Array.isArray(liveProjectsResponse.data)
                                ? liveProjectsResponse.data
                                : [liveProjectsResponse.data];

                            // FILTER PROJECTS
                            liveProjects = projectsData
                                .filter((project: StrapiProject) => !!project?.publishedAt)
                                .map((project: StrapiProject) => ({
                                    name: project.name,
                                    url: project.url,
                                    isOnline: project.isOnline,
                                    isWip: project.isWip,
                                    notes: project.notes,
                                    technologies: project.technologies,
                                    deployDate: project.deployDate
                                }));
                        }
                    } else {
                        console.warn('Failed to fetch live projects:', liveProjectsRes.statusText);
                    }
                } catch (error) {
                    console.warn('Failed to fetch live projects:', error);
                }

                // PARSE MAIN TECHNOLOGIES
                const mainTechnologies = sectionData.data.mainTechnologies
                    ? sectionData.data.mainTechnologies.split(",").map((tech: string) => tech.trim())
                    : [];

                return {
                    title: sectionData.data.title,
                    titleDescription: sectionData.data.titleDescription,
                    mainTechnologies,
                    liveProjects,
                } as ProjectsSectionData;
            } catch (error) {
                console.error('Error in useProjectsSection:', error);
                return DEFAULT_STATE;
            }
        },
    });
};
