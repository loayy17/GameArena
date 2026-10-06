using backend.DTOs.Requests;
using backend.DTOs.Responses;

namespace backend.Services.Interface;

public interface ISocialReadService
{
    Task<List<UserSummaryResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter);
    Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId);
    Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId);
    Task<List<UserSummaryResponse>> GetBlockedUsersAsync(Guid userId);
    Task<HashSet<Guid>> GetFriendIdsAsync(Guid userId);
    Task<bool> AreFriendsAsync(Guid userId, Guid otherUserId);
}
