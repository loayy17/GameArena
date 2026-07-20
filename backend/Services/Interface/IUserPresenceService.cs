using backend.Enums;

namespace backend.Services.Interface
{
    public interface IUserPresenceService
    {
        UserStatus GetStatus(string userId);
        bool AddConnection(string userId);bool RemoveConnection(string userId);
       bool SetActivity(string userId, UserStatus status);
    }
}
