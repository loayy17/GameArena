using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IUserService
    {
        Task<UserResponse> GetUserByIdAsync(Guid userId);
        Task<UserPublicProfileResponse> GetUserProfileAsync(Guid userId, Guid viewerId);
        Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter);
        Task<UserResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword);
        Task<string?> GetPreferencesAsync(Guid userId);
        Task UpdatePreferencesAsync(Guid userId, string preferencesJson);
        Task UpdateRanksAsync(Guid player1Id, Guid player2Id, int player1Score, int player2Score);
        Task<UserResponse> UpdateAvatarAsync(Guid userId, IFormFile file);
        Task<UserResponse> RemoveAvatarAsync(Guid userId);
        Task<(byte[] Bytes, string ContentType)?> GetAvatarAsync(Guid userId);
    }
}
