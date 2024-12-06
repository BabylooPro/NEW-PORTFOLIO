"use client";

import React from "react";
import { experiences } from "./data/experiences";
import UseExpertise from "./utils/expertise/useExpertise";
import { useExperienceSection } from "./utils/expertise/useExperienceSection";

const ExperienceSection: React.FC = () => {
	const { title, titleDescription, paragraphDescription, loading } = useExperienceSection();

	return (
		<UseExpertise
			title={title}
			titleDescription={titleDescription}
			paragraphDescription={paragraphDescription}
			items={experiences}
			showCompany={true}
			showSkills={true}
			scrollHeight="h-[400px]"
			loading={loading}
		/>
	);
};

export default ExperienceSection;
