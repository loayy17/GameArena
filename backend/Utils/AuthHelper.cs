using backend.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Buffers.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Auth
{
    public static class AuthHelper
    {
        public static string HashPassword(User user, string password)
        {
            return new PasswordHasher<User>().HashPassword(user, password);
        }

        public static bool VerifyPassword(User user, string hashedPassword, string providedPassword)
        {
            return new PasswordHasher<User>().VerifyHashedPassword(user, hashedPassword, providedPassword) == PasswordVerificationResult.Success;
        }

        public static string GenerateRefreshTokenString()
        {
            byte[] randomNumber = RandomNumberGenerator.GetBytes(32);
            return Base64Url.EncodeToString(randomNumber);
        }

        public static string ComputeHash(string input)
        {
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);
            byte[] hashBytes = SHA256.HashData(inputBytes);
            return Convert.ToBase64String(hashBytes);
        }

        public static string CreateToken(User user, IConfiguration configuration)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName),
                new(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("JWT:Token")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("JWT:Issuer"),
                audience: configuration.GetValue<string>("JWT:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
