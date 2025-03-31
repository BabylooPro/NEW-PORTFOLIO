import { cn } from "@/lib/utils";
import { MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DockItem {
    title: string;
    icon: React.ReactNode;
    href: string;
    target?: string;
}

interface DockStyleProps {
    backgroundColor?: string;
    itemSize?: {
        min: number;
        max: number;
    };
    iconSize?: {
        min: number;
        max: number;
    };
    gap?: number;
    height?: number;
    padding?: {
        x?: number;
        bottom?: number;
    };
    springConfig?: {
        mass?: number;
        stiffness?: number;
        damping?: number;
    };
    distanceRange?: number;
    containerless?: boolean;
    containerClassName?: string;
    itemsContainerClassName?: string;
    hoverPosition?: "expand-up" | "expand-down" | "expand-center";
    containerSize?: {
        width?: string | number;
        height?: string | number;
        minHeight?: string | number;
        maxHeight?: string | number;
    };
}

interface DockProps {
    items: DockItem[];
    className?: string;
    styles?: DockStyleProps;
}

interface IconContainerProps extends DockItem {
    mouseX: MotionValue<number>;
    styles?: DockStyleProps;
}

// CONSTANTS
const DEFAULT_STYLES: DockStyleProps = {
    itemSize: {
        min: 40,
        max: 80,
    },
    iconSize: {
        min: 25,
        max: 50,
    },
    gap: 16,
    height: 64,
    padding: {
        x: 16,
        bottom: 12,
    },
    springConfig: {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    },
    distanceRange: 150,
    hoverPosition: "expand-up",
    containerSize: {
        height: 64,
    },
};

// HELPER FUNCTIONS
const useIconAnimation = (
    mouseX: MotionValue<number>,
    ref: React.RefObject<HTMLDivElement | null>,
    styles?: DockStyleProps
) => {
    const config = {
        ...DEFAULT_STYLES,
        ...styles,
    };

    const distanceRange = [-config.distanceRange!, 0, config.distanceRange!];
    const sizeRange = {
        container: [config.itemSize!.min, config.itemSize!.max, config.itemSize!.min],
        icon: [config.iconSize!.min, config.iconSize!.max, config.iconSize!.min],
    };

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const containerTransforms = {
        width: useTransform<number, number>(distance, distanceRange, sizeRange.container),
        height: useTransform<number, number>(distance, distanceRange, sizeRange.container),
    };

    const iconTransforms = {
        width: useTransform<number, number>(distance, distanceRange, sizeRange.icon),
        height: useTransform<number, number>(distance, distanceRange, sizeRange.icon),
    };

    return {
        container: {
            width: useSpring(containerTransforms.width, config.springConfig),
            height: useSpring(containerTransforms.height, config.springConfig),
        },
        icon: {
            width: useSpring(iconTransforms.width, config.springConfig),
            height: useSpring(iconTransforms.height, config.springConfig),
        },
    };
};

// COMPONENTS
const IconContainer = ({ mouseX, title, icon, href, target, styles }: IconContainerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const animations = useIconAnimation(mouseX, ref, styles);

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={href} target={target}>
                        <motion.div
                            ref={ref}
                            style={animations.container}
                            className="aspect-square rounded-full flex items-center justify-center relative"
                        >
                            <motion.div
                                style={animations.icon}
                                className="flex items-center justify-center"
                            >
                                {icon}
                            </motion.div>
                        </motion.div>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">{title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const DockContainer = ({ items, className, styles }: DockProps) => {
    const mouseX = useMotionValue<number>(Infinity);
    const config = { ...DEFAULT_STYLES, ...styles };

    const getHoverPositionClass = (position?: "expand-up" | "expand-down" | "expand-center") => {
        switch (position) {
            case "expand-up":
                return "items-end";
            case "expand-down":
                return "items-start";
            case "expand-center":
                return "items-center";
            default:
                return "items-end";
        }
    };

    const ItemsWrapper = ({ children }: { children: React.ReactNode }) => {
        if (config.containerless) {
            return (
                <div
                    onMouseMove={(e) => mouseX.set(e.pageX)}
                    onMouseLeave={() => mouseX.set(Infinity)}
                    className={cn(
                        "flex",
                        getHoverPositionClass(config.hoverPosition),
                        config.itemsContainerClassName
                    )}
                    style={{
                        gap: config.gap,
                    }}
                >
                    {children}
                </div>
            );
        }

        return (
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className={cn(
                    "mx-auto flex rounded-2xl bg-neutral-50 dark:bg-neutral-900",
                    getHoverPositionClass(config.hoverPosition),
                    config.containerClassName,
                    className
                )}
                style={{
                    width: config.containerSize?.width,
                    height: config.containerSize?.height,
                    minHeight: config.containerSize?.minHeight,
                    maxHeight: config.containerSize?.maxHeight,
                    gap: config.gap,
                    paddingLeft: config.padding?.x,
                    paddingRight: config.padding?.x,
                    paddingTop: config.hoverPosition === "expand-up" ? config.padding?.bottom : 0,
                    paddingBottom:
                        config.hoverPosition === "expand-down" ? config.padding?.bottom : 0,
                    backgroundColor: config.backgroundColor,
                }}
            >
                {children}
            </motion.div>
        );
    };

    return (
        <ItemsWrapper>
            {items.map((item, index) => (
                <IconContainer
                    mouseX={mouseX}
                    key={`${item.title}-${item.href}-${index}`}
                    {...item}
                    styles={styles}
                />
            ))}
        </ItemsWrapper>
    );
};

export const Dock = ({ items, className, styles }: DockProps) => {
    return <DockContainer items={items} className={className} styles={styles} />;
};
