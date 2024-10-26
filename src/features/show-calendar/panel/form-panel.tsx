import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/phone-input";
import * as React from "react";
import { ChangeEvent } from "react";

interface FormData {
	name: string;
	email: string;
	phone: string;
	notes: string;
	guests: { email: string }[];
}

interface FormPanelProps {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
	onBack: () => void;
}

export function FormPanel({ formData, setFormData, onBack }: FormPanelProps) {
	// ADD GUEST
	const addGuest = () => {
		setFormData((prev) => ({
			...prev,
			guests: [...prev.guests, { email: "" }],
		}));
	};

	// REMOVE GUEST
	const removeGuest = (index: number) => {
		setFormData((prev) => ({
			...prev,
			guests: prev.guests.filter((_, i) => i !== index),
		}));
	};

	// HANDLE CHANGE
	const handleChange = (field: keyof FormData, value: string | ChangeEvent<HTMLInputElement>) => {
		const newValue = typeof value === "string" ? value : value.target.value;
		setFormData((prev) => ({ ...prev, [field]: newValue }));
	};

	// HANDLE GUEST CHANGE
	const handleGuestChange = (index: number, email: string) => {
		setFormData((prev) => ({
			...prev,
			guests: prev.guests.map((guest, i) => (i === index ? { email } : guest)),
		}));
	};

	const hasGuests = formData.guests.length > 0; // CHECK IF THERE ARE GUESTS

	return (
		<form className="flex flex-col gap-5 w-screen">
			{/* FORM CONTENT */}
			<div className="flex flex-col space-y-1.5">
				{/* NAME */}
				<Label htmlFor="name">Your name *</Label>
				<Input
					id="name"
					placeholder="Name"
					className="bg-neutral-100 dark:bg-neutral-900"
					value={formData.name}
					onChange={(e) => handleChange("name", e.target.value)}
				/>
			</div>
			<div className="flex flex-col space-y-1.5">
				{/* EMAIL */}
				<Label htmlFor="email">Email address *</Label>
				<Input
					id="email"
					type="email"
					placeholder="exemple@email.com"
					className="bg-neutral-100 dark:bg-neutral-900"
					value={formData.email}
					onChange={(e) => handleChange("email", e.target.value)}
				/>
			</div>
			<div className="flex flex-col space-y-1.5">
				{/* PHONE */}
				<Label htmlFor="phone">Phone number *</Label>
				<PhoneInput
					id="phone"
					defaultCountry="CH"
					value={formData.phone}
					onChange={(value) => handleChange("phone", value)}
				/>
			</div>
			<div className="flex flex-col space-y-1.5">
				{/* NOTES */}
				<Label htmlFor="notes">Additional notes</Label>
				<Textarea
					id="notes"
					placeholder="Please share anything that will help prepare for our meeting"
					className="bg-neutral-100 dark:bg-neutral-900"
					value={formData.notes}
					onChange={(e) => handleChange("notes", e.target.value)}
				/>
			</div>
			{hasGuests && (
				<>
					{/* GUESTS */}
					<Label htmlFor="email">Add guests</Label>
					<div className="flex flex-col gap-1">
						{formData.guests.map((guest, index) => (
							<div key={index} className="flex items-center space-x-2 relative">
								<Input
									id="guest"
									type="email"
									placeholder="guest@email.com"
									value={guest.email}
									onChange={(e) => handleGuestChange(index, e.target.value)}
									className="bg-neutral-100 dark:bg-neutral-900"
								/>
								<X
									className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 size-4 text-neutral-500 dark:text-neutral-400"
									onClick={() => removeGuest(index)}
								/>
							</div>
						))}
					</div>
				</>
			)}

			{/* ADD GUEST */}
			<Button type="button" variant="ghost" onClick={addGuest} className="w-fit">
				<UserPlus className="mr-2 size-4" />
				Add guests
			</Button>

			{/* TERMS AND PRIVACY POLICY */}
			<p className="text-neutral-500 dark:text-neutral-400 text-xs my-4">
				By proceeding, you agree to our <span className="font-bold">Terms</span> and{" "}
				<span className="font-bold">Privacy Policy</span>.
			</p>

			{/* BACK AND CONTINUE BUTTONS */}
			<div className="flex justify-end gap-2">
				<Button variant="ghost" onClick={onBack}>
					Back
				</Button>
				<Button
					asChild
					type="button"
					variant={["default", "expandIcon"]}
					Icon={<ArrowRightIcon className="size-4" />}
					iconPlacement="right"
				>
					<Link href="/">Continue</Link>
				</Button>
			</div>
		</form>
	);
}
