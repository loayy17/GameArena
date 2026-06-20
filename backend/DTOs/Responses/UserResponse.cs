using backend.Enums;

namespace backend.DTOs.Responses
{
    public class UserResponse
    {
        public Guid Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsVerified { get; set; }
    }
}
