"use client";

import React from "react";
import UseExpertise from "./utils/expertise/useExpertise";
import { useExperienceSection } from "./utils/expertise/useExperienceSection";

const ExperienceSection: React.FC = () => {
    const { title, titleDescription, paragraphDescription, experiences, loading } = useExperienceSection();

    return (
        <UseExpertise
            id="experience"
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
