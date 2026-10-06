using backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.Utils;

public static class UserSearchQuery
{
    public static IQueryable<User> Apply(IQueryable<User> query, string? name)
    {
        if (string.IsNullOrWhiteSpace(name)) return query;

        var pattern = $"%{name.Trim()}%";

        return query.Where(u =>
            EF.Functions.ILike(u.UserName, pattern) ||
            EF.Functions.ILike(u.FirstName, pattern) ||
            EF.Functions.ILike(u.LastName, pattern) ||
            EF.Functions.ILike(u.FirstName + " " + u.LastName, pattern));
    }

    public static bool HasText(string? name) => !string.IsNullOrWhiteSpace(name);
}
