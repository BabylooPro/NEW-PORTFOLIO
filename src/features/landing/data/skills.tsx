import { ReactNode } from "react";

export interface Skill {
	name: string;
	icon?: string;
	description?: string | ReactNode;
	favorite?: boolean;
	unlike?: boolean;
	star?: boolean;
	like?: boolean;
}

export interface SkillYear {
	year: string;
	skills: Skill[];
}

export const skills: SkillYear[] = [
	{
		year: "2015",
		skills: [
			{
				name: "SQF Syntax",
				description: (
					<>
						<p>Used for scripting in ARMA 3 development.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
		],
	},
	{
		year: "2016",
		skills: [
			{
				name: "C#",
				icon: "csharp",
				description: (
					<>
						<p>Used for game development and .NET applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
		],
	},
	{
		year: "2017",
		skills: [
			{
				name: "Unity",
				icon: "unity",
				description: (
					<>
						<p>A game engine used to create cross-platform games.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Blender",
				description: (
					<>
						<p>Used for 3D modeling in game development projects.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
		],
	},
	{
		year: "2018",
		skills: [
			{
				name: ".NET Framework",
				icon: "dotnetcore",
				description: (
					<>
						<p>Used for backend application development.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: ".NET Core",
				icon: "dotnetcore",
				description: (
					<>
						<p>Cross-platform framework for backend applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
		],
	},
	{
		year: "2019",
		skills: [
			{
				name: "Python",
				icon: "python",
				description: (
					<>
						<p>A versatile language used for backend development.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Django",
				icon: "django",
				description: (
					<>
						<p>Python framework used for building web applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "MySQL",
				icon: "mysql",
				description: (
					<>
						<p>Relational database used in backend projects.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "MongoDB",
				icon: "mongodb",
				description: (
					<>
						<p>NoSQL database used in modern applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Lua",
				icon: "lua",
				description: (
					<>
						<p>Scripting language used in game development.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				unlike: true,
			},
		],
	},
	{
		year: "2020",
		skills: [
			{
				name: "HTML",
				icon: "html5",
				description: (
					<>
						<p>Markup language used to build websites.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "CSS",
				icon: "css3",
				description: (
					<>
						<p>Used to style and design websites.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "JavaScript",
				icon: "javascript",
				description: (
					<>
						<p>Scripting language used to make websites interactive.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Flutter",
				icon: "flutter",
				description: (
					<>
						<p>Framework used for building cross-platform mobile apps.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Swift",
				icon: "swift",
				description: (
					<>
						<p>Programming language used for iOS app development.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
		],
	},
	{
		year: "2021",
		skills: [
			{
				name: "Node.js",
				icon: "nodejs",
				description: (
					<>
						<p>JavaScript runtime for building backend services.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Express.js",
				description: (
					<>
						<p>Minimalist web framework for Node.js applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				unlike: true,
			},
			{
				name: "React.js",
				icon: "react",
				description: (
					<>
						<p>JavaScript library used for building UI components.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Sass",
				icon: "sass",
				description: (
					<>
						<p>CSS preprocessor for writing more maintainable styles.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Figma",
				icon: "figma",
				description: (
					<>
						<p>Design tool used for creating UI/UX mockups.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
		],
	},
	{
		year: "2022",
		skills: [
			{
				name: "Git",
				icon: "git",
				description: (
					<>
						<p>Version control system used for source code management.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Sanity.io",
				icon: "sanity",
				description: (
					<>
						<p>Headless CMS used for managing content in web projects.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "ASP.NET",
				icon: "dot-net",
				description: (
					<>
						<p>Framework for building REST APIs using .NET.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Java",
				icon: "java",
				description: (
					<>
						<p>Programming language used for building cross-platform applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				unlike: true,
			},
			{
				name: "Spring Boot",
				icon: "spring",
				description: (
					<>
						<p>Java-based framework used to build microservices.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				unlike: true,
			},
		],
	},
	{
		year: "2023",
		skills: [
			{
				name: "TypeScript",
				icon: "typescript",
				description: (
					<>
						<p>Superset of JavaScript used to add static types to code.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Next.js",
				icon: "nextjs",
				description: (
					<>
						<p>React framework used for server-side rendering and static sites.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Tailwind",
				icon: "tailwindcss",
				description: (
					<>
						<p>Utility-first CSS framework used for rapid UI development.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
			{
				name: "Google Cloud Platform",
				icon: "googlecloud",
				description: (
					<>
						<p>Cloud service provider used for hosting and scaling applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Docker",
				icon: "docker",
				description: (
					<>
						<p>Tool used for containerizing and deploying applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
			{
				name: "Amazon Web Services",
				icon: "amazonwebservices",
				description: (
					<>
						<p>Cloud platform used for hosting and scaling cloud services.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
				favorite: true,
			},
		],
	},
	{
		year: "2024",
		skills: [
			{
				name: "Kubernetes",
				icon: "kubernetes",
				description: (
					<>
						<p>Platform used for orchestrating containerized applications.</p>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Advantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
						<li className="ml-4 list-disc text-sm text-neutral-500">
							Disadvantages of the skill:
							<ol className="ml-4 list-decimal text-xs">
								<li>...</li>
							</ol>
						</li>
					</>
				),
			},
		],
	},
];
