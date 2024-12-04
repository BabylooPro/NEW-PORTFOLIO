import { TabsContent } from "@/components/ui/tabs";
import { Duration } from "../components/duration";

export function DurationView() {
	return (
		<TabsContent value="duration">
			<Duration />
		</TabsContent>
	);
}
