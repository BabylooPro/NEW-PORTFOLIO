import { cn } from "@/lib/utils";
import { type AriaButtonProps, useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

export function Button(
    props: AriaButtonProps<"button"> & {
        state?: CalendarState;
        side?: "left" | "right";
    }
) {
    const ref = useRef<HTMLButtonElement>(null); // CREATE REF
    const { buttonProps } = useButton(props, ref); // GET BUTTON PROPS
    const { focusProps, isFocusVisible } = useFocusRing(); // GET FOCUS PROPS

    return (
        <button
            {...mergeProps(buttonProps, focusProps)}
            ref={ref}
            className={cn(
                "p-2 rounded-xl outline-none text-neutral-900 dark:text-neutral-100",
                props.isDisabled
                    ? "text-neutral-400 dark:text-neutral-600 opacity-50 cursor-not-allowed"
                    : "hover:bg-neutral-200 dark:hover:bg-neutral-800 active:bg-neutral-300 dark:active:bg-neutral-700",
                isFocusVisible && "ring-2 ring-offset-2 ring-neutral-400 dark:ring-neutral-600",
                "transition-colors duration-200"
            )}
        >
            {props.children}
        </button>
    );
}
