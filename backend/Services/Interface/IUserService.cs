using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IUserService
    {
        Task<UserResponse> GetUserByIdAsync(Guid userId);
        Task<List<UserResponse>> GetUsers(Guid currentUserId, UserFilterRequest? filter);

    }
}
