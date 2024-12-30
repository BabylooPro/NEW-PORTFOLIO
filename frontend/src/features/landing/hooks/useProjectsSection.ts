import { useQuery } from "@tanstack/react-query";

export interface LiveProject {
    name: string;
    notes?: string;
    url: string;
    isOnline: boolean;
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

interface LiveProjectsResponse {
    data: Array<{
        id: number;
        attributes: {
            name: string;
            url: string;
            status: string;
            notes: string | null;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
        }
    }>
}

// DEFAULT STATE
const DEFAULT_STATE: ProjectsSectionData = {
    title: '',
    titleDescription: '',
    mainTechnologies: [],
    liveProjects: []
};

// VALIDATE STRAPI RESPONSE
const isValidStrapiResponse = (response: any): response is StrapiResponse => {
    return response?.data?.title !== undefined &&
        response?.data?.titleDescription !== undefined &&
        response?.data?.mainTechnologies !== undefined;
};

const isValidLiveProjectsResponse = (response: any): response is LiveProjectsResponse => {
    return Array.isArray(response?.data) && response.data.every((project: any) =>
        project?.attributes?.name !== undefined &&
        project?.attributes?.url !== undefined &&
        project?.attributes?.status !== undefined
    );
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
                console.log('Section Response:', sectionData);

                // VALIDATE THE RESPONSE
                if (!isValidStrapiResponse(sectionData)) {
                    throw new Error('Invalid section data format');
                }

                // THEN TRY TO FETCH LIVE PROJECTS
                let liveProjects: LiveProject[] = [];
                try {
                    const liveProjectsRes = await fetch("/api/strapi?path=live-projects"); // FETCH LIVE PROJECTS

                    // VALIDATE RESPONSE
                    if (liveProjectsRes.ok) {
                        const liveProjectsResponse = await liveProjectsRes.json();
                        console.log('Live Projects Raw Response:', liveProjectsResponse);
                        console.log('Response type:', typeof liveProjectsResponse);
                        console.log('Has data property:', 'data' in liveProjectsResponse);

                        // CHECK IF THE RESPONSE HAS DATA
                        if (!liveProjectsResponse?.data) {
                            console.warn('No data in response');
                            liveProjects = [];
                        } else {
                            // CHECK IF RESPONSE IS AN ARRAY
                            const projectsData = Array.isArray(liveProjectsResponse.data)
                                ? liveProjectsResponse.data
                                : [liveProjectsResponse.data];

                            console.log('Projects data array:', projectsData);

                            // FILTER PROJECTS
                            liveProjects = projectsData
                                .filter((project: any) => {
                                    const isPublished = !!project?.publishedAt;
                                    console.log('Project published status:', project?.name, isPublished);
                                    return isPublished;
                                })
                                .map((project: any) => {
                                    console.log('Processing project:', project);
                                    return {
                                        name: project.name,
                                        url: project.url,
                                        isOnline: project.isOnline,
                                        notes: project.notes || undefined,
                                        technologies: project.technologies || [],
                                        deployDate: project.deployDate
                                    };
                                });
                        }
                        console.log('Final processed live projects:', liveProjects);
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

                // COMBINE DATA
                const result = {
                    title: sectionData.data.title,
                    titleDescription: sectionData.data.titleDescription,
                    mainTechnologies,
                    liveProjects,
                } as ProjectsSectionData;

                console.log('Final Result:', result);

                // RETURN RESULT
                return result;
            } catch (error) {
                console.error('Error in useProjectsSection:', error);
                return DEFAULT_STATE;
            }
        },
    });
};
