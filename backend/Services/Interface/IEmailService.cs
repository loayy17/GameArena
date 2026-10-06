namespace backend.Services.Interface;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string body);
}
