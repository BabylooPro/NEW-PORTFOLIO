"use client";

import React from "react";
import { experiences } from "./data/experiences";
import UseExpertise from "./utils/useExpertise";

const ExperienceSection: React.FC = () => {
	return (
		<UseExpertise
			title="Experience"
			items={experiences}
			showCompany={true}
			showSkills={true}
			scrollHeight="h-[400px]"
		/>
	);
};

export default ExperienceSection;
