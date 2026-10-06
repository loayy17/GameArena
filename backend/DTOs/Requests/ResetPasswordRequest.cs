using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests;

public record ResetPasswordRequest(
    [Required, RegularExpression(Constants.EmailPattern)] string Email,
    [Required] string Otp,
    [Required, RegularExpression(Constants.PasswordPattern)] string NewPassword);
