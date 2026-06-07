using System.Collections.Concurrent;

namespace backend.Hubs
{
    public static class ConnectionManager
    {
        private static readonly ConcurrentDictionary<string, HashSet<string>> _connections = new();

        public static void Add(string userId, string connectionId)
        {
            _connections.TryAdd(userId, new HashSet<string>());
            _connections[userId].Add(connectionId);
        }

        public static void Remove(string userId, string connectionId)
        {
            if (_connections.TryGetValue(userId, out var list))
            {
                list.Remove(connectionId);
            }
        }

        public static IEnumerable<string> GetConnections(string userId)
        {
            return _connections.TryGetValue(userId, out var list)
                ? list
                : Enumerable.Empty<string>();
        }
    }
}