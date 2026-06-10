using backend.Domain;

namespace backend.Services.Interface
{
    public interface IUserService
    {
        public Task<User?> GetUserByIdAsync(Guid userId);
        public Task<List<User>?> GetAllUsersAsync();
        public Task<List<User>?> GetUserFriends(Guid userId);

    }
}
