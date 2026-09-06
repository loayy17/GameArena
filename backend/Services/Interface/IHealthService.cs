using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IHealthService
    {
        Task<HealthResponse> GetHealthAsync();
    }
}
