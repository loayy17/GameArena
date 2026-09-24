using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.Domain;

public class Feedback
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public FeedbackCategory Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}