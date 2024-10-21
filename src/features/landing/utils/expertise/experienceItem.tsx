import React from "react";

interface ExperienceItemProps {
	item: {
		date?: string;
		title: string;
		company?: string;
		description?: string;
		skills?: string[] | string;
	};
	showCompany: boolean;
	showSkills: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ item, showCompany, showSkills }) => {
	return (
		<>
			<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
				{item.title}
			</h3>

			{showCompany && item.company && (
				<p className="text-base font-normal text-neutral-600 dark:text-neutral-400">
					{item.company}
				</p>
			)}

			{item.description && (
				<p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
			)}

			{showSkills && item.skills && (
				<p className="text-sm font-light text-neutral-500 dark:text-neutral-500">
					{Array.isArray(item.skills) ? item.skills.join(", ") : item.skills}
				</p>
			)}
		</>
	);
};

export default ExperienceItem;
