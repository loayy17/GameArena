using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests
{
    public record ChangePasswordRequest(
    [Required] string OldPassword,
    [Required, RegularExpression(ValidationRules.PasswordPattern)] string NewPassword);
}
