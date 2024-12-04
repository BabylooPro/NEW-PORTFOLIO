import { ProcessAppointment } from "@/features/show-calendar/components/process";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function ProcessPage() {
	return (
		<Suspense fallback={<Loader2 className="size-4 animate-spin" />}>
			<ProcessAppointment />
		</Suspense>
	);
}
