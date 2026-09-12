using System.Text.Json;
using backend.Enums;

namespace backend.Domain
{
    public class RockPaperScissors : BaseGameRoom
    {
        public RockPaperScissors() : base(GamesKind.RockPaperScissors) { }
        private static readonly string[] Choices = ["Rock", "Paper", "Scissors"];
        public string? Player1Choice { get; set; }
        public string? Player2Choice { get; set; }

        protected override void ResetForNewRoundCore()
        {
            base.ResetForNewRoundCore();
            Player1Choice = null;
            Player2Choice = null;
        }

        protected override object GetStatePayloadCore()
        {
            var p = GetBasePayload();
            p["winScore"] = 1;
            p["boardWidth"] = 1;
            p["boardHeight"] = 1;
            p["tickRateHz"] = 0;
            p["player1Choice"] = Player1Choice;
            p["player2Choice"] = Player2Choice;
            return p;
        }

        protected override void HandleActionCore(string playerId, JsonElement action)
        {
            if (action.ValueKind != JsonValueKind.Object
                || !action.TryGetProperty("type", out var typeProp)
                || typeProp.GetString() != "MAKE_MOVE"
                || !action.TryGetProperty("choice", out var choiceProp))
                return;

            var choice = choiceProp.GetString();
            if (
                WinnerPlayerId != null
                || !IsFull
                || playerId != CurrentTurnPlayerId
                || (playerId != Player1Id && playerId != Player2Id)
                || !Choices.Contains(choice)
            )
                return;

            if (playerId == Player1Id)
            {
                Player1Choice = choice;
                CurrentTurnPlayerId = Player2Id;
            }
            else if (playerId == Player2Id)
            {
                Player2Choice = choice;
                DetermineWinner();
            }
        }

        protected override void MakeBotMoveCore()
        {
            if (!IsBotGame || IsFinished || !HasStarted) return;
            bool botIsP1 = Player1Id == "__BOT__";
            bool botIsP2 = Player2Id == "__BOT__";
            if (!botIsP1 && !botIsP2) return;
            var botChoice = Random.Shared.Next(3);
            if (botIsP1)
            {
                Player1Choice = Choices[botChoice];
                CurrentTurnPlayerId = Player2Id;
            }
            else if (botIsP2)
            {
                Player2Choice = Choices[botChoice];
                DetermineWinner();
            }
        }

        private void DetermineWinner()
        {
            if (Player1Choice == Player2Choice)
            {
                CompleteRound("");
                return;
            }

            if ((Player1Choice == "Rock" && Player2Choice == "Scissors") ||
                (Player1Choice == "Paper" && Player2Choice == "Rock") ||
                (Player1Choice == "Scissors" && Player2Choice == "Paper"))
            {
                CompleteRound(Player1Id);
            }
            else
            {
                CompleteRound(Player2Id);
            }
        }
    }
}
