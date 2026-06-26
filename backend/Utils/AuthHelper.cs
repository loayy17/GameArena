using backend.Domain;
using backend.Enums;
using backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Buffers.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static System.Net.WebRequestMethods;

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
                expires: DateTime.UtcNow.AddMinutes(1000),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        public static string Hash(string otp)
        {
            return Convert.ToBase64String(
                SHA256.HashData(Encoding.UTF8.GetBytes(otp))
            );
        }

        public static string GetHtmlTemplate(string userName, string otp)
        {
            return $"""
            <!DOCTYPE html>
            <html>
            <body style="margin:0; padding:0; font-family:Arial,sans-serif; background-color:#f4f7f6;">
              <table width="100%" style="padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="100%" style="max-width:500px; background:#ffffff; border-radius:8px; border:1px solid #e5e7eb; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                      <tr>
                        <td align="center" style="padding:30px; background-color:#4f46e5;">
                          <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:bold; letter-spacing:0.5px;">YOUR BRAND</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:40px 30px;">
                          <p style="margin:0 0 16px 0; font-size:16px; color:#4b5563;">Hello{userName},</p>
                          <p style="margin:0 0 24px 0; font-size:16px; line-height:1.5; color:#4b5563;">Use the following One-Time Password (OTP) to complete your verification process. This code is valid for <strong>15 minutes</strong>.</p>
                          <table width="100%" style="margin-bottom:24px;">
                            <tr>
                              <td align="center" style="padding:16px; background-color:#f3f4f6; border-radius:6px; border:1px dashed #cbd5e1;">
                                <span style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#1e1b4b;">{otp}</span>
                              </td>
                            </tr>
                          </table>
                          <p style="margin:0; font-size:14px; color:#6b7280;">If you did not request this code, please ignore this email safely.</p>
                        </td>
                      </tr>
                    </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """;
        }

    }
}
