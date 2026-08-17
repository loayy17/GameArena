using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record ResetPasswordRequest(
        [Required, EmailAddress] string Email,
        [Required] string Otp,
        [Required, MinLength(8), MaxLength(100)] string NewPassword);

}