using backend.Enums;
using backend.Services.Interface;
using System.Collections.Concurrent;

namespace backend.Services
{
    public class UserPresenceService : IUserPresenceService
    {
        private readonly ConcurrentDictionary<string, (UserStatus Status, int Connections)> _state = new();

        public UserStatus GetStatus(string userId) =>
            _state.TryGetValue(userId, out var s) ? s.Status : UserStatus.Offline;

        public bool AddConnection(string userId) =>
            _state.AddOrUpdate(
                userId,
                _ => (UserStatus.Online, 1),
                (_, old) => (old.Status, old.Connections + 1)
            ).Connections == 1;

        public bool RemoveConnection(string userId)
        {
            while (_state.TryGetValue(userId, out var current) && current.Connections > 0)
            {
                if (current.Connections == 1)
                    return _state.TryRemove(new KeyValuePair<string, (UserStatus, int)>(userId, current));

                if (_state.TryUpdate(userId, (current.Status, current.Connections - 1), current))
                    return false;
            }
            return false;
        }

        public bool SetActivity(string userId, UserStatus status)
        {
            if (status is not (UserStatus.Online or UserStatus.InGame)) return false;

            while (_state.TryGetValue(userId, out var current) && current.Connections > 0)
            {
                if (_state.TryUpdate(userId, (status, current.Connections), current))
                    return true;
            }
            return false;
        }

        public bool HasOtherConnections(string userId) =>
            _state.TryGetValue(userId, out var s) && s.Connections > 1;

        public (int Online, int InGame) GetOnlineCounts()
        {
            var online = 0;
            var inGame = 0;
            foreach (var entry in _state.Values)
            {
                if (entry.Status == UserStatus.InGame) inGame++;
                else if (entry.Status == UserStatus.Online) online++;
            }
            return (online, inGame);
        }
    }
}
