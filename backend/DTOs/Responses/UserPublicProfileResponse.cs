using backend.Enums;

namespace backend.DTOs.Responses
{
    public sealed record UserPublicProfileResponse
    {
        public Guid Id { get; init; }
        public string UserName { get; init; } = string.Empty;
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;
        public string? AvatarUrl { get; init; }
        public UserStatus Status { get; init; }
        public DateTime CreatedAt { get; init; }
        public double? Rank { get; init; }
        public int TotalMatches { get; init; }
        public int Wins { get; init; }
        public int Losses { get; init; }
        public int Draws { get; init; }
        public double WinRate { get; init; }
        public List<MatchHistoryResponse> RecentMatches { get; init; } = [];
    }
}
