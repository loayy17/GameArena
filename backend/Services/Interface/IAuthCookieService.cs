using backend.DTOs;

namespace backend.Services.Interface
{
    public interface IAuthCookieService
    {
        void SetAuthCookies(HttpResponse response, AuthResponse auth);
        void ClearAuthCookies(HttpResponse response);
    }
}
