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
			scrollHeight="h-[355px]"
		/>
	);
};

export default SkillSection;
