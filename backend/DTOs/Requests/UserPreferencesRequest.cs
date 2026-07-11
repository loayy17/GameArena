using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Requests
{
    public class UserPreferencesRequest
    {
        [Required]
        public string Preferences { get; set; } = "{}";
    }
}
