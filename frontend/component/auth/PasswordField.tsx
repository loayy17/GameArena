"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { useTranslation } from "@/hooks/useSetting";
import { en } from "@/component/i18n/GTextField/en.i18n";
import { ar } from "@/component/i18n/GTextField/ar.i18n";
import { fr } from "@/component/i18n/GTextField/fr.i18n";

import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import type { TPasswordFieldProps } from "./def/PasswordField";

function PasswordField({ ref, ...props }: TPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const t = useTranslation<GTextFieldTranslation>({ en, ar, fr });
  const toggleLabel = visible ? t.hidePassword : t.showPassword;

  return (
    <GTextField
      {...props}
      ref={ref}
      type={visible ? "text" : "password"}
      endAction={
        <GButton
          icon={visible ? EyeOff : Eye}
          label={toggleLabel}
          tooltipPosition="bottom"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        />
      }
    />
  );
}

export { PasswordField };
