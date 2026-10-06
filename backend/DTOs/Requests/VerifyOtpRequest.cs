using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests;

public record VerifyOtpRequest(
    [Required, RegularExpression(Constants.EmailPattern)] string Email,
    [Required] string Otp);
