using backend.Services.Interface;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Services
{
    public class EmailService(IConfiguration _config) : IEmailService
    {

        public async Task SendAsync(string to, string subject, string body)
        {
            // configure the email message
            var emailConfig = _config["EmailSettings:Email"] ?? throw new Exception("Email user not configured");
            var hostConfig = _config["EmailSettings:Host"] ?? throw new Exception("Email host not configured");
            var passConfig = _config["EmailSettings:Password"] ?? throw new Exception("Email password not configured");
            var portConfig = _config["EmailSettings:Port"] ?? throw new Exception("Email port not configured");
            int port = int.TryParse(portConfig, out var parsedPort) ? parsedPort : throw new Exception("Email port is not a valid number");

            // create the email message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(emailConfig));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            email.Body = bodyBuilder.ToMessageBody();


            using var smtp = new SmtpClient();
            smtp.Timeout = 20_000;
            await smtp.ConnectAsync(
                hostConfig,
                port,
                MailKit.Security.SecureSocketOptions.SslOnConnect
            );

            await smtp.AuthenticateAsync(emailConfig, passConfig);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}