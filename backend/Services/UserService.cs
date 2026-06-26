using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService(AppDbContext _context) : IUserService
    {
        public async Task<UserResponse> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);

            return MapperHelper.ToDto(user);
        }

        public async Task<List<UserResponse>> GetUsers(Guid currentUserId, UserFilterRequest? filter)
        {
            if (string.IsNullOrWhiteSpace(filter?.Name)) return [];

            var name = filter.Name.Trim().ToLower();

            var query = _context.Users
                .Where(u => u.Id != currentUserId)
                .Where(u =>
                    (u.UserName != null && u.UserName.ToLower().Contains(name)) ||
                    (u.Email != null && u.Email.ToLower().Contains(name))
                );

            if (filter.UserStatus != UserStatus.All) query = query.Where(u => u.Status == filter.UserStatus);

            var users = await query.ToListAsync();
            return [.. users.Select(MapperHelper.ToDto)];
        }
    }
}