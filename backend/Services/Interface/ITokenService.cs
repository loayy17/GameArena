using backend.Domain;

namespace backend.Services.Interface;

public interface ITokenService
{
    string CreateAccessToken(User user);
    string CreateRefreshToken();
    string Hash(string value);
}
