using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService(AppDbContext _context, IUserPresenceService _presence) : IUserService
    {
        public async Task<UserResponse> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);

            return MapperHelper.ToDto(user);
        }

        public async Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter)
        {
            if (string.IsNullOrWhiteSpace(filter?.Name)) return [];

            var name = filter.Name.Trim().ToLower();

            var query = _context.Users
                .Where(u => u.Id != currentUserId)
                .Where(u =>
                    u.UserName != null && u.UserName.ToLower().Contains(name)
                );

            var users = await query.ToListAsync();
            var results = users.Select(user =>
            {
                var dto = MapperHelper.ToDtoSummary(user);
                dto.Status = _presence.GetStatus(user.Id.ToString());
                return dto;
            });
            if (filter.UserStatus != UserStatus.All)
                results = results.Where(dto => dto.Status == filter.UserStatus);
            return [.. results];
        }

        public async Task<UserResponse> UpdateUserAsync(UserResponse request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.Id) ?? throw new AppException(ErrorCode.UserNotFound);
            user.UserName = request.UserName;
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Role = request.Role;
            user.Status = request.Status;
            await _context.SaveChangesAsync();
            return MapperHelper.ToDto(user);
        }

        public async Task<UserResponse> UpdateProfileAsync(Guid userId, RegisterRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);
            user.UserName = request.UserName;
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            await _context.SaveChangesAsync();
            return MapperHelper.ToDto(user);
        }

        public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);
            if (!AuthHelper.VerifyPassword(user, user.PasswordHash, oldPassword))
                throw new AppException(ErrorCode.InvalidCredentials);
            user.PasswordHash = AuthHelper.HashPassword(user, newPassword);
            await _context.SaveChangesAsync();
        }

        public async Task<string?> GetPreferencesAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);
            return user.Preferences;
        }

        public async Task UpdatePreferencesAsync(Guid userId, string preferencesJson)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new AppException(ErrorCode.UserNotFound);
            user.Preferences = preferencesJson;
            await _context.SaveChangesAsync();
        }
    }
}
