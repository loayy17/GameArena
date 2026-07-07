import type { TLocale } from "@/domain/type/TCommon";
import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import { matchGameMeta } from "@/domain/constant/match_history.config";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { GameId } from "@/domain/constant/games";

type TGameLabels = Record<GameId, string>;
type TResultLabels = Record<MatchResultEnum, string>;

function formatMatchDate(date: Date, locale: TLocale) {
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getGameName(game: GamesKindEnum, gameLabels: TGameLabels) {
  const { gameId } = matchGameMeta[game];
  return gameLabels[gameId];
}

function getResultLabel(result: MatchResultEnum, resultLabels: TResultLabels) {
  return resultLabels[result];
}

export {
  formatMatchDate,
  getGameName,
  getResultLabel,
  type TGameLabels,
  type TResultLabels,
};
