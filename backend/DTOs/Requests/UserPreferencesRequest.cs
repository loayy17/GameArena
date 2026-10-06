using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests;

public record UserPreferencesRequest(
    [Required] string Preferences = "{}");
