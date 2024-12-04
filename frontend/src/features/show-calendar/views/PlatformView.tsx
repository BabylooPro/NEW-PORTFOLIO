import { TabsContent } from "@/components/ui/tabs";
import { Platform } from "../components/platform";

interface PlatformViewProps {
	onPlatformChange: (platform: string) => void;
}

export function PlatformView({ onPlatformChange }: PlatformViewProps) {
	return (
		<TabsContent value="platform">
			<Platform onPlatformChange={onPlatformChange} />
		</TabsContent>
	);
}
