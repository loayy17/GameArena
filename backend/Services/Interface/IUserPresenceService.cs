using backend.Enums;

namespace backend.Services.Interface
{
    public interface IUserPresenceService
    {
        UserStatus GetStatus(string userId);
        void SetOnline(string userId);
        void SetOffline(string userId);
        void SetInGame(string userId);
    }
}
