using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class FeedbackService(AppDbContext context) : IFeedbackService
{
    public async Task<List<FeedbackResponse>> GetAllAsync(int limit, int offset)
    {
        return await context.Feedbacks
            .AsNoTracking()
            .OrderByDescending(f => f.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(MappingExtensions.ToFeedbackItem)
            .ToListAsync();
    }

    public async Task<FeedbackResponse> GetByIdAsync(Guid id)
    {
        var feedback = await context.Feedbacks
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id)
            ?? throw new AppException(ErrorCode.FeedbackNotFound);

        return feedback.ToResponse();
    }

    public async Task<FeedbackResponse> CreateAsync(FeedbackRequest request)
    {
        var feedback = new Feedback
        {
            Title = request.Title.Trim(),
            Message = request.Message.Trim(),
            Category = ParseCategory(request.Category)
        };

        context.Feedbacks.Add(feedback);
        await context.SaveChangesAsync();
        return feedback.ToResponse();
    }

    public async Task<FeedbackResponse> UpdateAsync(Guid id, FeedbackRequest request)
    {
        var feedback = await context.Feedbacks.FirstOrDefaultAsync(f => f.Id == id)
            ?? throw new AppException(ErrorCode.FeedbackNotFound);

        feedback.Title = request.Title.Trim();
        feedback.Message = request.Message.Trim();
        feedback.Category = ParseCategory(request.Category);
        feedback.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
        return feedback.ToResponse();
    }

    public async Task DeleteAsync(Guid id)
    {
        var deleted = await context.Feedbacks.Where(f => f.Id == id).ExecuteDeleteAsync();

        if (deleted == 0) throw new AppException(ErrorCode.FeedbackNotFound);
    }

    private static FeedbackCategory ParseCategory(string value)
    {
        if (!Enum.TryParse<FeedbackCategory>(value, ignoreCase: true, out var category)) throw new AppException(ErrorCode.ValidationError);
        return category;
    }
}
