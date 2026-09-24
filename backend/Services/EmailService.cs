using System.Net.Http.Json;
using backend.Services.Interface;

namespace backend.Services
{
    public class EmailService(IConfiguration _config, IHttpClientFactory _httpClientFactory, ILogger<EmailService> _logger) : IEmailService
    {
        public async Task SendAsync(string to, string subject, string body)
        {
            var fromEmail = _config["EmailSettings:Email"] ?? "noreply@gamearena.com";
            var payload = new
            {
                sender = new { email = fromEmail, name = "Arena 404" },
                to = new[] { new { email = to } },
                subject,
                htmlContent = body
            };

            using var client = _httpClientFactory.CreateClient("Brevo");

            var response = await client.PostAsJsonAsync("email", payload);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Email sent via Brevo to {Email}", to);
            }
            else
            {
                var errBody = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Email delivery failed for {Email}. Error: {Error}", to, errBody);
                throw new Exception($"Email delivery failed: {response.StatusCode}");
            }
        }
    }
}
