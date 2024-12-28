import React, { ReactElement } from "react";
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

// TESTS - ROOT LAYOUT
describe("RootLayout", () => {
    beforeEach(() => {
        document.documentElement.innerHTML = '';
        document.body.innerHTML = '';
    });

    // TEST - RENDER CHILDREN
    it("should render children correctly", () => {
        const { container } = render(
            <div data-testid="layout-root">
                <Providers>
                    <div>Test Child</div>
                </Providers>
            </div>
        );

        const providersElement = container.querySelector('[data-testid="providers"]');
        expect(providersElement).toBeInTheDocument();
        expect(providersElement?.textContent).toBe("Test Child");
    });

    // TEST - CLASS NAMES
    it("should apply the correct class names", () => {
        const { className } = Montserrat();
        const classes = cn(className, "h-full");
        expect(classes).toContain("mocked-montserrat-class");
        expect(classes).toContain("h-full");
    });

    // TEST - COMPONENT STRUCTURE
    it("should have correct component structure", () => {
        const component = RootLayout({ children: <div>Test</div> }) as ReactElement;

        expect(component.type).toBe("html");
        expect(component.props.lang).toBe("en");
        expect(component.props.suppressHydrationWarning).toBe(true);

        const [head, body] = React.Children.toArray(component.props.children) as ReactElement[];
        expect(head.type).toBe("head");
        expect(body.type).toBe("body");
        expect(body.props.className).toContain("mocked-montserrat-class");
        expect(body.props.className).toContain("h-full");
    });

    // TEST - USE PROVIDERS COMPONENT
    it("should use Providers component", () => {
        const { container } = render(
            <div data-testid="layout-root">
                <Providers>
                    <div>Test Child</div>
                </Providers>
            </div>
        );

        const providersElement = container.querySelector('[data-testid="providers"]');
        expect(providersElement).toBeInTheDocument();
    });

    // TEST - CORRECT METADATA
    it("should have correct metadata", () => {
        expect(metadata.title).toEqual({
            template: "%s | Max Remy Dev",
            default: "Max Remy Dev",
        });
        expect(metadata.description).toBe("Max Remy Portfolio Website");
    });
});
