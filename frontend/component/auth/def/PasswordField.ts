import type { IGTextFieldProps } from "@/component/common/def/GTextField";

export type TPasswordFieldProps = Omit<IGTextFieldProps, "type" | "endAction" | "endIcon">;
