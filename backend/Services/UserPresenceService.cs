using backend.Enums;
using backend.Services.Interface;

namespace backend.Services
{
    public class UserPresenceService : IUserPresenceService
    {
        private readonly Dictionary<string, UserStatus> _presence = new();
        private readonly Dictionary<string, int> _connectionCounts = new();
        private readonly object _lock = new();

        public UserStatus GetStatus(string userId)
        {
            lock (_lock)
            {
                return _presence.TryGetValue(userId, out var status) ? status : UserStatus.Offline;
            }
        }

        public bool AddConnection(string userId)
        {
            lock (_lock)
            {
                var count = _connectionCounts.GetValueOrDefault(userId, 0) + 1;
                _connectionCounts[userId] = count;

                if (count == 1)
                {
                    _presence[userId] = UserStatus.Online;
                    return true;
                }

                return false;
            }
        }

        public bool RemoveConnection(string userId)
        {
            lock (_lock)
            {
                var current = _connectionCounts.GetValueOrDefault(userId, 0);

                if (current <= 0)
                    return false;

                var count = current - 1;
                if (count <= 0)
                {
                    _connectionCounts.Remove(userId);
                    _presence.Remove(userId);
                    return true;
                }

                _connectionCounts[userId] = count;
                return false;
            }
        }

        public bool SetActivity(string userId, UserStatus status)
        {
            lock (_lock)
            {
                if (status != UserStatus.Online && status != UserStatus.InGame)
                    return false;
                if (_connectionCounts.GetValueOrDefault(userId, 0) <= 0)
                    return false;
                _presence[userId] = status;
                return true;
            }
        }
    }
}
