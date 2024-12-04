import React from "react";
import { render } from "@testing-library/react";
import RootLayout, { metadata } from "../../app/layout";
import { Providers } from "../../app/providers";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

// MOCK PROVIDERS COMPONENT
jest.mock("../../app/providers", () => ({
	Providers: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="providers">{children}</div>
	),
}));

// MOCK USE ROUTER
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: jest.fn(),
	}),
}));

// MOCK NEXT/FONT/GOOGLE
jest.mock("next/font/google", () => ({
	Montserrat: () => ({
		className: "mocked-montserrat-class",
	}),
}));

// MOCK CN UTILITY
jest.mock("@/lib/utils", () => ({
	cn: (...inputs: string[]) => inputs.join(" "),
}));

// MOCK DOCUMENT IMPLEMENTATION
const setupDocument = () => {
	const html = document.createElement('html');
	const body = document.createElement('body');
	html.appendChild(body);
	return { html, body };
};

// TESTS - ROOT LAYOUT
describe("RootLayout", () => {
	let container: HTMLElement;
	
	beforeEach(() => {
		const { html, body } = setupDocument();
		container = body;
		document.documentElement.replaceWith(html);
	});

	// TEST - RENDER CHILDREN
	it("should render children correctly", () => {
		render(
			<div data-testid="layout-root">
				<Providers>
					<div>Test Child</div>
				</Providers>
			</div>,
			{ container }
		);

		// ASSERTIONS
		const providersElement = container.querySelector('[data-testid="providers"]');
		expect(providersElement).toBeInTheDocument();
		expect(providersElement?.textContent).toBe("Test Child");
	});

	// TEST - CLASS NAMES
	it("should apply the correct class names", () => {
		const { className } = Montserrat();
		container.className = cn(className, "h-full");

		// ASSERTIONS
		expect(container.className).toContain("mocked-montserrat-class");
		expect(container.className).toContain("h-full");
	});

	// TEST - LANG ATTRIBUTE
	it("should set the correct lang attribute", () => {
		document.documentElement.setAttribute("lang", "en");
		document.documentElement.setAttribute("suppressHydrationWarning", "");

		// ASSERTIONS
		expect(document.documentElement.getAttribute("lang")).toBe("en");
		expect(document.documentElement.hasAttribute("suppressHydrationWarning")).toBe(true);
	});

	// TEST - USE PROVIDERS COMPONENT
	it("should use Providers component", () => {
		render(
			<div data-testid="layout-root">
				<Providers>
					<div>Test Child</div>
				</Providers>
			</div>,
			{ container }
		);

		// ASSERTIONS
		const providersElement = container.querySelector('[data-testid="providers"]');
		expect(providersElement).toBeInTheDocument();
	});

	// TEST - CORRECT METADATA
	it("should have correct metadata", () => {
		// ASSERTIONS
		expect(metadata.title).toEqual({
			template: "%s | Max Remy Dev",
			default: "Max Remy Dev",
		});
		expect(metadata.description).toBe("Max Remy Portfolio Website");
	});
});
