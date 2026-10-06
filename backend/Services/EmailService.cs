using System.Net.Http.Json;
using backend.Services.Interface;
using backend.Utils;

namespace backend.Services;

public class EmailService(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendAsync(string to, string subject, string body)
    {
        var payload = new
        {
            sender = new { email = configuration["EmailSettings:Email"] ?? Constants.DefaultSender, name = "Arena 404" },
            to = new[] { new { email = to } },
            subject,
            htmlContent = body
        };

        using var client = httpClientFactory.CreateClient("Brevo");
        using var response = await client.PostAsJsonAsync("email", payload);

        if (response.IsSuccessStatusCode)
        {
            logger.LogInformation("Email sent via Brevo to {Email}", to);
            return;
        }
        var error = await response.Content.ReadAsStringAsync();
        logger.LogWarning("Brevo rejected the email to {Email}: {Error}", to, error);

        throw new Exception($"Email delivery failed: {(int)response.StatusCode}");
    }
}
