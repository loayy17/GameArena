using backend.DTOs.Responses;
using backend.Services.Interface;
using backend.Utils;

namespace backend.Utils;

public sealed class AuthCookieHelper(IConfiguration configuration) : IAuthCookieHelper
{
    public void Issue(HttpResponse response, AuthResponse auth)
    {
        response.Cookies.Append(Constants.Access, auth.AccessToken, BuildOptions(
            DateTime.UtcNow.AddMinutes(Constants.AccessTokenMinutes)));

        response.Cookies.Append(Constants.Refresh, auth.RefreshToken, BuildOptions(
            DateTime.UtcNow.AddDays(Constants.RefreshTokenDays)));
    }

    public void Clear(HttpResponse response)
    {
        var options = BuildOptions(null);
        response.Cookies.Delete(Constants.Access, options);
        response.Cookies.Delete(Constants.Refresh, options);
    }

    private CookieOptions BuildOptions(DateTime? expires)
    {
        var cookie = new CookieOptions
        {
            HttpOnly = true,
            Secure = configuration.GetValue("Cookies:Secure", true),
            SameSite = ParseSameSite() ?? SameSiteMode.None,
            Path = "/"
        };

        if (expires.HasValue)
            cookie.Expires = expires.Value;

        return cookie;
    }

    private SameSiteMode? ParseSameSite() =>
        Enum.TryParse<SameSiteMode>(configuration["Cookies:SameSite"], ignoreCase: true, out var mode)
            ? mode
            : null;
}
