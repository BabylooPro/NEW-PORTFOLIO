// VIDEO DATA TYPES
export interface Video {
    id: string;
    title: string;
    project?: string;
    src: string;
    recap?: string;
    description: string;
    date?: string;
}

// FLAT VIDEO DATA
export const allVideos: Video[] = [
    {
        id: "backend",
        title: "Backend Development",
        project: "ContactForm.csharp",
        src: "/assets/videos/timelapse_2.mov",
        recap: "added: api versioning support with middleware and unit test",
        description: "C#, ASP.NET, API Versioning",
        date: "2025-04-12"
    },
    {
        id: "software",
        title: "Software Development",
        project: "KeyPops",
        src: "/assets/videos/timelapse_1.mp4",
        recap: "added: new support API route for handling contact form submissions",
        description: "React.js, Next.js, TypeScript",
        date: "2025-04-06"
    },
]; 
