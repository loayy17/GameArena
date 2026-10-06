using System.ComponentModel.DataAnnotations;
using backend.Utils;

namespace backend.DTOs.Requests;

public record SendOtpRequest(
    [Required, RegularExpression(Constants.EmailPattern)] string Email);
