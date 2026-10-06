import type { ReactNode } from "react";

interface ISliderMenuNavigation {
    navigate: (panelId: string) => void;
    back: () => void;
    canGoBack: boolean;
    backLabel?: string;
}

interface IGSliderPanel {
    id: string;
    label?: string;
    content: ReactNode | ((nav: ISliderMenuNavigation) => ReactNode);
}

interface IGSliderMenuProps {
    panels: IGSliderPanel[];
    backLabel?: string;
    className?: string;
}

interface IGSliderMenuHeaderProps {
    title: string;
    onBack?: () => void;
    backLabel?: string;
    className?: string;
}

export type {
    IGSliderMenuProps,
    IGSliderMenuHeaderProps,
    IGSliderPanel,
    ISliderMenuNavigation,
};

