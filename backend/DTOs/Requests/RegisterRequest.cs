using System.ComponentModel.DataAnnotations;


namespace backend.DTOs.Requests
{
    public record RegisterRequest(
        [Required] string FirstName,
        [Required] string LastName,
        [Required] string UserName,
        [Required, EmailAddress] string Email,
        [Required, MinLength(8), MaxLength(100)] string Password);
}
