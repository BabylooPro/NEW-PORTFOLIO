import React from "react";
import { TerminalPreview } from "../../TerminalPreview";

interface Command {
    command: string;
    output: string;
    delay?: number;
}

type JsonPreview = {
    type: "json";
    content: Record<string, unknown>;
};

type ComponentPreview = {
    type: "component";
    content:
    | React.ComponentType
    | {
        title?: string;
        description?: string;
        features?: string[];
    };
};

type TerminalPreview = {
    type: "terminal";
    content: Command[];
};

type Preview = JsonPreview | ComponentPreview | TerminalPreview;

interface PreviewProps {
    preview: Preview | null;
}

export const Preview: React.FC<PreviewProps> = ({ preview }) => {
    if (!preview) return null; // IF NO PREVIEW, RETURN NULL

    // SWITCH PREVIEW TYPE FOR DIFFERENT TYPES OF PREVIEWS
    switch (preview.type) {
        // JSON PREVIEW
        case "json":
            return (
                <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <pre className="text-sm">
                        {JSON.stringify(preview.content, null, 2)}
                    </pre>
                </div>
            );

        // JSX COMPONENT PREVIEW
        case "component":
            if (!preview.content) return null;

            // IF CONTENT IS A REACT COMPONENT (FUNCTION OR CLASS)
            if (typeof preview.content === "function") {
                const Component = preview.content;
                return <Component />;
            }

            // IF CONTENT IS AN OBJECT WITH TITLE, DESCRIPTION, FEATURES
            const { title, description, features = [] } = preview.content;

            return (
                <div className="flex flex-col items-center justify-center w-full min-h-[200px] p-4">
                    {/* TITLE */}
                    {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}

                    {/* DESCRIPTION */}
                    {description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-center max-w-2xl">
                            {description}
                        </p>
                    )}

                    {/* FEATURES */}
                    {features.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature: string, index: number) => (
                                <div
                                    key={index}
                                    className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm"
                                >
                                    {feature}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );

        // TERMINAL PREVIEW (TERMINAL COMMANDS)
        case "terminal":
            return (
                <div className="w-full min-h-[300px] bg-black rounded-lg">
                    <TerminalPreview commands={preview.content} />
                </div>
            );

        // DEFAULT PREVIEW (IF NO PREVIEW TYPE MATCHES)
        default:
            return null;
    }
};
