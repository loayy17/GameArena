using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests
{
    public record SendOtpRequest(
        [Required, RegularExpression(ValidationRules.EmailPattern)] string Email);
}
