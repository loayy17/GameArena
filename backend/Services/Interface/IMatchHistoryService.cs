using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Services.Interface
{
    public interface IMatchHistoryService
    {
        Task<List<MatchHistoryResponse>> GetMatchHistoryByUserIdAsync(Guid userId);
        Task SaveMatchHistoryAsync(string roomId, GamesKind gameType, Guid player1Id, Guid player2Id, int player1Score, int player2Score);
    }
}
