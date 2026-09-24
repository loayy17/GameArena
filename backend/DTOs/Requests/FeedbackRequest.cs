using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public record FeedbackRequest(
        [Required, MaxLength(100)] string Title,
        [Required, MaxLength(1000)] string Message,
        [Required] string Category);
}