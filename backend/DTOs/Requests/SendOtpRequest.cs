using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class SendOtpRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
