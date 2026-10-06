using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests;

public record RegisterRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] string UserName,
    [Required, RegularExpression(Constants.EmailPattern)] string Email,
    [Required, RegularExpression(Constants.PasswordPattern)] string Password);
