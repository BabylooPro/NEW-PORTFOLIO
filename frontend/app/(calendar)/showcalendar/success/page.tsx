import { SuccessAppointment } from "@/features/show-calendar/components/success";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function SuccessPage() {
	return (
		<Suspense fallback={<Loader2 className="size-4 animate-spin" />}>
			<SuccessAppointment />
		</Suspense>
	);
}
