import { Section } from "@/components/ui/section";
import { ShowInfo } from "@/components/ui/show-info";

export const TestimonialSection = () => {
	return (
		<Section>
			<h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
				Testimonials
				<ShowInfo
					title="Testimonials"
					description="Reviews from Google place of Max Remy Dev"
				/>
			</h2>
		</Section>
	);
};
