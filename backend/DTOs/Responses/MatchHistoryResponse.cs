using backend.Enums;

namespace backend.DTOs.Responses
{
    public class MatchHistoryResponse
    {
        public Guid Id { get; init; }

        public DateTime CompletedAt { get; set; }
        public bool IsWinner { get; set; }
        public MatchStatus Result { get; set; }
        public UserSummaryResponse Opponent { get; set; } = null!;
        public GamesKind Kind { get; set; }
        public int Player1Score { get; set; }
        public int Player2Score { get; set; }
    }
}