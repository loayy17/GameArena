import { BotDifficultyEnum } from "../enum/BotDifficultyEnum";

type TDifficultyLabels = {
    lobby: { difficultyLevels: { easy: string; medium: string; hard: string } };
};

function botDifficultyLabel(
    t: TDifficultyLabels,
    level?: BotDifficultyEnum,
): string {
    switch (level) {
        case BotDifficultyEnum.Easy:
            return t.lobby.difficultyLevels.easy;
        case BotDifficultyEnum.Hard:
            return t.lobby.difficultyLevels.hard;
        default:
            return t.lobby.difficultyLevels.medium;
    }
}

export { botDifficultyLabel };

