using backend.Enums;

namespace backend.DTOs.Responses;

public sealed record MatchHistoryResponse
{
    public Guid Id { get; init; }
    public DateTime CompletedAt { get; init; }
    public MatchStatus Result { get; init; }
    public UserSummaryResponse Opponent { get; init; } = null!;
    public GamesKind Kind { get; init; }
    public int Player1Score { get; init; }
    public int Player2Score { get; init; }
}
