using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests
{
    public record ForgotPasswordRequest(
    [Required, RegularExpression(ValidationRules.EmailPattern)] string Email);
}
