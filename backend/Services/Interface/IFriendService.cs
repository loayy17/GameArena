using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IFriendService
    {
        Task SendRequestAsync(Guid senderId, Guid receiverId);
        Task AcceptRequestAsync(Guid userId, Guid senderId);
        Task DeclineRequestAsync(Guid userId, Guid senderId);
        Task RemoveFriendAsync(Guid userId, Guid friendId);
        Task BlockUserAsync(Guid blockerId, Guid blockedId);
        Task UnblockUserAsync(Guid blockerId, Guid blockedId);
        Task<List<UserSummaryResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter);
        Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId);
        Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId);
        Task<List<UserSummaryResponse>> GetBlockedUsersAsync(Guid userId);
        Task<int> GetFriendRequestCountAsync(Guid userId);
        Task<int> GetFriendCountAsync(Guid userId);
    }
}
