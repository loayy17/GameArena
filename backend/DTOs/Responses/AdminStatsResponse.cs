namespace backend.DTOs.Responses
{
    public sealed record AdminStatsResponse
    {
        public int TotalUsers { get; init; }
        public int OnlineUsers { get; init; }
        public int OfflineUsers { get; init; }
        public int InGameUsers { get; init; }
        public int BannedUsers { get; init; }
    }
}
