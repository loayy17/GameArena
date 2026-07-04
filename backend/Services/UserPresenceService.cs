using System.Collections.Concurrent;
using backend.Enums;
using backend.Services.Interface;

namespace backend.Services
{
    public class UserPresenceService : IUserPresenceService
    {
        private readonly ConcurrentDictionary<string, UserStatus> _presence = new();
        public UserStatus GetStatus(string userId)
        {
            return _presence.TryGetValue(userId, out var status) ? status : UserStatus.Offline;
        }

        public void SetOnline(string userId)
        {
            _presence[userId] = UserStatus.Online;
        }

        public void SetOffline(string userId)
        {
            _presence[userId] = UserStatus.Offline;
        }

        public void SetInGame(string userId)
        {
            _presence[userId] = UserStatus.InGame;
        }
    }
}
