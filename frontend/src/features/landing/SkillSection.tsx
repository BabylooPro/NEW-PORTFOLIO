"use client";

import React from "react";
import UseExpertise from "./utils/expertise/useExpertise";
import { useSkills } from "./utils/expertise/useSkills";
import { useSkillSection } from "./utils/expertise/useSkillSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/ui/section";

const SkillSection: React.FC = () => {
    const { skills, loading: skillsLoading, error: skillsError } = useSkills();
    const {
        title,
        titleDescription,
        paragraphDescription,
        loading: sectionLoading,
        error: sectionError
    } = useSkillSection();

    const isLoading = skillsLoading || sectionLoading;
    const error = skillsError || sectionError;
    const hasData = Boolean(skills?.length) && Boolean(title);

    const getStatusContent = () => {
        if (error) {
            return (
                <div className="flex items-center gap-2 text-red-500">
                    <Skeleton className="h-8 w-8 bg-red-200" />
                    <span>Error loading skills section. Please try again later.</span>
                </div>
            );
        }
        if (!hasData && !isLoading) {
            return (
                <div className="flex items-center gap-2 text-yellow-500">
                    <Skeleton className="h-8 w-8 bg-yellow-200" />
                    <span>No data available at the moment.</span>
                </div>
            );
        }
        if (isLoading) {
            return <Skeleton className="h-8 w-8" />;
        }
        return null;
    };

    return (
        <Section id="skills">
            <UseExpertise
                id="skills"
                title={isLoading ? "My Skills" : title}
                titleDescription={titleDescription}
                paragraphDescription={paragraphDescription}
                items={skills || []}
                showCompany={false}
                showSkills={true}
                scrollHeight="h-[400px]"
                loading={isLoading}
                error={error?.toString()}
                statusContent={getStatusContent()}
            />
        </Section>
    );
};

export default SkillSection;
