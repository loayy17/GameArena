import { TButtonProps } from "./def/T_button";

function TButton({
    title,
    className,
    style,
    onClick,
    disabled
}: TButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full rounded-xl px-5 py-3 font-medium transition-all duration-200 active:scale-[0.98] ${className || "bg-primary text-white hover:bg-primary-hover"
                }`}
            style={style}
        >
            {title}
        </button>
    );
}

export default TButton;