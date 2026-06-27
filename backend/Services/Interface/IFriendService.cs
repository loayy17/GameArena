using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Services.Interface
{
    public interface IFriendService
    {
        // send request (add friend) to user 
        Task SendFriendRequestAsync(Guid senderId, Guid receiverId);

        // accept/decline requested that recieved for user
        Task AcceptFriendRequestAsync(Guid userId, Guid senderId);
        Task DeclineFriendRequestAsync(Guid userId, Guid senderId);

        // get fiends for users with filter (all, online, offline)
        Task<List<UserResponse>> GetFriendsAsync(Guid userId, UserFilterRequest filter);

        // get all requests that receive for users
        Task<List<FriendRequestReceivedResponse>> GetFriendRequestsAsync(Guid userId);

        // get all sent request
        Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId);

    }
}
