using backend.Services.Interface;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Services
{
    public class EmailService(IConfiguration _config, ILogger<EmailService> _logger) : IEmailService
    {

        public async Task SendAsync(string to, string subject, string body)
        {
            var emailConfig = _config["EmailSettings:Email"];
            var hostConfig = _config["EmailSettings:Host"];
            var passConfig = _config["EmailSettings:Password"];
            var portConfig = _config["EmailSettings:Port"];

            if (string.IsNullOrEmpty(emailConfig) || string.IsNullOrEmpty(hostConfig) ||
                string.IsNullOrEmpty(passConfig) || string.IsNullOrEmpty(portConfig))
            {
                _logger.LogWarning("EmailSettings not configured. Logging OTP to console instead of sending to {Email}", to);
                Console.WriteLine($"\n=== OTP for {to} ===");
                Console.WriteLine($"Subject: {subject}");
                Console.WriteLine($"Body: {body}");
                Console.WriteLine("=======================\n");
                return;
            }

            if (!int.TryParse(portConfig, out var port))
            {
                _logger.LogError("EmailSettings:Port is not a valid number: {Port}", portConfig);
                return;
            }

            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailConfig));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = body };
                email.Body = bodyBuilder.ToMessageBody();

                using var smtp = new SmtpClient();
                smtp.Timeout = 20_000;
                await smtp.ConnectAsync(hostConfig, port, MailKit.Security.SecureSocketOptions.SslOnConnect);
                await smtp.AuthenticateAsync(emailConfig, passConfig);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send email to {Email}. OTP printed to console.", to);
                Console.WriteLine($"\n=== OTP for {to} ===");
                Console.WriteLine($"Subject: {subject}");
                Console.WriteLine($"Body: {body}");
                Console.WriteLine("=======================\n");
            }
        }
    }
}