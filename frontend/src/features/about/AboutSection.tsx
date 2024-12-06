"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSkills } from "@/features/landing/utils/expertise/useSkills";
import "devicon";
import {
	UserRound,
	Calendar,
	Flag,
	MapPin,
	Phone,
	Briefcase,
	FileText,
	Building,
	Mail,
	CodeXml,
	Heart,
	Languages,
	GraduationCap,
} from "lucide-react";
import AudioReader from "@/components/ui/AudioReader";
import { FavoriteSkillsSkeleton } from "@/features/landing/utils/expertise/FavoriteSkillsSkeleton";
import { useAboutSection } from './hooks/useAboutSection';
import { Skeleton } from "@/components/ui/skeleton";

const AboutSectionSkeleton: React.FC<{
	status?: 'loading' | 'error' | 'no-data';
}> = ({ status }) => {
	const getStatusContent = () => {
		switch (status) {
			case 'error':
				return (
					<div className="flex items-center gap-2 text-red-500">
						<Skeleton className="h-8 w-8 bg-red-200" />
						<span>Error loading about section. Please try again later.</span>
					</div>
				);
			case 'no-data':
				return (
					<div className="flex items-center gap-2 text-yellow-500">
						<Skeleton className="h-8 w-8 bg-yellow-200" />
						<span>No data available at the moment.</span>
					</div>
				);
			default:
				return <Skeleton className="h-8 w-8" />;
		}
	};

	return (
		<Section>
			<div className="space-y-4">
				{/* TITLE WITH STATUS */}
				<div className="flex items-center justify-between">
					<h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4 justify-between">
						<div className="flex items-center gap-2">
							About me
							<ShowInfo
								title="About me"
							/>
						</div>
					</h2>
					{getStatusContent()}
				</div>

				{/* INFO GRID SKELETON */}
				<div className="grid md:grid-cols-2 gap-4">
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center gap-2">
								<Skeleton className="h-6 w-6" />
								<Skeleton className="h-6 w-32" />
							</div>
						))}
					</div>
					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex items-center gap-2">
								<Skeleton className="h-6 w-6" />
								<Skeleton className="h-6 w-48" />
							</div>
						))}
					</div>
				</div>

				<Separator className="h-1 my-4" />

				{/* STORY SKELETON */}
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<Skeleton key={i} className="h-4 w-full" />
					))}
				</div>

				<Separator className="h-1 my-4" />

				{/* LANGUAGES & EDUCATION SKELETON */}
				<div className="grid md:grid-cols-3 gap-4">
					<div className="md:col-span-2 space-y-4">
						<Skeleton className="h-6 w-32" />
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className="h-4 w-48" />
						))}
					</div>
					<div className="space-y-4">
						<Skeleton className="h-6 w-32" />
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className="h-4 w-36" />
						))}
					</div>
				</div>

				<Separator className="h-1 my-4" />

				{/* FAVORITE SKILLS SKELETON */}
				<div className="space-y-4">
					<Skeleton className="h-6 w-40" />
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="flex items-center gap-2">
								<Skeleton className="h-8 w-8" />
								<Skeleton className="h-8 w-24" />
							</div>
						))}
					</div>
				</div>
			</div>
		</Section>
	);
};

const AboutSection: React.FC = () => {
	const { data: aboutData, isLoading, error } = useAboutSection();
	const { skills, loading: skillsLoading } = useSkills();

	const calculateAge = () => {
		if (!aboutData?.data?.personalInfo?.age) return 0;
		const birthDate = new Date(aboutData.data.personalInfo.age);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	if (isLoading || skillsLoading) {
		return <AboutSectionSkeleton status="loading" />;
	}

	if (error) {
		return <AboutSectionSkeleton status="error" />;
	}

	if (!aboutData?.data) {
		return <AboutSectionSkeleton status="no-data" />;
	}

	const { data } = aboutData;

	return (
		<Section>
			<h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-4 justify-between">
				<div className="flex items-center gap-2">
					{data.title ?? "About me"}
					<ShowInfo
						title={data.title ?? "About me"}
						description={data.titleDescription}
					/>
				</div>
				<ShowInfo wrapMode>
					<ShowInfo.Title>{data.audioTitle}</ShowInfo.Title>
					<ShowInfo.Description>{data.audioDescription}</ShowInfo.Description>
					<ShowInfo.Content>
						<AudioReader src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.audioFile.url}`} />
					</ShowInfo.Content>
				</ShowInfo>
			</h2>

			{/* MY INFO */}
			<div className="space-y-4">
				<div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-x-8 text-base md:text-xl text-neutral-800 dark:text-neutral-200">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<UserRound strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								{data.personalInfo.name}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								{calculateAge()} years old
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Flag strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								{data.personalInfo.location}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								{data.personalInfo.city}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Phone strokeWidth={3} className="w-6 h-6" />
							<a
								className="text-neutral-500 dark:text-neutral-400"
								href={`tel:${data.personalInfo.phone}`}
							>
								{data.personalInfo.phone}
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-2 md:justify-self-end">
						<div className="flex items-center gap-2">
							<Briefcase strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								<strong>On-site or Remote : </strong>{data.personalInfo.workMode}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<FileText strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								<strong>Contract : </strong>{data.personalInfo.contractType}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Building strokeWidth={3} className="w-6 h-6" />
							<span className="text-neutral-500 dark:text-neutral-400">
								<strong>Company Individual : </strong>{data.personalInfo.company}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Mail strokeWidth={3} className="w-6 h-6" />
							<a
								className="text-neutral-500 dark:text-neutral-400"
								href={`mailto:${data.personalInfo.email}`}
							>
								{data.personalInfo.email}
							</a>
						</div>
					</div>
				</div>

				<Separator className="h-1 my-4" />

				{/* MY STORY */}
				<div className="text-base md:text-xl space-y-4 text-neutral-700 dark:text-neutral-300">
					{data.story.split('\n\n').map((paragraph: string, index: number) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>

				<Separator className="h-1 my-4" />

				{/* LANGUAGE AND EDUCATION */}
				<div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-x-8 text-base md:text-xl text-neutral-800 dark:text-neutral-200">
					<div className="md:col-span-2">
						<h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
							{data.languages.title}
							<ShowInfo
								title={data.languages.title}
								description={data.languages.description}
								icon={<Languages className="w-5 h-5" />}
							/>
						</h3>
						<ul className="list-disc list-inside space-y-1">
							{data.languages.languages.map((lang) => (
								<li key={lang.id}>
									{lang.name} : {lang.level}{" "}
									<span className="text-neutral-500">| {lang.description}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="md:justify-self-end">
						<h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
							{data.education.title}
							<ShowInfo
								title={data.education.title}
								description={data.education.description}
								icon={<GraduationCap className="w-5 h-5" />}
							/>
						</h3>
						<ul className="list-disc list-inside space-y-1">
							{data.education.platforms.map((platform) => (
								<li key={platform.id}>
									<Link
										href={platform.url}
										target="_blank"
										className="hover:text-neutral-400 dark:hover:text-neutral-600"
									>
										{platform.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="h-1 my-4" />

				{/* MY FAVORITE SKILLS */}
				<div>
					<h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
						My Favorite Skills
						<ShowInfo
							title="My Favorite Skills"
							description="Here's a look at my favorite code skills"
							icon={<Heart className="w-5 h-5" />}
							iconFill
						/>
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:grid-rows-4 md:grid-flow-col">
						{skillsLoading ? (
							<FavoriteSkillsSkeleton />
						) : (
							skills
								.flatMap((yearSkills) =>
									yearSkills.skills.filter((skill) => skill.favorite)
								)
								.map((skill) => (
									<ShowInfo wrapMode key={skill.id}>
										<ShowInfo.Content>
											<div className="flex items-center space-x-2">
												{skill.icon ? (
													<i
														className={`devicon-${skill.icon}-plain text-neutral-700 dark:text-neutral-300 text-2xl`}
													/>
												) : (
													<CodeXml size={24} />
												)}
												<span className="text-neutral-700 dark:text-neutral-300">
													{skill.name}
												</span>
											</div>
										</ShowInfo.Content>
										<ShowInfo.Title>{skill.name}</ShowInfo.Title>
										<ShowInfo.Description>
											{skill.description ?? "Description not available"}
										</ShowInfo.Description>
									</ShowInfo>
								))
						)}
					</div>
				</div>
			</div>
		</Section>
	);
};

export default AboutSection;
