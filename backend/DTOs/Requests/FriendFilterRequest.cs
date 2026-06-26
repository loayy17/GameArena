using backend.Enums;

namespace backend.DTOs.Requests
{
    public class FriendFilterRequest
    {
        public string Name { get; set; } = null!;
        public UserStatus UserStatus { get; set; }
    }
}
