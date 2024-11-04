import React from "react";
import { Metadata } from "next";
import Header from "@/features/landing/Header";
import { Section } from "@/components/ui/section";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Test",
	description: "Test page",
};

// REDIRECT TO 404 IF NOT IN DEVELOPMENT MODE
const isProduction = process.env.NODE_ENV === "production";

// CREATE AN ARRAY OF 10 SECTIONS
const sections = Array.from({ length: 10 }, (_, i) => i);

export default async function TestPage() {
	// PREVENT ACCESS IN PRODUCTION
	if (isProduction) {
		notFound();
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="h-16 max-sm:h-12" />
			<Header />
			{sections.map((_, index) => (
				<Section key={index} className="h-96" />
			))}
		</div>
	);
}
