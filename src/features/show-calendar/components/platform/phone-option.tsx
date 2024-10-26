import React from "react";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";

export function PhoneOption() {
	return (
		<div className="space-y-2">
			<Label className="text-sm font-medium">Phone Number</Label>
			<PhoneInput placeholder="Enter phone number" defaultCountry="CH" />
		</div>
	);
}
