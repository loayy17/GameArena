import { TCustomDividerProps } from "./def/T_dvider";

function CustomDivider({ title }: TCustomDividerProps) {
    return (
        <div className="relative mb-8 mt-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-bg-card px-4 text-text-secondary">
                    {title || "Or"}
                </span>
            </div>
        </div>
    );
}

export default CustomDivider;