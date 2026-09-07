using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Services.Interface
{
    public interface IUserService
    {
        Task<UserResponse> GetUserByIdAsync(Guid userId);
        Task<UserPublicProfileResponse> GetUserProfileAsync(Guid userId, Guid viewerId);
        Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter);
        Task<List<AdminUserResponse>> GetUsersByAdminAsync(UserFilterRequest? filter);
        Task<AdminStatsResponse> GetStatsAsync();
        Task<string?> GetPreferencesAsync(Guid userId);
        Task<(byte[] Bytes, string ContentType)?> GetAvatarAsync(Guid userId);
        Task<UserResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
        Task UpdatePreferencesAsync(Guid userId, string preferencesJson);
        Task<UserResponse> UpdateAvatarAsync(Guid userId, IFormFile file);
        Task<UserResponse> RemoveAvatarAsync(Guid userId);
        Task UpdateRanksAsync(Guid player1Id, Guid player2Id, int player1Score, int player2Score);
        Task BanUserAsync(Guid actorId, Guid userId);
        Task UnbanUserAsync(Guid actorId, Guid userId);
        Task SetRoleAsync(Guid actorId, Guid userId, UserRole role);
        Task DeleteAccountAsync(Guid actorId, Guid targetId);
    }
}
