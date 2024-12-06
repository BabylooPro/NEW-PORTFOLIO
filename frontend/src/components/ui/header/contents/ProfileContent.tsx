import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShowInfo } from "@/components/ui/show-info";
import AvatarStatus from "@/components/ui/avatar-status";
import { WakaTimeData } from "../../../../../app/api/wakatime/types";
import { useHeaderSection } from "@/components/ui/header/hooks/useHeaderSection";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export const ProfileContent = ({
	wakaTimeData,
}: {
	wakaTimeData: WakaTimeData | null;
}) => {
	const { data, isLoading } = useHeaderSection();
	const avatar = data?.profile?.avatar;
	
	const avatarUrl = avatar?.formats?.thumbnail?.url || avatar?.url;
	const fullAvatarUrl = avatarUrl ? `${STRAPI_URL}${avatarUrl}` : '';
	const initials = data?.profile?.name?.split(' ').map(n => n[0]).join('') || 'MR';

	if (isLoading) return null;

	return (
		<ShowInfo wrapMode>
			<ShowInfo.Title>Activity Status</ShowInfo.Title>
			<ShowInfo.Content>
				<motion.div
					whileHover={{ scale: 1.1 }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 10,
					}}
					className="relative"
				>
					<div className="relative">
						<Avatar className="w-10 h-10 sm:w-14 sm:h-14">
							<AvatarImage 
								src={fullAvatarUrl} 
								alt={avatar?.alternativeText || `${data?.profile?.name}'s avatar`}
							/>
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<AvatarStatus size={14} />
					</div>
				</motion.div>
			</ShowInfo.Content>
			<ShowInfo.Description>
				{wakaTimeData ? (
					<>
						<strong>
							{wakaTimeData.status === "available" && "I'm currently available:"}
							{wakaTimeData.status === "away" && "I'm currently away:"}
							{wakaTimeData.status === "busy" && "I'm currently busy:"}
						</strong>
						{wakaTimeData.data.categories.length > 0 &&
						wakaTimeData.data.categories[0].digital !== "0:00" ? (
							<ul className="list-disc pl-4">
								<li>
									{wakaTimeData.status === "available" && "Today, I've been "}
									{wakaTimeData.status === "away" && "I've been "}
									{wakaTimeData.status === "busy" && "I've already spent "}
									{wakaTimeData.data.categories[0].name.toLowerCase()} for{" "}
									{wakaTimeData.data.categories[0].digital}
									{wakaTimeData.status === "away" && " so far today"}
									{wakaTimeData.status === "busy" && " coding today"}
								</li>
								<li>
									{wakaTimeData.status === "available" && "Currently using "}
									{wakaTimeData.status === "away" && "Last active on "}
									{wakaTimeData.status === "busy" &&
										"Not working at the moment, but earlier I was on "}
									{wakaTimeData.data.operating_systems.length > 0
										? wakaTimeData.data.operating_systems[0].name
										: "an unknown system"}
									, with{" "}
									{wakaTimeData.data.editors.length > 0
										? wakaTimeData.data.editors[0].name
										: "no editor"}
								</li>
							</ul>
						) : (
							<p>No activity has been logged since the start of the day.</p>
						)}

						<Separator className="my-4" />

						<ul className="mt-2">
							<li>
								<span className="text-green-500">●</span> <strong>Available: </strong>
								Active in the last 15 minutes
							</li>
							<li>
								<span className="text-orange-500">●</span> <strong>Away: </strong>
								Inactive for 15 to 60 minutes
							</li>
							<li>
								<span className="text-red-500">●</span> <strong>Busy: </strong>
								Inactive for more than an hour
							</li>
						</ul>

						<Separator className="my-4" />

						<p className="text-neutral-500 text-sm font-extralight">
							<strong>Time Zone:</strong> {wakaTimeData.data.range.timezone}
						</p>

						<p className="text-neutral-500 text-sm font-extralight">
							<strong>Last Update:</strong>{" "}
							{new Date(wakaTimeData.cached_at).toLocaleString()}
						</p>
					</>
				) : (
					<p>Loading Status...</p>
				)}
			</ShowInfo.Description>
		</ShowInfo>
	);
}; 
