"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/cn";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { GButton } from "./GButton";

import type {
    IGSliderMenuProps,
    IGSliderMenuHeaderProps,
    IGSliderPanel,
    ISliderMenuNavigation,
} from "./def/GSliderMenu";

export type {
    IGSliderMenuProps,
    IGSliderMenuHeaderProps,
    IGSliderPanel,
    ISliderMenuNavigation,
};

function GSliderMenu({
    panels,
    backLabel = "Back",
    className,
}: IGSliderMenuProps) {
    const [view, setView] = useState({
        id: panels[0]?.id ?? "",
        direction: "forward" as "forward" | "back",
        history: [] as string[],
    });
    const [height, setHeight] = useState<number | undefined>();
    const panelRef = useRef<HTMLDivElement | null>(null);

    const activePanel =
        panels.find((panel) => panel.id === view.id) ?? panels[0];

    const navigate = useCallback(
        (panelId: string) => {
            if (!panels.some((p) => p.id === panelId)) return;
            setView((current) =>
                current.id === panelId
                    ? current
                    : {
                          id: panelId,
                          direction: "forward",
                          history: [...current.history, current.id],
                      },
            );
        },
        [panels],
    );

    const back = useCallback(() => {
        setView((current) => {
            const previousId = current.history[current.history.length - 1];
            if (!previousId) return current;
            return {
                id: previousId,
                direction: "back",
                history: current.history.slice(0, -1),
            };
        });
    }, []);

    useEffect(() => {
        if (!panels.length || panels.some((p) => p.id === view.id)) return;
        const timer = setTimeout(
            () =>
                setView({
                    id: panels[0].id,
                    direction: "forward",
                    history: [],
                }),
            0,
        );
        return () => clearTimeout(timer);
    }, [panels, view.id]);

    useLayoutEffect(() => {
        const element = panelRef.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            setHeight(
                entry.borderBoxSize[0]?.blockSize ?? element.offsetHeight,
            );
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [view.id]);

    if (!activePanel)
        return <div className={cn("relative overflow-hidden", className)} />;

    const renderedContent =
        typeof activePanel.content === "function"
            ? activePanel.content({
                  navigate,
                  back,
                  canGoBack: view.history.length > 0,
                  backLabel,
              })
            : activePanel.content;

    return (
        <div
            className={cn(
                "relative overflow-hidden transition-[height] duration-300 ease-out",
                className,
            )}
            style={height ? { height: `${height}px` } : undefined}
        >
            <div
                key={activePanel.id}
                ref={panelRef}
                className={cn(
                    "w-full",
                    view.direction === "back"
                        ? "animate-slide-in-start"
                        : "animate-slide-in-end",
                )}
            >
                {renderedContent}
            </div>
        </div>
    );
}

function GSliderMenuHeader({
    title,
    onBack,
    backLabel = "Back",
    className,
}: IGSliderMenuHeaderProps) {
    return (
        <div className={cn("flex min-w-0 items-center gap-2 py-1", className)}>
            {onBack && (
                <GButton
                    icon={ChevronLeft}
                    label={backLabel}
                    variant={ButtonVariantEnum.Subtle}
                    size={SizeEnum.icon}
                    aria-label={backLabel}
                    onClick={onBack}
                    className="shrink-0"
                />
            )}
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-text">
                {title}
            </h3>
        </div>
    );
}

export { GSliderMenu, GSliderMenuHeader };

