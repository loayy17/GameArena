using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests
{
    public record UpdateProfileRequest(
        [Required] string FirstName,
        [Required] string LastName,
        [Required] string UserName,
        [Required, RegularExpression(ValidationRules.EmailPattern)] string Email);
}
