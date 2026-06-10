using backend.Data;
using backend.Domain;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users
                    .SingleOrDefaultAsync(u => u.Id == userId);
        }
        public async Task<List<User>?> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<List<User>?> GetUserFriends(Guid userId)
        {
           return await _context.UserFriends
                .Where(uf => uf.UserId == userId)
                .Select(uf => uf.Friend)
                .ToListAsync();

        }
    }
}
