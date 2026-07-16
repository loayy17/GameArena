"use client";

import { Users, Lock } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import type { GameInfo } from "./gameConfig";
import { GameTranslations } from "../i18n/Game/en.i18n";

interface GameEntryProps {
  gameInfo: GameInfo;
  t: GameTranslations;
  onQuickMatch: () => void;
  onCreatePrivate: () => void;
}

function GameEntry({ gameInfo, t, onQuickMatch, onCreatePrivate }: GameEntryProps) {
  return (
    <div className="flex items-center justify-center min-h-150 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-text-primary">{gameInfo.name}</h1>
          <p className="text-text-secondary text-sm">{gameInfo.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <GButton onClick={onQuickMatch} fullWidth size="lg" leftIcon={<GIcon icon={Users} size="md" color="inherit" />}>
            {t.lobby.quick}
          </GButton>
          <GButton onClick={onCreatePrivate} fullWidth size="lg" variant="secondary" leftIcon={<GIcon icon={Lock} size="md" color="inherit" />}>
            {t.lobby.invite}
          </GButton>
        </div>
      </div>
    </div>
  );
}

export { GameEntry };
