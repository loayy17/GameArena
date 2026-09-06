using backend.Data;
using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace backend.Services
{
    public class HealthService(AppDbContext _context) : IHealthService
    {
        public async Task<HealthResponse> GetHealthAsync()
        {
            var dbOk = await _context.Database.CanConnectAsync();
            return new HealthResponse
            {
                Status = dbOk ? "ok" : "degraded",
                Service = "gamearena",
                Timestamp = DateTime.UtcNow,
                UptimeSeconds = (long)(DateTime.UtcNow - Process.GetCurrentProcess().StartTime.ToUniversalTime()).TotalSeconds,
                Database = dbOk ? "connected" : "disconnected"
            };
        }
    }
}
