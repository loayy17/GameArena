using backend.DTOs.Responses;

namespace backend.Services.Interface;

public interface IAuthCookieHelper
{
    void Issue(HttpResponse response, AuthResponse auth);
    void Clear(HttpResponse response);
}
