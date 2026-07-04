using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IUserService
    {
        Task<UserResponse> GetUserByIdAsync(Guid userId);
        Task<List<UserResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter);

    }
}
