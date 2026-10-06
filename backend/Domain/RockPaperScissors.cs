using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class RockPaperScissors : BaseGameRoom
{
    private const string ActionMakeMove = "MAKE_MOVE";
    private static readonly string[] Choices = ["Rock", "Paper", "Scissors"];
    private readonly int[] _humanChoiceCounts = new int[Choices.Length];
    private int _lastHumanChoice = -1;
    public RockPaperScissors() : base(GamesKind.RockPaperScissors) { }
    public string? Player1Choice { get; set; }
    public string? Player2Choice { get; set; }

    protected override object GetStatePayloadCore()
    {
        var payload = GetBasePayload();
        payload["winScore"] = 1;
        payload["boardWidth"] = 1;
        payload["boardHeight"] = 1;
        payload["tickRateHz"] = 0;
        payload["player1Choice"] = Player1Choice;
        payload["player2Choice"] = Player2Choice;
        return payload;
    }

    protected override void ResetForNewRoundCore()
    {
        base.ResetForNewRoundCore();
        Player1Choice = null;
        Player2Choice = null;
    }

    protected override void HandleActionCore(string playerId, JsonElement action)
    {
        if (WinnerPlayerId != null
            || !IsFull
            || playerId != CurrentTurnPlayerId
            || !IsSeated(playerId)
            || !TryReadChoice(action, out var choice))
            return;
        if (playerId == Player1Id)
        {
            Player1Choice = choice;
            CurrentTurnPlayerId = Player2Id;
        }
        else
        {
            Player2Choice = choice;
            SettleRound();
        }

        RememberHumanChoice(playerId, choice);
    }

    protected override void MakeBotMoveCore()
    {
        if (!IsBotGame || IsFinished || !HasStarted) return;

        var botId = GetBotId();
        if (botId == null) return;
        var choice = Choices[PickChoice()];
        if (botId == Player1Id)
        {
            Player1Choice = choice;
            CurrentTurnPlayerId = Player2Id;
            return;
        }
        Player2Choice = choice;
        SettleRound();
    }

    private int PickChoice() => BotDifficulty switch
    {
        BotDifficulty.Easy => RandomHelper.Index(Choices.Length),
        BotDifficulty.Medium => _lastHumanChoice >= 0 && RandomHelper.CoinFlip()
            ? CounterOf(_lastHumanChoice)
            : RandomHelper.Index(Choices.Length),
        _ => CounterOf(MostFrequentHumanChoice()),
    };

    private void SettleRound()
    {
        if (Player1Choice == Player2Choice)
        {
            CompleteRound("");
            return;
        }

        int player1 = Array.IndexOf(Choices, Player1Choice);
        int player2 = Array.IndexOf(Choices, Player2Choice);
        CompleteRound(CounterOf(player2) == player1 ? Player1Id : Player2Id);
    }

    private void RememberHumanChoice(string playerId, string choice)
    {
        if (IsBot(playerId)) return;
        var index = Array.IndexOf(Choices, choice);
        if (index < 0) return;
        _humanChoiceCounts[index]++;
        _lastHumanChoice = index;
    }

    private int MostFrequentHumanChoice() =>
        _humanChoiceCounts.Sum() == 0 ? RandomHelper.Index(Choices.Length) : Array.IndexOf(_humanChoiceCounts, _humanChoiceCounts.Max());
    private static int CounterOf(int humanIndex) => (humanIndex + 1) % Choices.Length;
    private bool IsSeated(string playerId) => playerId == Player1Id || playerId == Player2Id;
    private static bool TryReadChoice(JsonElement action, out string choice)
    {
        choice = string.Empty;

        if (action.ValueKind != JsonValueKind.Object
            || !action.TryGetProperty("type", out var typeProp)
            || typeProp.GetString() != ActionMakeMove
            || !action.TryGetProperty("choice", out var choiceProp))
            return false;

        choice = choiceProp.GetString() ?? string.Empty;
        return Choices.Contains(choice);
    }
}
