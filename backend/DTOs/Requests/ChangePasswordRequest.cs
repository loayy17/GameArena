using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record ChangePasswordRequest(
    [Required] string OldPassword,
    [Required, MinLength(8), MaxLength(100)] string NewPassword);
}
