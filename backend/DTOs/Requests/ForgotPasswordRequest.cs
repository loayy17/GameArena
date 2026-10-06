using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests;

public record ForgotPasswordRequest(
[Required, RegularExpression(Constants.EmailPattern)] string Email);
