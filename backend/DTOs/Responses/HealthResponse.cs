namespace backend.DTOs.Responses
{
    public sealed record HealthResponse
    {
        public string Status { get; init; } = string.Empty;
        public string Service { get; init; } = string.Empty;
        public DateTime Timestamp { get; init; }
        public long UptimeSeconds { get; init; }
        public string Database { get; init; } = string.Empty;
    }
}
