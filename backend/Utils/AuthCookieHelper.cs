using backend.DTOs.Responses;

namespace backend.Utils;

public static class AuthCookieHelper
{
    public static void SetAuthCookies(HttpResponse response, AuthResponse auth)
    {
        var config = response.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var secure = config.GetValue("Cookies:Secure", true);
        var sameSite = ParseSameSite(config["Cookies:SameSite"]) ?? SameSiteMode.None;

        response.Cookies.Append(
            "access_token",
            auth.AccessToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = secure,
                SameSite = sameSite,
                Path = "/",
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

        response.Cookies.Append(
            "refresh_token",
            auth.RefreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = secure,
                SameSite = sameSite,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(7)
            });
    }

    public static void ClearAuthCookies(HttpResponse response)
    {
        var config = response.HttpContext.RequestServices.GetRequiredService<IConfiguration>();

        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = config.GetValue("Cookies:Secure", true),
            SameSite = ParseSameSite(config["Cookies:SameSite"]) ?? SameSiteMode.None,
            Path = "/"
        };

        response.Cookies.Delete("access_token", options);
        response.Cookies.Delete("refresh_token", options);
    }

    private static SameSiteMode? ParseSameSite(string? value) =>
        Enum.TryParse<SameSiteMode>(value, ignoreCase: true, out var mode) ? mode : null;
}
