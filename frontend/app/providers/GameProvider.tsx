"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import { useConnections } from "@/app/providers/ConnectionProvider";
import { gameService } from "@/services/def/GameService";
import { GAMES_BY_TYPE, PLAY_AGAIN_TIMEOUT_MS } from "@/domain/constant/games";
import { SETTING_STORAGE_KEY } from "@/domain/constant/settings";
import { BotDifficultyEnum } from "@/domain/enum/BotDifficultyEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { IProviderProps } from "./def/IProviders";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IGameState } from "./def/IGameState";
import type { IGameContext } from "./def/IGameContext";

const GameContext = createContext<TNullable<IGameContext>>(null);

function readStoredBotDifficulty(): BotDifficultyEnum {
    if (typeof window === "undefined") return BotDifficultyEnum.Medium;
    const raw = Number(
        window.localStorage.getItem(SETTING_STORAGE_KEY.botDifficulty),
    );
    return raw === BotDifficultyEnum.Easy || raw === BotDifficultyEnum.Hard
        ? raw
        : BotDifficultyEnum.Medium;
}

export function GameProvider({ children }: IProviderProps) {
    const { isGameConnected } = useConnections();
    const t = useGameTranslation();
    const [state, setState] = useState<TNullable<IGameState>>(null);
    const [isSearching, setIsSearching] = useState(false);
    const isSearchingRef = useRef(false);
    const [searchError, setSearchError] = useState<TNullable<string>>(null);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [lastGameType, setLastGameType] =
        useState<TNullable<GamesKindEnum>>(null);
    const [botDifficulty, setBotDifficultyState] = useState<BotDifficultyEnum>(
        readStoredBotDifficulty,
    );
    const botDifficultyRef = useRef(botDifficulty);
    const [pendingPlayAgainRequest, setPendingPlayAgainRequest] =
        useState<TNullable<{ requesterId: string; requesterUsername: string }>>(
            null,
        );
    const [requestedPlayAgain, setRequestedPlayAgain] = useState(false);
    const [playAgainTimedOut, setPlayAgainTimedOut] = useState(false);
    const router = useRouter();

    const clearFlags = useCallback(() => {
        isSearchingRef.current = false;
        setIsSearching(false);
        setSearchError(null);
        setOpponentDisconnected(false);
        setPendingPlayAgainRequest(null);
        setRequestedPlayAgain(false);
        setPlayAgainTimedOut(false);
    }, []);

    const goToLobby = useCallback(() => {
        setState(null);
        clearFlags();
        router.push("/games");
    }, [router, clearFlags]);

    useEffect(() => {
        const offState = gameService.onGameState((value) => {
            setState(value);
            clearFlags();
        });

        const offDisconnect = gameService.onOpponentDisconnect(() => {
            setOpponentDisconnected(true);
            setPendingPlayAgainRequest(null);
            setRequestedPlayAgain(false);
        });

        const offPlayAgainReq = gameService.onPlayAgainRequest((data) => {
            setPendingPlayAgainRequest(data);
        });

        const offPlayAgainRes = gameService.onPlayAgainResponse((data) => {
            setRequestedPlayAgain(false);
            if (!data.accepted) {
                goToLobby();
            }
        });

        return () => {
            offState();
            offDisconnect();
            offPlayAgainReq();
            offPlayAgainRes();
        };
    }, [goToLobby, clearFlags]);

    const activeRoomId = state?.roomId ?? null;
    const lastRoomRef = useRef<TNullable<string>>(null);

    useEffect(() => {
        const previous = lastRoomRef.current;
        lastRoomRef.current = activeRoomId;
        if (!activeRoomId || activeRoomId === previous) return;
        const config = GAMES_BY_TYPE[state?.gameType as GamesKindEnum];
        if (!config) return;
        router.push(`/games/${config.path}`);
    }, [activeRoomId, state?.gameType, router]);

    const setBotDifficulty = useCallback((difficulty: BotDifficultyEnum) => {
        botDifficultyRef.current = difficulty;
        setBotDifficultyState(difficulty);
        if (typeof window !== "undefined")
            window.localStorage.setItem(
                SETTING_STORAGE_KEY.botDifficulty,
                String(difficulty),
            );
    }, []);

    const findMatch = useCallback(
        async (game: GamesKindEnum) => {
            if (isSearchingRef.current) return;
            setState(null);
            clearFlags();
            isSearchingRef.current = true;
            setLastGameType(game);
            setSearchError(null);
            setIsSearching(true);
            try {
                await gameService.findMatch(game, botDifficultyRef.current);
            } catch {
                isSearchingRef.current = false;
                setIsSearching(false);
                setSearchError(t.lobby.searchError);
            }
        },
        [clearFlags, t.lobby.searchError],
    );

    const startGame = useCallback(
        async (friendId: TNullable<string>, gameKind: GamesKindEnum) => {
            setLastGameType(gameKind);
            await gameService.startGame(friendId, gameKind);
        },
        [],
    );

    const inviteFriend = useCallback(
        async (friendId: string, game: GamesKindEnum) => {
            await gameService.inviteFriend(
                friendId,
                game,
                botDifficultyRef.current,
            );
        },
        [],
    );

    const inviteToRoom = useCallback(async (friendId: string) => {
        await gameService.inviteToRoom(friendId);
    }, []);

    const leaveGame = useCallback(async () => {
        try {
            await gameService.leaveGame();
        } catch {}
        goToLobby();
    }, [goToLobby]);

    const requestPlayAgain = useCallback(async () => {
        setRequestedPlayAgain(true);
        setPlayAgainTimedOut(false);
        try {
            await gameService.requestPlayAgain();
        } catch {
            setRequestedPlayAgain(false);
        }
    }, []);

    useEffect(() => {
        if (!requestedPlayAgain) return;
        const timer = setTimeout(() => {
            setRequestedPlayAgain(false);
            setPlayAgainTimedOut(true);
        }, PLAY_AGAIN_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [requestedPlayAgain]);

    const respondPlayAgain = useCallback(
        async (accept: boolean) => {
            try {
                await gameService.respondPlayAgain(accept);
                setPendingPlayAgainRequest(null);
                if (!accept) goToLobby();
            } catch {}
        },
        [goToLobby],
    );

    const resetGame = useCallback(async () => {
        try {
            if (isSearching) await gameService.cancelSearch();
        } catch {}
        try {
            await gameService.leaveGame();
        } catch {}
        goToLobby();
    }, [goToLobby, isSearching]);

    const createLobby = useCallback(
        async (gameKind: GamesKindEnum) => {
            setLastGameType(gameKind);
            try {
                await gameService.createLobby(
                    gameKind,
                    botDifficultyRef.current,
                );
            } catch {
                setSearchError(t.lobby.createLobbyError);
            }
        },
        [t.lobby.createLobbyError],
    );

    const sendAction = useCallback((action: object) => {
        void gameService.sendAction(action).catch(() => {});
    }, []);

    const value = useMemo<IGameContext>(
        () => ({
            state,
            isConnected: isGameConnected,
            isSearching,
            searchError,
            opponentDisconnected,
            lastGameType,
            botDifficulty,
            setBotDifficulty,
            pendingPlayAgainRequest,
            requestedPlayAgain,
            playAgainTimedOut,
            findMatch,
            startGame,
            inviteFriend,
            inviteToRoom,
            leaveGame,
            requestPlayAgain,
            respondPlayAgain,
            resetGame,
            createLobby,
            sendAction,
        }),
        [
            state,
            isGameConnected,
            isSearching,
            searchError,
            opponentDisconnected,
            pendingPlayAgainRequest,
            requestedPlayAgain,
            playAgainTimedOut,
            lastGameType,
            botDifficulty,
            setBotDifficulty,
            findMatch,
            startGame,
            inviteFriend,
            inviteToRoom,
            leaveGame,
            requestPlayAgain,
            respondPlayAgain,
            resetGame,
            createLobby,
            sendAction,
        ],
    );

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used inside GameProvider");
    return context;
}
