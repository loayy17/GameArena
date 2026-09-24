using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface;

public interface IFeedbackService
{
    Task<List<FeedbackResponse>> GetAllAsync(int limit, int offset);
    Task<FeedbackResponse> GetByIdAsync(Guid id);
    Task<FeedbackResponse> CreateAsync(FeedbackRequest request);
    Task<FeedbackResponse> UpdateAsync(Guid id, FeedbackRequest request);
    Task DeleteAsync(Guid id);
}