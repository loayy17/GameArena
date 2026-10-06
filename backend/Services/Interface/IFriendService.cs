namespace backend.Services.Interface;

public interface IFriendService
{
    Task SendRequestAsync(Guid senderId, Guid receiverId);
    Task AcceptRequestAsync(Guid userId, Guid senderId);
    Task DeclineRequestAsync(Guid userId, Guid senderId);
    Task RemoveFriendAsync(Guid userId, Guid friendId);
    Task CancelRequestAsync(Guid senderId, Guid receiverId);
    Task BlockUserAsync(Guid blockerId, Guid blockedId);
    Task UnblockUserAsync(Guid blockerId, Guid blockedId);
}
