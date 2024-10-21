"use client";

import React from "react";
import { experiences } from "./data/experiences";
import UseExpertise from "./utils/expertise/useExpertise";

const ExperienceSection: React.FC = () => {
	return (
		<UseExpertise
			title="My Experience"
			items={experiences}
			showCompany={true}
			showSkills={true}
			scrollHeight="h-[400px]"
		/>
	);
};

export default ExperienceSection;
