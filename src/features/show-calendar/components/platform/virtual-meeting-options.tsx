import React from "react";
import { Link, Webcam } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface VirtualMeetingOptionsProps {
	isCustomLinkChecked: boolean;
	setIsCustomLinkChecked: (checked: boolean) => void;
	isWebcamEnabled: boolean;
	setIsWebcamEnabled: (enabled: boolean) => void;
	isOtherPlatform: boolean;
}

export function VirtualMeetingOptions({
	isCustomLinkChecked,
	setIsCustomLinkChecked,
	isWebcamEnabled,
	setIsWebcamEnabled,
	isOtherPlatform,
}: VirtualMeetingOptionsProps) {
	return (
		<div className="space-y-6">
			{/* VIRTUAL MEETING OPTIONS */}
			{isOtherPlatform ? (
				<div className="space-y-2">
					{/* LABEL */}
					<Label className="text-sm font-medium mb-1 block">Custom Meeting Link</Label>
					{/* INPUT */}
					<Input
						type="url"
						placeholder="https://..."
						className="w-full bg-neutral-100 dark:bg-neutral-900"
					/>
				</div>
			) : (
				<>
					{/* CUSTOM LINK */}
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center space-x-2">
							<Link className="w-4 h-4" />
							<Label
								htmlFor="custom-link"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Use Custom Link
							</Label>
						</div>
						<Switch
							id="custom-link"
							checked={isCustomLinkChecked}
							onCheckedChange={setIsCustomLinkChecked}
						/>
					</div>

					{/* CUSTOM LINK INPUT */}
					{isCustomLinkChecked && (
						<div className="ml-6 mb-4">
							<Label className="text-sm font-medium mb-1 block">
								Custom Meeting Link
							</Label>
							<Input
								type="url"
								placeholder="https://..."
								className="w-full bg-neutral-100 dark:bg-neutral-900"
							/>
						</div>
					)}
				</>
			)}

			{/* ENABLE/DISABLE WEBCAM */}
			<div className="flex items-center space-x-2 justify-between">
				<div className="flex items-center space-x-2">
					<Webcam className="w-4 h-4" />
					<Label
						htmlFor="webcam"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Webcam
					</Label>
				</div>
				<Checkbox
					id="webcam"
					checked={isWebcamEnabled}
					onCheckedChange={(checked) => setIsWebcamEnabled(checked as boolean)}
				/>
			</div>
		</div>
	);
}
