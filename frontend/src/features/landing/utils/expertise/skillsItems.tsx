import React from "react";
import { CodeXml, Heart, ThumbsDown, ThumbsUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ShowInfo } from "@/components/ui/show-info";
import { Skill } from "@/features/landing/data/skills";

const SkillItem: React.FC<{ skill: Skill; allColorIcon?: string; isRight?: boolean }> = ({
	skill,
	allColorIcon,
	isRight,
}) => {
	const getRandomDuration = () => Math.random() * 4 + 1;
	const getRandomRotate = () => Math.random() * 20 - 10;
	const getRandomTranslateY = () => Math.random() * 5 - 2.5;
	const getRandomScale = () => Math.random() * 0.2 + 0.8;

	return (
		<ShowInfo wrapMode>
			<ShowInfo.Content>
				<div
					className={`flex items-center space-x-2 ${
						isRight ? "flex-row-reverse space-x-reverse" : ""
					}`}
				>
					{skill.icon ? (
						<i
							className={`devicon-${skill.icon.toLowerCase()}-plain colored`}
							style={{
								fontSize: "24px",
								color: allColorIcon ?? undefined,
							}}
						></i>
					) : (
						<CodeXml color={allColorIcon ?? "currentColor"} size={24} />
					)}

					<p
						className={`text-base font-normal text-neutral-700 dark:text-neutral-300 cursor-pointer ${
							skill.unlike
								? "line-through text-neutral-500 dark:text-neutral-500"
								: ""
						}`}
					>
						{skill.name}
					</p>

					{skill.favorite && (
						<motion.div
							animate={{
								scale: [getRandomScale(), getRandomScale() + 0.2, getRandomScale()],
								rotate: [
									getRandomRotate(),
									getRandomRotate() + 20,
									getRandomRotate(),
								],
							}}
							transition={{
								duration: getRandomDuration(),
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="mb-5"
						>
							<Heart className="text-red-900" size={18} fill="red" />
						</motion.div>
					)}

					{skill.star && (
						<motion.div
							animate={{
								scale: [getRandomScale(), getRandomScale() + 0.2, getRandomScale()],
								rotate: [
									getRandomRotate(),
									getRandomRotate() + 20,
									getRandomRotate(),
								],
							}}
							transition={{
								duration: getRandomDuration(),
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="mb-5"
						>
							<Star className="text-yellow-500" size={18} fill="yellow" />
						</motion.div>
					)}

					{skill.like && (
						<motion.div
							animate={{
								scale: [getRandomScale(), getRandomScale() + 0.2, getRandomScale()],
								translateY: [
									getRandomTranslateY(),
									getRandomTranslateY() - 5,
									getRandomTranslateY(),
								],
							}}
							transition={{
								duration: getRandomDuration(),
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="mb-5"
						>
							<ThumbsUp size={18} className="text-blue-500" />
						</motion.div>
					)}

					{skill.unlike && (
						<motion.div
							animate={{
								scale: [getRandomScale(), getRandomScale() + 0.2, getRandomScale()],
								rotate: [
									getRandomRotate(),
									getRandomRotate() + 20,
									getRandomRotate(),
								],
							}}
							transition={{
								duration: getRandomDuration(),
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="mb-5"
						>
							<ThumbsDown size={18} className="text-neutral-500" />
						</motion.div>
					)}
				</div>
			</ShowInfo.Content>
			<ShowInfo.Title className="text-left">{skill.name}</ShowInfo.Title>
			<ShowInfo.Description className="text-left">
				{skill.description ?? "Description not available"}
			</ShowInfo.Description>
		</ShowInfo>
	);
};

export default SkillItem;
