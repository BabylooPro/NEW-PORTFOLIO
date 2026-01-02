import React from "react";
import type { ExperienceDateRange } from "./experienceDate";

export interface ExperienceItemProps {
	id?: number;
	title: string;
	company?: string;
	date: ExperienceDateRange;
	description?: {
		items: string[];
	};
	skills?: string[];
	location?: string;
}

const ExperienceItem: React.FC<{
	item: ExperienceItemProps;
	showCompany: boolean;
	showSkills: boolean;
}> = ({ item, showCompany, showSkills }) => {
	return (
		<>
			<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
				{item.title}
			</h3>

			{showCompany && (item.company || item.location) && (
				<p className="text-base font-normal text-neutral-600 dark:text-neutral-400">
					{item.company}
					{item.location && (
						<span className="text-neutral-500 dark:text-neutral-500">
							{item.company && " • "}
							{item.location}
						</span>
					)}
				</p>
			)}

			{item.description && item.description.items && item.description.items.length > 0 && (
				<div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
					{item.description.items.map((line, index) => (
						<p
							key={`${item.id ?? item.title}-${index}`}
							className="flex items-start gap-2"
						>
							<span className="mt-2 inline-block w-[6px] h-[6px] rounded-full bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
							<span>{line}</span>
						</p>
					))}
				</div>
			)}

			{showSkills && item.skills && (
				<p className="text-sm font-light text-neutral-500 dark:text-neutral-500 mt-2">
					{item.skills.join(", ")}
				</p>
			)}
		</>
	);
};

export default ExperienceItem;
