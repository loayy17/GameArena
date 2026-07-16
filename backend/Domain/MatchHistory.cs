using backend.Enums;

namespace backend.Domain
{
    public class MatchHistory
    {
        public Guid Id { get; set; }
        public string RoomId { get; set; } = string.Empty;
        public GamesKind GameType { get; set; }
        public Guid? Player1Id { get; set; }
        public User Player1 { get; set; } = null!;
        public Guid? Player2Id { get; set; }
        public User Player2 { get; set; } = null!;
        public int Player1Score { get; set; }
        public int Player2Score { get; set; }
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}
