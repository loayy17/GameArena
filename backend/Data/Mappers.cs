using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Mappers
{
    public static class UserMapper
    {
        public static UserResponse ToDto(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                IsVerified = user.IsVerified
            };
        }

        
    }
}