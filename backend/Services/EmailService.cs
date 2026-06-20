using backend.Services.Interface;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();

            var emailConfig = _config["EmailSettings:Email"] ?? throw new Exception("Email user not configured");
            email.From.Add(MailboxAddress.Parse(emailConfig));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            smtp.Timeout = 20_000; // 20 second timeout

            var hostConfig = _config["EmailSettings:Host"] ?? throw new Exception("Email host not configured");
            var portConfig = _config["EmailSettings:Port"] ?? throw new Exception("Email port not configured");
            var passConfig = _config["EmailSettings:Password"] ?? throw new Exception("Email password not configured");

            // Google App Passwords are displayed with spaces (e.g. "xxxx xxxx xxxx xxxx")
            // but SMTP authentication requires them stripped.
            var cleanPassword = passConfig.Replace(" ", "");

            // Use port 465 with implicit SSL — more reliable than 587/StartTls which ISPs often block.
            // Update appsettings.json Port to 465 accordingly.
            await smtp.ConnectAsync(
                hostConfig,
                465,
                MailKit.Security.SecureSocketOptions.SslOnConnect
            );

            await smtp.AuthenticateAsync(emailConfig, cleanPassword);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}