import React from "react";
import { render } from "@testing-library/react";
import RootLayout, { metadata } from "../../app/layout";

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

// SUPPRESS CONSOLE ERRORS
beforeAll(() => {
	jest.spyOn(console, "error").mockImplementation(() => {});
});

// RESTORE CONSOLE ERROR
afterAll(() => {
	(console.error as jest.Mock).mockRestore();
});

// TESTS - ROOT LAYOUT
describe("RootLayout", () => {
	// CLEAR ALL MOCKS BEFORE EACH TEST
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// TEST - RENDER CHILDREN CORRECTLY
	it("should render children correctly", () => {
		// MOCK REQUEST
		const { container } = render(
			<RootLayout>
				<div>Test Child</div>
			</RootLayout>
		);

		// ASSERTIONS
		expect(container.querySelector("body")).toContainHTML("<div>Test Child</div>");
		expect(container.querySelector('[data-testid="providers"]')).toBeInTheDocument();
	});

	// TEST - APPLY CORRECT CLASS NAMES
	it("should apply the correct class names", () => {
		// MOCK REQUEST
		const { container } = render(
			<RootLayout>
				<div>Test Child</div>
			</RootLayout>
		);

		// ASSERTIONS
		const body = container.querySelector("body");
		expect(body).toHaveClass("h-full");
		expect(body?.className).toContain("mocked-montserrat-class");
	});

	// TEST - SET CORRECT LANG ATTRIBUTE
	it("should set the correct lang attribute", () => {
		// MOCK REQUEST
		const { container } = render(
			<RootLayout>
				<div>Test Child</div>
			</RootLayout>
		);

		// ASSERTIONS
		const html = container.querySelector("html");
		expect(html).toHaveAttribute("lang", "en");
	});

	// TEST - USE PROVIDERS COMPONENT
	it("should use Providers component", () => {
		// MOCK REQUEST
		const { container } = render(
			<RootLayout>
				<div>Test Child</div>
			</RootLayout>
		);

		// ASSERTIONS
		expect(container.querySelector('[data-testid="providers"]')).toBeInTheDocument();
	});

	// TEST - CORRECT METADATA
	it("should have correct metadata", () => {
		// ASSERTIONS
		expect(metadata).toBeDefined();
		expect(metadata.title).toEqual({
			template: "%s | Max Remy Dev",
			default: "Max Remy Dev",
		});

		// ASSERTIONS
		expect(metadata.description).toBe("Max Remy Portfolio Website");
	});
});
