using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests;

public record LoginRequest(
[Required, RegularExpression(Constants.EmailPattern)] string Email,
[Required] string Password);
