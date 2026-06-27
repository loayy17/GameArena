"use client";
import { useTranslation } from "@/Hooks/useTranslation";
import { ar } from "./i18n/ar.i18n";
import { en, type TProfileTranslation } from "./i18n/en.i18n";

function Profile() {
  const t = useTranslation({ en, ar }) as TProfileTranslation;
  return (
    <div className="flex items-center justify-center h-full relative z-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text mb-2">{t.title}</h1>
        <p className="text-text-muted text-sm">{t.comingSoon}</p>
      </div>
    </div>
  );
}

export default Profile;
