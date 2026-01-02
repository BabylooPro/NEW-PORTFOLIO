"use client";

import { LucideIcon, Bug, Ruler, Cpu, Box, Route, Grid, Grid3X3, MemoryStick, Network, Cookie, Clock, Database, Activity, Palette, Keyboard, History, Gauge, MousePointer, ChevronRight, Play, Pause, Pipette, Accessibility, Paintbrush, ChevronDown, Rewind } from "lucide-react";
import { forwardRef, useEffect, useState, useCallback, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}
interface LargestContentfulPaint extends PerformanceEntry {
    element: Element;
    size: number;
    startTime: number;
}
interface PerformancePaintTiming extends PerformanceEntry {
    name: 'first-paint' | 'first-contentful-paint';
    startTime: number;
}
interface EyeDropperResult {
    sRGBHex: string;
}
interface EyeDropper {
    open(): Promise<EyeDropperResult>;
}
declare global {
    interface Window {
        EyeDropper?: {
            new(): EyeDropper;
        };
    }
}
interface GridSettings {
    size: number;
    color: string;
    showSubgrid: boolean;
    subgridSize: number;
    lineThickness: number;
}
const DEFAULT_GRID_SETTINGS: GridSettings = {
    size: 8,
    color: 'rgba(255,0,0,0.1)',
    showSubgrid: false,
    subgridSize: 2,
    lineThickness: 1
};
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }
const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);
function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}
const Collapsible = CollapsiblePrimitive.Root
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "z-50 overflow-hidden rounded-xl border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName
const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuContent = forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            onPointerDownOutside={(e) => {
                const isSelecting = document.body.style.cursor === 'pointer';
                if (isSelecting) {
                    e.preventDefault();
                }
            }}
            onFocusOutside={(e) => {
                const isSelecting = document.body.style.cursor === 'pointer';
                if (isSelecting) {
                    e.preventDefault();
                }
            }}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName
const ScreenSize = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const updateSize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Ruler size={14} />
                    {size.width}x{size.height}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Current viewport dimensions</p>
                <p className="text-xs text-muted-foreground">Width: {size.width}px</p>
                <p className="text-xs text-muted-foreground">Height: {size.height}px</p>
            </TooltipContent>
        </Tooltip>
    );
};
interface MemoryInfo {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
}
interface PerformanceWithMemory extends Performance {
    memory: MemoryInfo;
}
const PerformanceMonitor = () => {
    const [fps, setFps] = useState(0);
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        const updateFps = () => {
            const now = performance.now();
            frameCount++;
            if (now - lastTime > 1000) {
                setFps(Math.round(frameCount * 1000 / (now - lastTime)));
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(updateFps);
        };
        const handle = requestAnimationFrame(updateFps);
        return () => cancelAnimationFrame(handle);
    }, []);
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Cpu size={14} />
                    {fps} FPS
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Frames Per Second</p>
                <p className="text-xs text-muted-foreground">Current: {fps} FPS</p>
                <p className="text-xs text-muted-foreground">Target: 60 FPS</p>
            </TooltipContent>
        </Tooltip>
    );
};
const useDevToolsStore = () => {
    const [componentInspectorActive, setComponentInspectorActive] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('devtools-inspector') === 'true'
        }
        return false
    });
    const [bordersActive, setBordersActive] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('devtools-borders') === 'true'
        }
        return false
    });
    const [gridActive, setGridActive] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('devtools-grid') === 'true'
        }
        return false
    });
    const [gridSettings, setGridSettings] = useState<GridSettings>(() => {
        if (typeof window !== 'undefined') {
            const savedSettings = localStorage.getItem('devtools-grid-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                return {
                    ...DEFAULT_GRID_SETTINGS,
                    ...parsed
                };
            }
        }
        return DEFAULT_GRID_SETTINGS;
    });
    const setComponentInspectorActiveWithStorage = (value: boolean) => {
        setComponentInspectorActive(value);
        localStorage.setItem('devtools-inspector', value.toString());
    };
    const setBordersActiveWithStorage = (value: boolean) => {
        setBordersActive(value);
        localStorage.setItem('devtools-borders', value.toString());
    };
    const setGridActiveWithStorage = (value: boolean) => {
        setGridActive(value);
        localStorage.setItem('devtools-grid', value.toString());
    };
    const setGridSettingsWithStorage = (value: GridSettings | ((prev: GridSettings) => GridSettings)) => {
        setGridSettings(value);
        const newSettings = typeof value === 'function' ? value(gridSettings) : value;
        localStorage.setItem('devtools-grid-settings', JSON.stringify(newSettings));
    };
    return {
        componentInspectorActive,
        setComponentInspectorActive: setComponentInspectorActiveWithStorage,
        bordersActive,
        setBordersActive: setBordersActiveWithStorage,
        gridActive,
        setGridActive: setGridActiveWithStorage,
        gridSettings,
        setGridSettings: setGridSettingsWithStorage
    };
};
const ComponentInspector = ({ active, onToggle }: { active: boolean, onToggle: (active: boolean) => void }) => {
    const [tooltip, setTooltip] = useState<{
        show: boolean;
        x: number;
        y: number;
        info: {
            tag: string;
            id: string;
            classes: string[];
            dimensions: { width: number; height: number };
            position: { x: number; y: number };
            styles: Partial<CSSStyleDeclaration>;
            attributes: { [key: string]: string };
        } | null;
    }>({
        show: false,
        x: 0,
        y: 0,
        info: null
    });
    useEffect(() => {
        const tooltipEl = document.createElement('div');
        tooltipEl.id = 'inspector-tooltip';
        tooltipEl.style.cssText = `
      position: fixed;
      z-index: 999999;
            background: #1a1a1a;
            color: #fff;
            padding: 4px 6px;
      border-radius: 4px;
            font-size: 10px;
      pointer-events: none;
            max-width: 200px;
      display: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
        document.body.appendChild(tooltipEl);
        const handleMouseOver = (e: MouseEvent) => {
            if (!active) return;
            const target = e.target as HTMLElement;
            target.style.outline = '1px solid rgba(255, 0, 0, 0.8)';
            const rect = target.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(target);
            const attributes = Array.from(target.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
            }, {} as { [key: string]: string });
            setTooltip({
                show: true,
                x: e.clientX + 15,
                y: e.clientY + 15,
                info: {
                    tag: target.tagName.toLowerCase(),
                    id: target.id,
                    classes: Array.from(target.classList),
                    dimensions: {
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    position: {
                        x: Math.round(rect.x),
                        y: Math.round(rect.y)
                    },
                    styles: {
                        color: computedStyle.color,
                        backgroundColor: computedStyle.backgroundColor,
                        margin: computedStyle.margin,
                        padding: computedStyle.padding,
                        fontSize: computedStyle.fontSize,
                        fontFamily: computedStyle.fontFamily,
                    },
                    attributes
                }
            });
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!active) return;
            setTooltip(prev => ({
                ...prev,
                x: e.clientX + 15,
                y: e.clientY + 15
            }));
        };
        const handleMouseOut = (e: Event) => {
            if (!active) return;
            const target = e.target as HTMLElement;
            target.style.outline = '1px solid rgba(255, 0, 0, 0.2)';
            setTooltip(prev => ({ ...prev, show: false }));
        };
        if (active) {
            document.body.style.outline = '1px solid rgba(255, 0, 0, 0.2)';
            document.addEventListener('mouseover', handleMouseOver, true);
            document.addEventListener('mouseout', handleMouseOut, true);
            document.addEventListener('mousemove', handleMouseMove, true);
        }
        return () => {
            document.body.style.outline = 'none';
            document.removeEventListener('mouseover', handleMouseOver, true);
            document.removeEventListener('mouseout', handleMouseOut, true);
            document.removeEventListener('mousemove', handleMouseMove, true);
            tooltipEl.remove();
            document.querySelectorAll('*').forEach(el => {
                (el as HTMLElement).style.outline = 'none';
            });
        };
    }, [active]);
    useEffect(() => {
        const tooltipEl = document.getElementById('inspector-tooltip');
        if (!tooltipEl) return;
        if (tooltip.show && tooltip.info) {
            tooltipEl.style.display = 'block';
            tooltipEl.style.left = `${tooltip.x}px`;
            tooltipEl.style.top = `${tooltip.y}px`;
            tooltipEl.innerHTML = `
                <div style="font-weight: 500;">${tooltip.info.tag}${tooltip.info.id ? `#${tooltip.info.id}` : ''}</div>
                ${tooltip.info.classes.length ? `<div style="color: #94a3b8; font-size: 9px;">${tooltip.info.classes.join(' ')}</div>` : ''}
                <div style="color: #94a3b8; margin-top: 2px;">
                    <div>Size: <span style="color: #fff">${tooltip.info.dimensions.width}×${tooltip.info.dimensions.height}px</span></div>
                    <div>Position: <span style="color: #fff">${tooltip.info.position.x}, ${tooltip.info.position.y}</span></div>
        </div>
          ${Object.entries(tooltip.info.styles)
                    .filter(([_, value]) => value && value !== 'none' && value !== 'normal')
                    .length > 0 ? `
                <div style="margin-top: 2px; padding-top: 2px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #94a3b8;">Styles</div>
                    ${Object.entries(tooltip.info.styles)
                    .filter(([_, value]) => value && value !== 'none' && value !== 'normal')
                    .map(([key, value]) => `<div style="padding-left: 4px;"><span style="color: #94a3b8">${key}:</span> <span style="color: #fff">${value}</span></div>`).join('')}
        </div>
            ` : ''}
        ${Object.keys(tooltip.info.attributes).length ? `
                <div style="margin-top: 2px; padding-top: 2px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #94a3b8;">Attributes</div>
            ${Object.entries(tooltip.info.attributes)
                        .map(([key, value]) => `<div style="padding-left: 4px;"><span style="color: #94a3b8">${key}:</span> <span style="color: #fff">${value}</span></div>`).join('')}
          </div>
        ` : ''}
      `;
            const rect = tooltipEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            if (rect.right > viewportWidth) {
                tooltipEl.style.left = `${tooltip.x - rect.width - 10}px`;
            }
            if (rect.bottom > viewportHeight) {
                tooltipEl.style.top = `${tooltip.y - rect.height - 10}px`;
            }
        } else {
            tooltipEl.style.display = 'none';
        }
    }, [tooltip]);
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <Badge
            className="flex items-center gap-1 cursor-pointer w-full"
            variant={active ? "destructive" : "outline"}
            onClick={() => onToggle(!active)}
        >
            <Box size={14} />
            <span className="truncate">
                {active ? 'Inspect (Active)' : 'Inspect'}
            </span>
        </Badge>
    );
};
const ColorEditor = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [color, setColor] = useState<string>('#000000');
    hooks.useElementSelector({
        isActive,
        onSelect: (element: HTMLElement) => {
            setSelectedElement(element);
            const computedStyle = window.getComputedStyle(element);
            setColor(computedStyle.color);
            setIsActive(false);
        },
        selectedElement
    });
    hooks.useElementHighlight(selectedElement, '2px solid #2563eb');
    const handleEyeDropper = async () => {
        try {
            const eyeDropper = new (window.EyeDropper as unknown as { new(): EyeDropper });
            const result = await eyeDropper.open();
            if (result.sRGBHex && selectedElement) {
                handleColorChange(result.sRGBHex);
            }
        } catch (e) {
            console.error('EyeDropper failed:', e);
        }
    };
    const handleColorChange = (newColor: string) => {
        if (selectedElement) {
            selectedElement.style.color = newColor;
            setColor(newColor);
        }
    };
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Badge
                    className="flex items-center gap-1 cursor-pointer w-full"
                    variant={!!selectedElement ? "destructive" : "outline"}
                >
                    <div className="flex items-center gap-1 flex-1">
                        <Paintbrush size={14} />
                        <span className="truncate">
                            {selectedElement ? color : 'Color Editor'}
                        </span>
                    </div>
                    <ChevronRight size={14} />
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[300px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <div className="p-2 space-y-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Color Editor</h3>
                        {selectedElement ? (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => {
                                    setSelectedElement(null);
                                    setColor('#000000');
                                    setIsActive(true);
                                }}
                            >
                                Change Element
                            </button>
                        ) : (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => setIsActive(true)}
                            >
                                Select Element
                            </button>
                        )}
                    </div>
                    {isActive && (
                        <p className="text-xs text-muted-foreground mb-4">Click on an element to edit its color</p>
                    )}
                    {selectedElement && (
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                            />
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-8 px-3"
                                onClick={handleEyeDropper}
                            >
                                <Pipette className="w-4 h-4 mr-2" />
                                Pick Color
                            </button>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const BorderToggle = ({ active, onToggle }: { active: boolean, onToggle: (active: boolean) => void }) => {
    useEffect(() => {
        if (active) {
            document.body.classList.add('debug-borders');
            const styleEl = document.createElement('style');
            styleEl.id = 'debug-borders-style';
            styleEl.textContent = `
        .debug-borders * {
          outline: 1px solid rgba(255, 0, 0, 0.2) !important;
        }
      `;
            document.head.appendChild(styleEl);
        } else {
            document.body.classList.remove('debug-borders');
            const styleEl = document.getElementById('debug-borders-style');
            if (styleEl) styleEl.remove();
        }
    }, [active]);
    return (
        <Badge
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => onToggle(!active)}
            variant={active ? "destructive" : "outline"}
        >
            <Bug size={16} />
            Borders
        </Badge>
    );
};
const MemoryMonitor = () => {
    const [memory, setMemory] = useState<MemoryInfo | null>(null);
    useEffect(() => {
        const updateMemory = () => {
            if ('memory' in performance) {
                setMemory((performance as PerformanceWithMemory).memory);
            }
        };
        const interval = setInterval(updateMemory, 1000);
        updateMemory();
        return () => clearInterval(interval);
    }, []);
    if (process.env.NODE_ENV === 'production' || !memory) return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <MemoryStick size={14} />
                    {Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>JavaScript Memory Usage</p>
                <p className="text-xs text-muted-foreground">
                    Used: {Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB
                </p>
                <p className="text-xs text-muted-foreground">
                    Limit: {Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB
                </p>
            </TooltipContent>
        </Tooltip>
    );
};
const RouteInspector = () => {
    const [pathname, setPathname] = useState("");
    useEffect(() => {
        setPathname(window.location.pathname);
        const handleRouteChange = () => {
            setPathname(window.location.pathname);
        };
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Route size={14} />
                    {pathname}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Current Route</p>
                <p className="text-xs text-muted-foreground">Path: {pathname}</p>
            </TooltipContent>
        </Tooltip>
    );
};
const BreakpointIndicator = () => {
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Grid size={14} />
                    <span className="block sm:hidden">xs</span>
                    <span className="hidden sm:block md:hidden">sm</span>
                    <span className="hidden md:block lg:hidden">md</span>
                    <span className="hidden lg:block xl:hidden">lg</span>
                    <span className="hidden xl:block 2xl:hidden">xl</span>
                    <span className="hidden 2xl:block">2xl</span>
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Tailwind Breakpoint</p>
                <p className="text-xs text-muted-foreground">xs: &lt;640px</p>
                <p className="text-xs text-muted-foreground">sm: 640px - 767px</p>
                <p className="text-xs text-muted-foreground">md: 768px - 1023px</p>
                <p className="text-xs text-muted-foreground">lg: 1024px - 1279px</p>
                <p className="text-xs text-muted-foreground">xl: 1280px - 1535px</p>
                <p className="text-xs text-muted-foreground">2xl: ≥1536px</p>
            </TooltipContent>
        </Tooltip>
    );
};
const NetworkMonitor = () => {
    const [stats, setStats] = useState({
        activeRequests: 0,
        lastLatency: 0,
        totalRequests: 0,
        requestsByType: {} as Record<string, number>
    });
    useEffect(() => {
        let activeRequests = 0;
        let totalRequests = 0;
        const requestsByType: Record<string, number> = {};
        document.querySelectorAll('img, script, link, iframe').forEach(el => {
            const type = el.tagName.toLowerCase();
            requestsByType[type] = (requestsByType[type] || 0) + 1;
            totalRequests++;
        });
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                const resourceEntry = entry as PerformanceResourceTiming;
                const type = resourceEntry.initiatorType || 'other';
                requestsByType[type] = (requestsByType[type] || 0) + 1;
                if (resourceEntry.duration === 0) {
                    activeRequests++;
                } else {
                    activeRequests = Math.max(0, activeRequests - 1);
                    setStats(prev => ({
                        ...prev,
                        activeRequests,
                        lastLatency: Math.round(resourceEntry.duration),
                        requestsByType: { ...requestsByType }
                    }));
                }
            });
        });
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement) {
                        if (['IMG', 'SCRIPT', 'LINK', 'IFRAME'].includes(node.tagName)) {
                            const type = node.tagName.toLowerCase();
                            requestsByType[type] = (requestsByType[type] || 0) + 1;
                            totalRequests++;
                            activeRequests++;
                            setStats(prev => ({
                                ...prev,
                                activeRequests,
                                totalRequests,
                                requestsByType: { ...requestsByType }
                            }));
                        }
                    }
                });
            });
        });
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            activeRequests++;
            totalRequests++;
            requestsByType.fetch = (requestsByType.fetch || 0) + 1;
            setStats(prev => ({
                ...prev,
                activeRequests,
                totalRequests,
                requestsByType: { ...requestsByType }
            }));
            try {
                const response = await originalFetch(...args);
                const latency = performance.now() - startTime;
                activeRequests--;
                setStats(prev => ({
                    ...prev,
                    activeRequests,
                    lastLatency: Math.round(latency),
                    requestsByType: { ...requestsByType }
                }));
                return response;
            } catch (error) {
                activeRequests--;
                setStats(prev => ({ ...prev, activeRequests }));
                throw error;
            }
        };
        const XHR = XMLHttpRequest.prototype;
        const originalOpen = XHR.open;
        const originalSend = XHR.send;
        XHR.open = function (method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
            requestsByType.xhr = (requestsByType.xhr || 0) + 1;
            totalRequests++;
            activeRequests++;
            setStats(prev => ({
                ...prev,
                activeRequests,
                totalRequests,
                requestsByType: { ...requestsByType }
            }));
            originalOpen.call(this, method, url, async, username, password);
        };
        XHR.send = function (...args) {
            const startTime = performance.now();
            this.addEventListener('loadend', () => {
                activeRequests--;
                setStats(prev => ({
                    ...prev,
                    activeRequests,
                    lastLatency: Math.round(performance.now() - startTime),
                    requestsByType: { ...requestsByType }
                }));
            });
            originalSend.apply(this, args);
        };
        resourceObserver.observe({ entryTypes: ['resource'] });
        mutationObserver.observe(document, {
            childList: true,
            subtree: true
        });
        setStats(prev => ({
            ...prev,
            activeRequests,
            totalRequests,
            requestsByType: { ...requestsByType }
        }));
        return () => {
            window.fetch = originalFetch;
            XHR.open = originalOpen;
            XHR.send = originalSend;
            resourceObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                    <Network size={14} />
                    <span>{stats.activeRequests}/{stats.totalRequests}</span>
                    {stats.lastLatency > 0 && <span>({stats.lastLatency}ms)</span>}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Network Activity</p>
                <p className="text-xs text-muted-foreground">Active requests: {stats.activeRequests}</p>
                <p className="text-xs text-muted-foreground">Total requests: {stats.totalRequests}</p>
                <p className="text-xs text-muted-foreground">Last latency: {stats.lastLatency}ms</p>
                <div className="mt-1 border-t pt-1">
                    <p className="text-xs text-muted-foreground">Requests by type:</p>
                    {Object.entries(stats.requestsByType).map(([type, count]) => (
                        <p key={type} className="text-xs text-muted-foreground">
                            {type}: {count}
                        </p>
                    ))}
                </div>
            </TooltipContent>
        </Tooltip>
    );
};
const StorageMonitor = () => {
    const [stats, setStats] = useState({
        localStorage: 0,
        sessionStorage: 0,
        totalSize: 0
    });
    useEffect(() => {
        const calculateSize = () => {
            const lsSize = Object.keys(localStorage).reduce((total, key) => {
                return total + (localStorage[key]?.length || 0);
            }, 0);
            const ssSize = Object.keys(sessionStorage).reduce((total, key) => {
                return total + (sessionStorage[key]?.length || 0);
            }, 0);
            setStats({
                localStorage: Object.keys(localStorage).length,
                sessionStorage: Object.keys(sessionStorage).length,
                totalSize: Math.round((lsSize + ssSize) / 1024)
            });
        };
        calculateSize();
        window.addEventListener('storage', calculateSize);
        return () => window.removeEventListener('storage', calculateSize);
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Database size={14} />
                    {stats.totalSize}KB
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Web Storage Usage</p>
                <p className="text-xs text-muted-foreground">
                    LocalStorage: {stats.localStorage} items
                </p>
                <p className="text-xs text-muted-foreground">
                    SessionStorage: {stats.sessionStorage} items
                </p>
                <p className="text-xs text-muted-foreground">
                    Total Size: {stats.totalSize}KB
                </p>
            </TooltipContent>
        </Tooltip>
    );
};
const CookieMonitor = () => {
    const [cookieCount, setCookieCount] = useState(0);
    useEffect(() => {
        const countCookies = () => {
            setCookieCount(document.cookie.split(';').filter(c => c.trim()).length);
        };
        countCookies();
        const interval = setInterval(countCookies, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Cookie size={14} />
                    {cookieCount}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Cookie Monitor</p>
                <p className="text-xs text-muted-foreground">Active Cookies: {cookieCount}</p>
            </TooltipContent>
        </Tooltip>
    );
};
const EventMonitor = () => {
    const [stats, setStats] = useState({ last: '', count: 0 });
    useEffect(() => {
        const handler = (e: Event) => {
            setStats(prev => ({
                last: e.type,
                count: prev.count + 1
            }));
        };
        const events = ['click', 'submit', 'input', 'change'];
        events.forEach(event => document.addEventListener(event, handler, true));
        return () => {
            events.forEach(event => document.removeEventListener(event, handler, true));
        };
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Activity size={14} />
                    {stats.count}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Event Monitor</p>
                <p className="text-xs text-muted-foreground">Total Events: {stats.count}</p>
                <p className="text-xs text-muted-foreground">Last Event: {stats.last}</p>
            </TooltipContent>
        </Tooltip>
    );
};
const PageLoadMonitor = () => {
    const [timing, setTiming] = useState({ load: 0, dom: 0 });
    useEffect(() => {
        const onLoad = () => {
            const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigationEntry) {
                const loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;
                const domTime = navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
                setTiming({
                    load: Math.round(loadTime),
                    dom: Math.round(domTime)
                });
            }
        };
        if (document.readyState === 'complete') {
            onLoad();
        } else {
            window.addEventListener('load', onLoad);
            return () => window.removeEventListener('load', onLoad);
        }
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Clock size={14} />
                    {timing.load}ms
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Page Load Timing</p>
                <p className="text-xs text-muted-foreground">Total Load: {timing.load}ms</p>
                <p className="text-xs text-muted-foreground">DOM Ready: {timing.dom}ms</p>
            </TooltipContent>
        </Tooltip>
    );
};
const ColorSchemeMonitor = () => {
    const [scheme, setScheme] = useState<'light' | 'dark'>('light');
    const [prefersScheme, setPrefersScheme] = useState<'light' | 'dark'>('light');
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateScheme = () => {
            setScheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            setPrefersScheme(mediaQuery.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', updateScheme);
        const observer = new MutationObserver(updateScheme);
        observer.observe(document.documentElement, { attributes: true });
        updateScheme();
        return () => {
            mediaQuery.removeEventListener('change', updateScheme);
            observer.disconnect();
        };
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Palette size={14} />
                    {scheme}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Color Scheme</p>
                <p className="text-xs text-muted-foreground">Current: {scheme}</p>
                <p className="text-xs text-muted-foreground">System: {prefersScheme}</p>
            </TooltipContent>
        </Tooltip>
    );
};
const KeyboardMonitor = () => {
    const [lastKeys, setLastKeys] = useState<string[]>([]);
    useEffect(() => {
        const keys = new Set<string>();
        const handleKeyDown = (e: KeyboardEvent) => {
            keys.add(e.key);
            setLastKeys(Array.from(keys));
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keys.delete(e.key);
            setLastKeys(Array.from(keys));
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Keyboard size={14} />
                    {lastKeys.length > 0 ? lastKeys.join('+') : 'None'}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Active Keys</p>
                <p className="text-xs text-muted-foreground">
                    {lastKeys.length > 0 ? lastKeys.join(' + ') : 'No keys pressed'}
                </p>
            </TooltipContent>
        </Tooltip>
    );
};
const HistoryMonitor = () => {
    const [stats, setStats] = useState({
        length: window.history.length,
        current: typeof window !== 'undefined' ? window.location.pathname : '/'
    });
    useEffect(() => {
        const updateStats = () => {
            setStats({
                length: window.history.length,
                current: window.location.pathname || '/'
            });
        };
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
        window.history.pushState = function (...args) {
            originalPushState.apply(this, args);
            updateStats();
            window.dispatchEvent(new Event('historychange'));
        };
        window.history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            updateStats();
            window.dispatchEvent(new Event('historychange'));
        };
        window.addEventListener('popstate', updateStats);
        window.addEventListener('historychange', updateStats);
        updateStats();
        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', updateStats);
            window.removeEventListener('historychange', updateStats);
        };
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <History size={14} />
                    {stats.length}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>History Stack</p>
                <p className="text-xs text-muted-foreground">Path: {stats.current}</p>
                <p className="text-xs text-muted-foreground">Stack Size: {stats.length}</p>
            </TooltipContent>
        </Tooltip>
    );
};
const PerformanceMetrics = () => {
    const [metrics, setMetrics] = useState({
        fcp: 0,
        lcp: 0,
        cls: 0,
    });
    useEffect(() => {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'layout-shift') {
                    const clsEntry = entry as LayoutShift;
                    setMetrics(prev => ({ ...prev, cls: prev.cls + clsEntry.value }));
                } else if (entry.entryType === 'paint') {
                    const paintEntry = entry as PerformancePaintTiming;
                    if (paintEntry.name === 'first-contentful-paint') {
                        setMetrics(prev => ({ ...prev, fcp: Math.round(paintEntry.startTime) }));
                    }
                } else if (entry.entryType === 'largest-contentful-paint') {
                    const lcpEntry = entry as LargestContentfulPaint;
                    setMetrics(prev => ({ ...prev, lcp: Math.round(lcpEntry.startTime) }));
                }
            });
        });
        observer.observe({
            entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint']
        });
        return () => observer.disconnect();
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Gauge size={14} />
                    FCP: {metrics.fcp}ms
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Core Web Vitals</p>
                <p className="text-xs text-muted-foreground">First Paint: {metrics.fcp}ms</p>
                <p className="text-xs text-muted-foreground">Largest Paint: {metrics.lcp}ms</p>
                <p className="text-xs text-muted-foreground">CLS: {metrics.cls.toFixed(3)}</p>
            </TooltipContent>
        </Tooltip>
    );
};
const MouseMonitor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                    <MousePointer size={14} />
                    {pos.x}, {pos.y}
                </Badge>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Mouse Position</p>
                <p className="text-xs text-muted-foreground">X: {pos.x}px</p>
                <p className="text-xs text-muted-foreground">Y: {pos.y}px</p>
            </TooltipContent>
        </Tooltip>
    );
};
const updateGridOverlay = (active: boolean, settings: GridSettings) => {
    const existingGrid = document.getElementById('debug-grid-overlay');
    if (existingGrid) {
        existingGrid.remove();
    }
    if (active) {
        const gridOverlay = document.createElement('div');
        gridOverlay.id = 'debug-grid-overlay';
        gridOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-image: ${settings.showSubgrid ? `
                linear-gradient(to right, ${settings.color} ${settings.lineThickness}px, transparent ${settings.lineThickness}px),
                linear-gradient(to bottom, ${settings.color} ${settings.lineThickness}px, transparent ${settings.lineThickness}px),
                linear-gradient(to right, rgba(255,0,0,0.05) ${settings.lineThickness / 2}px, transparent ${settings.lineThickness / 2}px),
                linear-gradient(to bottom, rgba(255,0,0,0.05) ${settings.lineThickness / 2}px, transparent ${settings.lineThickness / 2}px)
            ` : `
                linear-gradient(to right, ${settings.color} ${settings.lineThickness}px, transparent ${settings.lineThickness}px),
                linear-gradient(to bottom, ${settings.color} ${settings.lineThickness}px, transparent ${settings.lineThickness}px)
            `};
            background-size: ${settings.size}px ${settings.size}px${settings.showSubgrid ? `, ${settings.subgridSize}px ${settings.subgridSize}px` : ''};
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(gridOverlay);
    }
};
const GridToggle = ({ active, onToggle }: { active: boolean, onToggle: (active: boolean) => void }) => {
    const { gridSettings, setGridSettings } = useDevToolsStore();
    const handleToggle = useCallback((newState: boolean) => {
        onToggle(newState);
        updateGridOverlay(newState, gridSettings);
    }, [onToggle, gridSettings]);
    const handleSettingsChange = useCallback((newSettings: Partial<GridSettings>) => {
        const updatedSettings = {
            ...gridSettings,
            ...newSettings
        };
        setGridSettings(updatedSettings);
        updateGridOverlay(active, updatedSettings);
    }, [active, setGridSettings, gridSettings]);
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Badge
                    className="flex items-center gap-1 cursor-pointer"
                    variant={active ? "destructive" : "outline"}
                >
                    <div className="flex items-center gap-1 flex-1">
                        <Grid3X3 size={14} />
                        Grid
                    </div>
                    <ChevronRight size={14} />
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[200px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Grid Settings</p>
                        <Badge
                            variant={active ? "destructive" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleToggle(!active)}
                        >
                            {active ? 'ON' : 'OFF'}
                        </Badge>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium">Grid Size: {gridSettings?.size || DEFAULT_GRID_SETTINGS.size}px</label>
                            <input
                                type="range"
                                min="4"
                                max="100"
                                value={gridSettings?.size || DEFAULT_GRID_SETTINGS.size}
                                onChange={(e) => handleSettingsChange({ size: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Line Thickness: {gridSettings?.lineThickness || DEFAULT_GRID_SETTINGS.lineThickness}px</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                                value={gridSettings?.lineThickness || DEFAULT_GRID_SETTINGS.lineThickness}
                                onChange={(e) => handleSettingsChange({ lineThickness: parseFloat(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">Grid Color</label>
                            <div className="flex gap-2 mt-1">
                                {['rgba(255,0,0,0.1)', 'rgba(0,0,255,0.1)', 'rgba(0,255,0,0.1)', 'rgba(128,128,128,0.1)'].map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => handleSettingsChange({ color })}
                                        className={`w-6 h-6 rounded cursor-pointer border ${gridSettings?.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium">Show Subgrid</label>
                            <input
                                type="checkbox"
                                checked={gridSettings?.showSubgrid || DEFAULT_GRID_SETTINGS.showSubgrid}
                                onChange={(e) => handleSettingsChange({ showSubgrid: e.target.checked })}
                            />
                        </div>
                        {gridSettings?.showSubgrid && (
                            <div>
                                <label className="text-xs font-medium">Subgrid Size: {gridSettings?.subgridSize || DEFAULT_GRID_SETTINGS.subgridSize}px</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="8"
                                    value={gridSettings?.subgridSize || DEFAULT_GRID_SETTINGS.subgridSize}
                                    onChange={(e) => handleSettingsChange({ subgridSize: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const OverflowInspector = () => {
    const [overflowElements, setOverflowElements] = useState<Array<{
        element: HTMLElement;
        width: number;
        viewportWidth: number;
        overflowAmount: number;
    }>>([]);
    useEffect(() => {
        const detectOverflow = () => {
            const viewportWidth = document.documentElement.clientWidth;
            const elements: Array<{
                element: HTMLElement;
                width: number;
                viewportWidth: number;
                overflowAmount: number;
            }> = [];
            const checkElement = (element: HTMLElement) => {
                const rect = element.getBoundingClientRect();
                const width = rect.width;
                if (width > viewportWidth || rect.right > viewportWidth) {
                    elements.push({
                        element,
                        width,
                        viewportWidth,
                        overflowAmount: Math.round(width - viewportWidth)
                    });
                }
                Array.from(element.children).forEach((child) => {
                    if (child instanceof HTMLElement) {
                        checkElement(child);
                    }
                });
            };
            checkElement(document.body);
            setOverflowElements(elements);
        };
        detectOverflow();
        window.addEventListener('resize', detectOverflow);
        const observer = new MutationObserver(detectOverflow);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'width']
        });
        return () => {
            window.removeEventListener('resize', detectOverflow);
            observer.disconnect();
        };
    }, []);
    const copyElementInfo = (item: {
        element: HTMLElement;
        width: number;
        viewportWidth: number;
        overflowAmount: number;
    }) => {
        const computedStyle = window.getComputedStyle(item.element);
        const info = {
            tag: item.element.tagName.toLowerCase(),
            id: item.element.id,
            classes: item.element.className,
            width: Math.round(item.width),
            overflowAmount: item.overflowAmount,
            styles: {
                width: computedStyle.width,
                maxWidth: computedStyle.maxWidth,
                margin: computedStyle.margin,
                padding: computedStyle.padding,
                position: computedStyle.position,
                left: computedStyle.left,
                right: computedStyle.right,
                transform: computedStyle.transform,
            }
        };
        const infoText = `
OVERFLOW ELEMENT DETAILS
-----------------------
Tag: ${info.tag}${info.id ? `#${info.id}` : ''}
Classes: ${info.classes}
Width: ${info.width}px
Overflow Amount: +${info.overflowAmount}px
COMPUTED STYLES
--------------
${Object.entries(info.styles)
                .filter(([_, value]) => value && value !== 'none' && value !== 'auto')
                .map(([key, value]) => `${key}: ${value}`).join('\n')}
        `.trim();
        navigator.clipboard.writeText(infoText).then(() => {
            const oldOutline = item.element.style.outline;
            item.element.style.outline = '2px solid green';
            setTimeout(() => {
                item.element.style.outline = oldOutline;
            }, 500);
        });
    };
    const highlightElement = (element: HTMLElement) => {
        document.querySelectorAll('.overflow-highlight').forEach(el => {
            el.classList.remove('overflow-highlight');
            (el as HTMLElement).style.outline = '';
        });
        element.classList.add('overflow-highlight');
        element.style.outline = '2px solid red';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Badge
                    variant={overflowElements.length > 0 ? "destructive" : "outline"}
                    className="flex items-center gap-1 cursor-pointer"
                >
                    <div className="flex items-center gap-1 flex-1">
                        <Route size={14} />
                        {overflowElements.length > 0 ? `${overflowElements.length} overflow(s)` : 'No overflow'}
                    </div>
                    <ChevronRight size={14} />
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[300px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <div className="p-2">
                    <p className="font-medium">Horizontal Overflow Detection</p>
                    {overflowElements.length === 0 ? (
                        <p className="text-xs text-muted-foreground mt-2">No horizontal overflow detected</p>
                    ) : (
                        <div className="mt-2 max-h-[300px] overflow-auto">
                            {overflowElements.map((item, index) => (
                                <div
                                    key={index}
                                    className="text-xs text-muted-foreground mb-2 p-2 border rounded cursor-pointer hover:bg-accent"
                                    onClick={() => {
                                        highlightElement(item.element);
                                        copyElementInfo(item);
                                    }}
                                >
                                    <p className="font-semibold">{item.element.tagName.toLowerCase()}</p>
                                    <p>Width: {Math.round(item.width)}px</p>
                                    <p>Overflow: +{item.overflowAmount}px</p>
                                    <p className="text-[10px] opacity-70 truncate">
                                        Classes: {item.element.className}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Click to copy details</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
interface ElementInfo {
    tag: string;
    id: string;
    classes: string[];
}
interface _AccessibilityIssues {
    aria: string[];
    contrast: string[];
    labels: string[];
}
interface _AccessibilityInfo {
    role: string | null;
    ariaAttributes: string[];
    semantics: string[];
    recommendations: string[];
}
interface _CommonInspectorProps {
    active: boolean;
    onToggle: (active: boolean) => void;
}
interface ElementSelectorOptions {
    isActive: boolean;
    onSelect: (element: HTMLElement) => void;
    selectedElement: HTMLElement | null;
    ignoreSelector?: string;
}
interface ComponentInfo {
    name: string;
    props: Record<string, unknown>;
    element: HTMLElement | null;
}
interface MemoizedState {
    memoizedState: unknown;
    next: MemoizedState | null;
}
interface ReactInstance {
    name: string;
    props: Record<string, unknown>;
    instance?: {
        state?: Record<string, unknown>;
        _reactInternals?: {
            memoizedState?: MemoizedState;
        }
    };
}
interface FunctionDetails {
    name: string;
    params: string;
    body: string;
    fullString: string;
}
const getFunctionDetails = (func: (...args: unknown[]) => unknown): FunctionDetails => {
    try {
        const funcString = func.toString();
        const name = func.name || 'anonymous';
        const params = funcString.slice(funcString.indexOf('('), funcString.indexOf(')') + 1);
        const body = funcString
            .slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'))
            .trim();
        return {
            name,
            params,
            body,
            fullString: funcString
        };
    } catch (_error) {
        return {
            name: 'Error parsing function',
            params: '(?)',
            body: 'Unable to extract function body',
            fullString: String(func)
        };
    }
};
const hooks = {
    useElementSelector: (options: ElementSelectorOptions): void => {
        const { isActive, onSelect, ignoreSelector } = options;
        useEffect(() => {
            if (!isActive) return;
            const handleClick = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const element = e.target as HTMLElement;
                if (ignoreSelector && element.matches(ignoreSelector)) return;
                const devTools = document.querySelector('[data-devtools]');
                if (devTools?.contains(element)) return;
                onSelect(element);
            };
            document.addEventListener('click', handleClick, true);
            document.body.style.cursor = 'pointer';
            return () => {
                document.removeEventListener('click', handleClick, true);
                document.body.style.cursor = '';
            };
        }, [isActive, onSelect, ignoreSelector]);
    },
    useElementHighlight: (element: HTMLElement | null, style: string): void => {
        useEffect(() => {
            if (!element) return;
            const originalOutline = element.style.outline;
            element.style.outline = style;
            return () => {
                element.style.outline = originalOutline;
            };
        }, [element, style]);
    },
    useInterval: (callback: () => void, delay: number | null): void => {
        const savedCallback = useRef<() => void>(callback);
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            if (delay !== null) {
                const id = setInterval(() => savedCallback.current?.(), delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    },
    useLocalStorage: <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
        const [storedValue, setStoredValue] = useState<T>(() => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            } catch (_error) {
                return initialValue;
            }
        });
        const setValue = (value: T) => {
            try {
                setStoredValue(value);
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(error);
            }
        };
        return [storedValue, setValue];
    }
};
const utils = {
    dom: {
        getElementInfo: (element: HTMLElement): ElementInfo => ({
            tag: element.tagName.toLowerCase(),
            id: element.id,
            classes: Array.from(element.classList)
        }),
        getComputedStyles: (element: HTMLElement, properties: string[]): Record<string, string> => {
            const computedStyle = window.getComputedStyle(element);
            return properties.reduce((acc: Record<string, string>, prop) => {
                const value = computedStyle.getPropertyValue(prop).trim();
                if (value && value !== 'none' && value !== 'initial' && value !== 'inherit') {
                    acc[prop] = value;
                }
                return acc;
            }, {});
        },
        findReactInstance: (element: HTMLElement): ReactInstance | null => {
            type _ReactKey = string;
            type ReactFiberNode = {
                stateNode?: {
                    constructor?: (...args: unknown[]) => unknown;
                    state?: Record<string, unknown>;
                    _reactInternals?: {
                        memoizedState?: MemoizedState;
                    };
                };
                type?: {
                    name?: string;
                    displayName?: string;
                };
                memoizedProps?: Record<string, unknown>;
                return?: ReactFiberNode;
            };
            const key = Object.keys(element).find(key =>
                key.startsWith('__reactFiber$') ||
                key.startsWith('__reactProps$') ||
                key.startsWith('__reactContainer$')
            );
            if (!key) return null;
            const fiberNode = ((element as unknown) as { [key: string]: unknown })[key];
            if (!fiberNode) return null;
            if (key.startsWith('__reactProps$')) {
                return {
                    props: ((element as unknown) as { [key: string]: unknown })[key] as Record<string, unknown>,
                    name: element.tagName?.toLowerCase() || 'Unknown'
                };
            }
            let node = fiberNode as ReactFiberNode;
            while (node) {
                if (node.stateNode && node.stateNode.constructor && typeof node.stateNode.constructor === 'function') {
                    return {
                        instance: node.stateNode as unknown as ReactInstance['instance'],
                        name: node.type?.name || node.type?.displayName || 'Anonymous',
                        props: node.memoizedProps || {}
                    };
                }
                if (!node.return) break;
                node = node.return;
            }
            return null;
        },
        getComponentProps: (instance: ReactInstance): Record<string, unknown> => {
            const props: Record<string, unknown> = {};
            try {
                if (instance.props) {
                    Object.entries(instance.props).forEach(([key, value]) => {
                        if (!key.startsWith('_') && key !== 'children') {
                            props[key] = value;
                        }
                    });
                }
                if (instance.instance?.state) {
                    Object.entries(instance.instance.state).forEach(([key, value]) => {
                        props[`${key} (state)`] = value;
                    });
                }
                if (instance.instance?._reactInternals?.memoizedState) {
                    let hookState = instance.instance._reactInternals.memoizedState;
                    let hookIndex = 0;
                    while (hookState) {
                        if (hookState.memoizedState !== undefined) {
                            props[`Hook ${hookIndex}`] = hookState.memoizedState;
                        }
                        hookState = hookState.next as MemoizedState;
                        if (!hookState) break;
                        hookIndex++;
                    }
                }
            } catch (error) {
                console.error('Error getting component props:', error);
            }
            return props;
        }
    },
    color: {
        hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        getLuminance: (r: number, g: number, b: number): number => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        },
        getContrastRatio: (l1: number, l2: number): number => {
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
        }
    },
    format: {
        duration: (ms: number): string => `${(ms / 1000).toFixed(2)}s`,
        bytes: (bytes: number): string => {
            const units = ['B', 'KB', 'MB', 'GB'];
            let size = bytes;
            let unitIndex = 0;
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }
            return `${Math.round(size)}${units[unitIndex]}`;
        }
    } as const
};
const DropRightMenu = ({
    trigger,
    children,
    isOpen: _isOpen,
    onOpenChange: _onOpenChange
}: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[300px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const _CommonComponents = {
    InspectorDropdownMenu: DropRightMenu,
    InspectorBadgeTrigger: ({ icon: Icon, isActive, text, onClick, hasMenu = false }: {
        icon: LucideIcon;
        isActive: boolean;
        text: string;
        onClick: () => void;
        hasMenu?: boolean;
    }) => {
        return (
            <Badge
                className="flex items-center gap-1 cursor-pointer w-full"
                variant={isActive ? "destructive" : "outline"}
                onClick={onClick}
            >
                <div className="flex items-center gap-1 flex-1">
                    <Icon size={14} />
                    <span className="truncate">{text}</span>
                </div>
                {hasMenu && <ChevronRight size={14} />}
            </Badge>
        );
    },
    InspectorHeader: ({ title, element: _element, onChangeElement, children }: {
        title: string;
        element: HTMLElement;
        onChangeElement: () => void;
        children?: React.ReactNode;
    }) => {
        return (
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{title}</h3>
                <div className="flex items-center gap-2">
                    <button
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={onChangeElement}
                    >
                        Change Element
                    </button>
                    {children}
                </div>
            </div>
        );
    }
};
const PropValue: React.FC<{ value: unknown }> = ({ value }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };
    if (value === null) return <span className="PropValue text-muted-foreground">null</span>;
    if (value === undefined) return <span className="PropValue text-muted-foreground">undefined</span>;
    if (typeof value === 'boolean') return <span className="PropValue text-blue-400">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="PropValue text-orange-400">{value}</span>;
    if (typeof value === 'string') return <span className="PropValue text-green-400">&quot;{value}&quot;</span>;
    if (typeof value === 'function') {
        try {
            const details = getFunctionDetails(value as (...args: unknown[]) => unknown);
            return (
                <div className="PropValue relative">
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:text-blue-400"
                        onClick={handleClick}
                    >
                        <ChevronRight
                            className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                        <span className="text-purple-400">
                            {details.name}{details.params} {'{...}'}
                        </span>
                    </div>
                    {isExpanded && (
                        <div className="ml-3 border-l pl-3 mt-1">
                            <div className="text-xs space-y-1">
                                <div className="flex items-start gap-2">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="text-purple-400">{details.name}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-muted-foreground">Parameters:</span>
                                    <span className="text-purple-400">{details.params}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Body:</span>
                                    <pre className="mt-1 text-purple-400 whitespace-pre-wrap break-all bg-muted/50 p-2 rounded">
                                        {details.body}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        } catch (error) {
            console.error('Error parsing function:', error);
            return <span className="PropValue text-muted-foreground">Error parsing function</span>;
        }
    }
    if (Array.isArray(value) || typeof value === 'object') {
        const isArray = Array.isArray(value);
        const isEmpty = isArray ? value.length === 0 : Object.keys(value).length === 0;
        if (isEmpty) {
            return <span className="PropValue text-muted-foreground">{isArray ? '[]' : '{}'}</span>;
        }
        return (
            <div className="PropValue relative">
                <div
                    className="flex items-center gap-1 cursor-pointer hover:text-blue-400"
                    onClick={handleClick}
                >
                    <ChevronRight
                        className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                    <span className="text-muted-foreground">
                        {isArray
                            ? `Array(${value.length})`
                            : `Object{${Object.keys(value).length}}`
                        }
                    </span>
                </div>
                {isExpanded && (
                    <div className="ml-3 border-l pl-3 mt-1">
                        {isArray ? (
                            value.map((item: unknown, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span className="text-muted-foreground">{index}:</span>
                                    <PropValue value={item} />
                                </div>
                            ))
                        ) : (
                            Object.entries(value).map(([key, val]) => (
                                <div key={key} className="flex items-start gap-2">
                                    <span className="text-muted-foreground">{key}:</span>
                                    <PropValue value={val} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }
    return <span className="PropValue text-muted-foreground">{String(value)}</span>;
};
const AnimationInspector = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [animations, setAnimations] = useState<Animation[]>([]);
    hooks.useElementSelector({
        isActive,
        onSelect: (element: HTMLElement) => {
            setSelectedElement(element);
            const elementAnimations = element.getAnimations();
            setAnimations(elementAnimations);
            setIsActive(false);
        },
        selectedElement
    });
    hooks.useElementHighlight(selectedElement, '2px solid #2563eb');
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Badge
                    className="flex items-center gap-1 cursor-pointer w-full"
                    variant={!!selectedElement ? "destructive" : "outline"}
                >
                    <div className="flex items-center gap-1 flex-1">
                        <Play size={14} />
                        <span className="truncate">
                            {selectedElement
                                ? `${animations.length} animation${animations.length !== 1 ? 's' : ''}`
                                : 'Inspect animations'
                            }
                        </span>
                    </div>
                    <ChevronRight size={14} />
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[300px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <div className="p-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Animation Inspector</h3>
                        {selectedElement ? (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => {
                                    setSelectedElement(null);
                                    setAnimations([]);
                                    setIsActive(true);
                                }}
                            >
                                Change Element
                            </button>
                        ) : (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => setIsActive(true)}
                            >
                                Select Element
                            </button>
                        )}
                    </div>
                    {isActive && (
                        <p className="text-xs text-muted-foreground mb-4">Click on an element to inspect its animations</p>
                    )}
                    {selectedElement && (
                        <div className="space-y-2">
                            {animations.map((animation, index) => (
                                <div key={index} className="text-xs p-1 hover:bg-accent rounded">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {(animation as { animationName?: string }).animationName || `Animation ${index + 1}`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background hover:bg-accent h-6 w-6"
                                                onClick={() => animation.pause()}
                                            >
                                                <Pause className="h-3 w-3" />
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background hover:bg-accent h-6 w-6"
                                                onClick={() => animation.play()}
                                            >
                                                <Play className="h-3 w-3" />
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background hover:bg-accent h-6 w-6"
                                                onClick={() => animation.reverse()}
                                            >
                                                <Rewind className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-muted-foreground">
                                        Duration: {typeof animation.currentTime === 'number' ? animation.currentTime.toFixed(2) : '0.00'}ms
                                    </div>
                                </div>
                            ))}
                            {animations.length === 0 && (
                                <p className="text-xs text-muted-foreground">No animations found</p>
                            )}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const AccessibilityInspector = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    hooks.useElementSelector({
        isActive,
        onSelect: (element: HTMLElement) => {
            setSelectedElement(element);
            setIsActive(false);
        },
        selectedElement
    });
    hooks.useElementHighlight(selectedElement, '2px solid #2563eb');
    const getAccessibilityInfo = (element: HTMLElement) => {
        const role = element.getAttribute('role');
        const ariaLabel = element.getAttribute('aria-label');
        const ariaDescribedby = element.getAttribute('aria-describedby');
        const ariaLabelledby = element.getAttribute('aria-labelledby');
        const tabIndex = element.getAttribute('tabindex');
        const isHidden = element.getAttribute('aria-hidden');
        const isDisabled = element.hasAttribute('disabled');
        const isRequired = element.hasAttribute('required');
        return {
            role,
            ariaLabel,
            ariaDescribedby,
            ariaLabelledby,
            tabIndex,
            isHidden,
            isDisabled,
            isRequired
        };
    };
    if (process.env.NODE_ENV === 'production') return null;
    const a11yInfo = selectedElement ? getAccessibilityInfo(selectedElement) : null;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Badge
                    className="flex items-center gap-1 cursor-pointer w-full"
                    variant={!!selectedElement ? "destructive" : "outline"}
                >
                    <div className="flex items-center gap-1 flex-1">
                        <Accessibility size={14} />
                        <span className="truncate">
                            {selectedElement
                                ? a11yInfo?.role || 'No role'
                                : 'Accessibility'
                            }
                        </span>
                    </div>
                    <ChevronRight size={14} />
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[300px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <div className="p-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Accessibility Inspector</h3>
                        {selectedElement ? (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => {
                                    setSelectedElement(null);
                                    setIsActive(true);
                                }}
                            >
                                Change Element
                            </button>
                        ) : (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => setIsActive(true)}
                            >
                                Select Element
                            </button>
                        )}
                    </div>
                    {isActive && (
                        <p className="text-xs text-muted-foreground mb-4">Click on an element to inspect its accessibility attributes</p>
                    )}
                    {a11yInfo && (
                        <div className="space-y-2">
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Role:</span>
                                    <span>{a11yInfo.role || 'none'}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Aria Label:</span>
                                    <span>{a11yInfo.ariaLabel || 'none'}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Described by:</span>
                                    <span>{a11yInfo.ariaDescribedby || 'none'}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Labelled by:</span>
                                    <span>{a11yInfo.ariaLabelledby || 'none'}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Tab Index:</span>
                                    <span>{a11yInfo.tabIndex || 'none'}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Hidden:</span>
                                    <span>{a11yInfo.isHidden || 'false'}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Disabled:</span>
                                    <span>{a11yInfo.isDisabled.toString()}</span>
                                </div>
                            </div>
                            <div className="text-xs p-1 hover:bg-accent rounded">
                                <div className="flex items-start gap-2">
                                    <span className="font-medium min-w-[100px]">Required:</span>
                                    <span>{a11yInfo.isRequired.toString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
const ComponentPropsInspector = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [componentInfo, setComponentInfo] = useState<ComponentInfo | null>(null);
    hooks.useElementSelector({
        isActive,
        onSelect: (element: HTMLElement) => {
            setSelectedElement(element);
            const reactInstance = utils.dom.findReactInstance(element);
            if (reactInstance) {
                setComponentInfo({
                    name: reactInstance.name,
                    props: utils.dom.getComponentProps(reactInstance),
                    element
                });
            }
            setIsActive(false);
        },
        selectedElement
    });
    hooks.useElementHighlight(selectedElement, '2px solid #2563eb');
    if (process.env.NODE_ENV === 'production') return null;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Badge
                    className="flex items-center gap-1 cursor-pointer w-full"
                    variant={!!selectedElement ? "destructive" : "outline"}
                >
                    <div className="flex items-center gap-1 flex-1">
                        <Box size={14} />
                        <span className="truncate">
                            {selectedElement
                                ? `${componentInfo?.name || 'Component'}`
                                : 'Props Inspector'
                            }
                        </span>
                    </div>
                    <ChevronRight size={14} />
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="w-[300px]"
                sideOffset={15}
                onPointerDownOutside={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <div className="p-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Component Props</h3>
                        {selectedElement ? (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => {
                                    setSelectedElement(null);
                                    setComponentInfo(null);
                                    setIsActive(true);
                                }}
                            >
                                Change Element
                            </button>
                        ) : (
                            <button
                                className="inline-flex items-center justify-center rounded-xl text-sm font-medium bg-background border hover:bg-accent h-9 px-3"
                                onClick={() => setIsActive(true)}
                            >
                                Select Element
                            </button>
                        )}
                    </div>
                    {isActive && (
                        <p className="text-xs text-muted-foreground mb-4">Click on an element to inspect its props</p>
                    )}
                    {componentInfo && (
                        <div className="space-y-2 max-h-[300px] overflow-auto">
                            {Object.entries(componentInfo.props).map(([key, value]) => (
                                <div key={key} className="text-xs p-1 hover:bg-accent rounded">
                                    <div className="flex items-start gap-2">
                                        <span className="font-medium min-w-[100px]">{key}:</span>
                                        <PropValue value={value} />
                                    </div>
                                </div>
                            ))}
                            {Object.keys(componentInfo.props).length === 0 && (
                                <p className="text-xs text-muted-foreground">No props found</p>
                            )}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
interface CategorySectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}
const CategorySection: React.FC<CategorySectionProps> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-t pt-2 first:border-t-0 first:pt-0">
            <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-sm font-medium">{title}</h3>
                <ChevronDown
                    size={16}
                    className={cn('transition-transform', {
                        'transform rotate-180': isOpen
                    })}
                />
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export const DevTools = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProduction, setIsProduction] = useState(true);
    const {
        componentInspectorActive,
        setComponentInspectorActive,
        bordersActive,
        setBordersActive,
        gridActive,
        setGridActive,
        gridSettings
    } = useDevToolsStore();

    useEffect(() => {
        setIsProduction(process.env.NODE_ENV === 'production');
    }, []);

    useEffect(() => {
        if (bordersActive) {
            document.body.classList.add('debug-borders');
            const styleEl = document.createElement('style');
            styleEl.id = 'debug-borders-style';
            styleEl.textContent = `
                .debug-borders * {
                    outline: 1px solid rgba(255, 0, 0, 0.2) !important;
                }
            `;
            document.head.appendChild(styleEl);
        }
        return () => {
            document.body.classList.remove('debug-borders');
            const styleEl = document.getElementById('debug-borders-style');
            if (styleEl) styleEl.remove();
        };
    }, [bordersActive]);

    useEffect(() => {
        updateGridOverlay(gridActive, gridSettings);
        return () => {
            const existingGrid = document.getElementById('debug-grid-overlay');
            if (existingGrid) {
                existingGrid.remove();
            }
        };
    }, [gridActive, gridSettings]);

    if (isProduction) return null;
    return (
        <TooltipProvider>
            <div data-devtools>
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="fixed top-2 left-2 z-[100] mt-4"
                >
                    <div className="relative flex items-center gap-1">
                        <CollapsibleTrigger asChild>
                            <Badge
                                variant="destructive"
                                className="flex items-center gap-1 cursor-pointer justify-between"
                            >
                                <div className="flex items-center gap-1">
                                    <Bug size={16} />
                                    {isOpen ? 'DevTools' : ''}
                                </div>
                            </Badge>
                        </CollapsibleTrigger>
                        <div className="flex items-center gap-1">
                            {componentInspectorActive && (
                                <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center">
                                    <Box size={10} />
                                </Badge>
                            )}
                            {bordersActive && (
                                <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center">
                                    <Bug size={10} />
                                </Badge>
                            )}
                            {gridActive && (
                                <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center">
                                    <Grid3X3 size={10} />
                                </Badge>
                            )}
                        </div>
                    </div>
                    {isOpen && (
                        <CollapsibleContent className="mt-2 flex flex-col gap-2 p-2 bg-background rounded-xl border w-[200px]">
                            <CategorySection title="Performance Essentials" defaultOpen={true}>
                                <div className="flex flex-col gap-1">
                                    <PerformanceMonitor />
                                    <PerformanceMetrics />
                                    <PageLoadMonitor />
                                    <NetworkMonitor />
                                </div>
                            </CategorySection>
                            <CategorySection title="Visual Debugging" defaultOpen={true}>
                                <div className="flex flex-col gap-1">
                                    <ComponentInspector active={componentInspectorActive} onToggle={setComponentInspectorActive} />
                                    <BorderToggle active={bordersActive} onToggle={setBordersActive} />
                                    <GridToggle active={gridActive} onToggle={setGridActive} />
                                    <ComponentPropsInspector />
                                    <ColorEditor />
                                    <AnimationInspector />
                                    <AccessibilityInspector />
                                    <BreakpointIndicator />
                                    <ScreenSize />
                                    <OverflowInspector />
                                </div>
                            </CategorySection>
                            <CategorySection title="Resource Monitoring" defaultOpen={false}>
                                <div className="flex flex-col gap-1">
                                    <MemoryMonitor />
                                    <StorageMonitor />
                                    <CookieMonitor />
                                </div>
                            </CategorySection>
                            <CategorySection title="Navigation" defaultOpen={false}>
                                <div className="flex flex-col gap-1">
                                    <RouteInspector />
                                    <HistoryMonitor />
                                    <ColorSchemeMonitor />
                                </div>
                            </CategorySection>
                            <CategorySection title="User Interaction" defaultOpen={false}>
                                <div className="flex flex-col gap-1">
                                    <EventMonitor />
                                    <KeyboardMonitor />
                                    <MouseMonitor />
                                </div>
                            </CategorySection>
                        </CollapsibleContent>
                    )}
                </Collapsible>
            </div>
        </TooltipProvider>
    );
};
