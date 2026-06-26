using backend.Enums;

namespace backend.DTOs.Requests
{
    public class UserFilterRequest
    {
        public string Name { get; set; } = null!;
        public UserStatus UserStatus { get; set; }
    }
}
