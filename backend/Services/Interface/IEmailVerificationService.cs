using backend.Enums;

namespace backend.Services.Interface
{
    public interface IEmailVerificationService
    {
        Task GenerateAndSendOtpAsync(string email, OtpPurpose purpose);
        Task VerifyOtpAsync(string email,string otp,OtpPurpose purpose);
    }
}
