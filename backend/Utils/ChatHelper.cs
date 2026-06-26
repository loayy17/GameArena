namespace backend.Utils
{
    public static class ChatHelper
    {
        public static string GetPrivateGroup(Guid userId1, Guid userId2)
        {
            return userId1.CompareTo(userId2) < 0
                ? $"pm:{userId1}:{userId2}"
                : $"pm:{userId2}:{userId1}";
        }
    }
}