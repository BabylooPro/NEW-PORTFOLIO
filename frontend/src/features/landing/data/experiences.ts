import type { ExperienceItemProps } from "../utils/expertise/experienceItem";

export const experiences: ExperienceItemProps[] = [
    {
        title: "Software Engineer",
        company: "MUUM App",
        date: { start: { year: 2025, month: 5 }, end: null },
        description: {
            items: [],
        },
        location: "Vaud, Switzerland",
        skills: ["Swift", "SwiftUI", "Apple Watch", "Garmin", "Next.js", "TypeScript"],
    },
    {
        title: "Independent Developer",
        company: "Max Remy Dev",
        date: { start: { year: 2023, month: 3 }, end: null },
        description: {
            items: [
                "Operation of a consulting and company for web, mobile applications and software development",
                "Services in the field of IT and software development",
                "Design, production, and trade of IT solutions",
            ],
        },
        location: "Vaud, Switzerland",
        skills: [
            "Software Development",
            "Application Development",
            "Web Development",
            "DevOps Development",
            "Consulting",
            "IT Solutions",
        ],
    },
    {
        title: "Software Developer",
        company: "Confidential",
        date: { start: { year: 2024, month: 9 }, end: { year: 2025, month: 2 } },
        description: {
            items: [
                "Develop a complex application from scratch in Microservices architecture",
            ],
        },
        skills: ["C#", "ASP.NET", "MAUI", "Razor", "Docker", "Grafana", "Prometheus"],
    },
    {
        title: "Frontend Developer",
        company: "New Tells Studio",
        date: { start: { year: 2024, month: 9 }, end: { year: 2024, month: 12 } },
        description: {
            items: [
                "Development of an interactive portfolio website for a motion design company",
                "Implementation of smooth animations with Rive",
                "Integration of the design from Figma mockups, ensuring visual fidelity and responsive optimization",
            ],
        },
        location: "Vaud, Switzerland",
        skills: ["Next.js", "TypeScript", "Tailwind CSS", "Rive"],
    },
    {
        title: "FullStack Developer - Digital Asset Trading Platform",
        date: { start: { year: 2024, month: 3 }, end: { year: 2024, month: 4 } },
        description: {
            items: [
                "Starting a social media digital object exchange project and deciding on its technical and design elements",
                "Creation of design model and logo with Figma and Frontend solution with Flutter",
                "Creating a secure and fast Backend solution with ASP.NET Core MVC in C# and MongoDB database",
                "Added blockchain security for safety and transparency",
            ],
        },
        skills: ["Flutter", "ASP.NET Core", "C#", "MongoDB", "Figma", "Blockchain"],
    },
    {
        title: "Database Problem Resolution",
        company: "Mission from Codeur.com",
        date: { start: { year: 2023, month: 9 } },
        description: {
            items: [
                "Resolution of MySQL technical issues via Python Django Backend",
                "Restoration of new data addition to database",
            ],
        },
        skills: ["Python", "Django", "MySQL"],
    },
    {
        title: "Flutter Frontend Developer",
        company: "Young Evio",
        date: { start: { year: 2023, month: 8 } },
        description: {
            items: [
                "Analysis of design mockup & architecture conception",
                "Development of interfaces with Flutter & integration of libraries and plugins",
                "Writing unit tests & performance optimization",
                "Collaboration with Backend developers, documentation, and code maintenance",
            ],
        },
        skills: ["Flutter", "Unit Testing"],
    },
    {
        title: "Fullstack Developer - Integration of Stripe Connect",
        date: { start: { year: 2023, month: 8 } },
        description: {
            items: [
                "Integration of the Stripe Connect payment solution",
                "Configuration and testing of payment to ensure a secure transaction",
            ],
        },
        skills: ["React.js", "Stripe Connect"],
    },
    {
        title: "Database migration from MySQL to MongoDB",
        company: "GameMediatiK",
        date: { start: { year: 2023, month: 7 } },
        description: {
            items: [
                "Evaluation of existing MongoDB structure & design of a relational schema for MySQL",
                "Development of Python scripts for data transfer & strategy, optimization for MySQL",
                "Rigorous testing to ensure data integrity & adaptation of Next.js Frontend components",
                "Writing documentation about the migration process",
            ],
        },
        skills: ["Next.js", "MongoDB", "MySQL", "Python"],
    },
    {
        title: "Backend Developer & Frontend Integration",
        company: "TetaSofter",
        date: { start: { year: 2023, month: 4 }, end: { year: 2023, month: 5 } },
        description: {
            items: [
                "Backend development using Java with Spring Boot",
                "Setting up databases with MySQL & integrating APIs into React components",
                "Writing unit and integration tests & documenting developed solutions",
            ],
        },
        location: "Genève, Switzerland",
        skills: ["Java", "Spring Boot", "MySQL", "React", "API Integration"],
    },
    {
        title: "Backend Developer - E-learning Platform",
        date: { start: { year: 2022, month: 11 }, end: { year: 2022, month: 12 } },
        description: {
            items: [
                "Debugging of the Backend solution in ASP.NET Web API",
                "Implementation of databases and integration of external APIs via MySQL",
            ],
        },
        skills: ["ASP.NET", "Web API", "MySQL", "API Integration"],
    },
    {
        title: "Unity Developer - Mini-Game Mobile Platform",
        date: { start: { year: 2022, month: 5 }, end: { year: 2022, month: 7 } },
        description: {
            items: ["Creation of a mini platform game with Unity and Blender"],
        },
        skills: ["Unity", "Blender", "C#"],
    },
    {
        title: "Backend Developer - Cleaning Services Booking Website",
        date: { start: { year: 2022, month: 3 } },
        description: {
            items: [
                "Backend development in Java with Spring Boot",
                "Implementation and management of a MySQL database",
            ],
        },
        skills: ["Java", "Spring Boot", "MySQL"],
    },
    {
        title: "Mobile Developer - Flutter Fitness Application",
        date: { start: { year: 2021, month: 10 }, end: { year: 2021, month: 12 } },
        description: {
            items: ["Development of a mobile application in Flutter"],
        },
        skills: ["Flutter", "Dart"],
    },
    {
        title: "MERN Developer - Project Management Platform",
        date: { start: { year: 2021, month: 4 }, end: { year: 2021, month: 8 } },
        description: {
            items: [
                "Design and development of a project management platform",
                "Frontend development with React.js and Express.js for the backend",
                "Integration of a MongoDB database",
            ],
        },
        skills: ["React.js", "Express.js", "MongoDB", "Node.js"],
    },
    {
        title: "Backend Developer - Mobile Finance Management Application",
        date: { start: { year: 2021, month: 1 } },
        description: {
            items: [
                "Development of APIs in Node.js with Express.js & implementation of a MongoDB database",
            ],
        },
        skills: ["Node.js", "Express.js", "MongoDB", "API Development"],
    },
    {
        title: "Python Developer - Internal Task Automation",
        date: { start: { year: 2020, month: 6 }, end: { year: 2020, month: 8 } },
        description: {
            items: [
                "Development of automation scripts with Selenium WebDriver",
                "Implementation and maintenance of an automated testing framework",
                "Training for the client team on its use",
            ],
        },
        skills: ["Python", "Selenium", "Test Automation"],
    },
    {
        title: "Small-Scale Services",
        date: { start: { year: 2017 }, end: { year: 2020 } },
        description: {
            items: [
                "Creation of solutions for video game development",
                "Modding, design of 3D models",
                "Creation of service automation software",
                "Database debugging and web development for clients",
            ],
        },
        skills: ["Game Development", "3D Modeling", "Automation", "Web Development"],
    },
];
