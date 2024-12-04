"use client";

import React from "react";
import { skills } from "./data/skills";
import UseExpertise from "./utils/expertise/useExpertise";

const SkillSection: React.FC = () => {
	return (
		<UseExpertise
			title="My Skills"
			items={skills}
			showCompany={false}
			showSkills={true}
			scrollHeight="h-[400px]"
		/>
	);
};

export default SkillSection;
