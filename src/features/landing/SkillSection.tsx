"use client";

import React from "react";
import { skills } from "./data/skills";
import UseExpertise from "./utils/useExpertise";

const SkillSection: React.FC = () => {
	return (
		<UseExpertise
			title="Skills"
			items={skills}
			showCompany={false}
			showSkills={true}
			scrollHeight="h-[300px]"
			infoMode="tooltip"
			infoTooltipText="Information about the skill"
			infoPosition="top"
			infoIconSize={16}
			infoClassName="ml-2"
		/>
	);
};

export default SkillSection;
