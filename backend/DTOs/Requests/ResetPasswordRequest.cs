using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests
{
    public record ResetPasswordRequest(
        [Required, RegularExpression(ValidationRules.EmailPattern)] string Email,
        [Required] string Otp,
        [Required, RegularExpression(ValidationRules.PasswordPattern)] string NewPassword);
}
