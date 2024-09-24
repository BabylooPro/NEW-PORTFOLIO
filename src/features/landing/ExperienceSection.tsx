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
			infoMode="toast"
			infoTooltipText="Information about the experience"
			infoToastTitle="Experience"
			infoToastDescription="Information about the experience"
			infoPosition="top"
			infoIconSize={16}
			infoClassName="ml-2"
		/>
	);
};

export default ExperienceSection;
