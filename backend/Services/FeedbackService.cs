using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class FeedbackService(AppDbContext _context) : IFeedbackService
    {
        public async Task<List<FeedbackResponse>> GetAllAsync(int limit, int offset)
        {
            return await _context.Feedbacks
                .AsNoTracking()
                .OrderByDescending(f => f.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(MappingExtensions.ToFeedbackResponse)
                .ToListAsync();
        }

        public async Task<FeedbackResponse> GetByIdAsync(Guid id)
        {
            var feedback = await _context.Feedbacks
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id)
                ?? throw new AppException(ErrorCode.FeedbackNotFound);

            return feedback.ToResponse();
        }

        public async Task<FeedbackResponse> CreateAsync(FeedbackRequest request)
        {
            if (!Enum.TryParse<FeedbackCategory>(request.Category, ignoreCase: true, out var category))
                throw new AppException(ErrorCode.ValidationError);

            var feedback = new Feedback
            {
                Title = request.Title.Trim(),
                Message = request.Message.Trim(),
                Category = category
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return feedback.ToResponse();
        }

        public async Task<FeedbackResponse> UpdateAsync(Guid id, FeedbackRequest request)
        {
            if (!Enum.TryParse<FeedbackCategory>(request.Category, ignoreCase: true, out var category))
                throw new AppException(ErrorCode.ValidationError);

            var feedback = await _context.Feedbacks.FirstOrDefaultAsync(f => f.Id == id)
                ?? throw new AppException(ErrorCode.FeedbackNotFound);

            feedback.Title = request.Title.Trim();
            feedback.Message = request.Message.Trim();
            feedback.Category = category;
            feedback.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return feedback.ToResponse();
        }

        public async Task DeleteAsync(Guid id)
        {
            var deleted = await _context.Feedbacks.Where(f => f.Id == id).ExecuteDeleteAsync();
            if (deleted == 0)
                throw new AppException(ErrorCode.FeedbackNotFound);
        }
    }
}