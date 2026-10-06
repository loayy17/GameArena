"use client";

import { Crown, Zap, Bot } from "lucide-react";

import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GAlert } from "@/component/common/GAlert";
import { GIcon } from "@/component/common/GIcon";
import { getGameConfig, translateGameInfo } from "@/domain/constant/games";
import { botDifficultyLabel } from "@/domain/lib/botDifficulty";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { DIFFICULTY_LEVELS } from "@/domain/constant/games";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GameInstruction } from "./GameInstruction";

import type { IGameEntryProps } from "./def/GameEntry";

function GameEntry({ gameType }: IGameEntryProps) {
    const {
        findMatch,
        createLobby,
        searchError,
        botDifficulty,
        setBotDifficulty,
    } = useGame();
    const t = useGameTranslation();
    const { name: gameName, description: gameDescription } = translateGameInfo(
        t,
        gameType,
    );
    const gameConfig = getGameConfig(gameType);

    return (
        <div className="flex items-center justify-center min-h-37.5 p-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-4">
                    <GIcon
                        icon={gameConfig.icon}
                        variant="tile"
                        size={SizeEnum.xl}
                        gradient={gameConfig.tileGradient}
                        className="mx-auto"
                    />
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-text tracking-tight">
                            {gameName}
                        </h1>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            {gameDescription}
                        </p>
                    </div>
                </div>

                {searchError && (
                    <GAlert severity={AccentColorEnum.Danger}>
                        {searchError}
                    </GAlert>
                )}

                <div className="space-y-2 text-start">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                        <GIcon icon={Bot} size={SizeEnum.sm} />
                        {t.lobby.difficulty}
                    </label>
                    <div
                        className="grid grid-cols-3 gap-2"
                        role="group"
                        aria-label={t.lobby.difficulty}
                    >
                        {DIFFICULTY_LEVELS.map((level) => (
                            <GButton
                                key={level}
                                size={SizeEnum.sm}
                                variant={
                                    botDifficulty === level
                                        ? ButtonVariantEnum.Primary
                                        : ButtonVariantEnum.Secondary
                                }
                                aria-pressed={botDifficulty === level}
                                onClick={() => setBotDifficulty(level)}
                            >
                                {botDifficultyLabel(t, level)}
                            </GButton>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <GButton
                        className="w-full"
                        onClick={() => findMatch(gameType)}
                        size={SizeEnum.lg}
                        startIcon={<GIcon icon={Zap} size={SizeEnum.md} />}
                    >
                        {t.lobby.quick}
                    </GButton>
                    <GButton
                        className="w-full"
                        onClick={() => createLobby(gameType)}
                        size={SizeEnum.lg}
                        variant={ButtonVariantEnum.Secondary}
                        startIcon={<GIcon icon={Crown} size={SizeEnum.md} />}
                    >
                        {t.lobby.invite}
                    </GButton>
                </div>

                <GameInstruction gameType={gameType} />
            </div>
        </div>
    );
}

export { GameEntry };
