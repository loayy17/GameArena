using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class FriendService(AppDbContext context, IEventBus eventBus, ILogger<FriendService> logger) : IFriendService
{
    public async Task SendRequestAsync(Guid senderId, Guid receiverId)
    {
        if (senderId == receiverId) throw new AppException(ErrorCode.InvalidRequest);

        var blocker = await SocialQueryHelper.GetBlockerAsync(context, senderId, receiverId);
        if (blocker != null) throw new AppException(blocker == receiverId ? ErrorCode.UserBlockedYou : ErrorCode.YouBlockedUser);

        if (await SocialQueryHelper.AreFriendsAsync(context, senderId, receiverId)) throw new AppException(ErrorCode.AlreadyFriends);

        var existing = await context.FriendRequests.FirstOrDefaultAsync(fr =>
            (fr.SenderId == senderId && fr.ReceiverId == receiverId) ||
            (fr.SenderId == receiverId && fr.ReceiverId == senderId));

        if (existing is { Status: FriendRequestStatus.Pending })
        {
            throw new AppException(existing.SenderId == senderId
                ? ErrorCode.RequestAlreadyExists
                : ErrorCode.ReceiverHasAlreadySentRequest);
        }

        if (existing != null)
        {
            await TransactionHelper.ExecuteAsync(context, async () =>
            {
                context.FriendRequests.Remove(existing);
                context.FriendRequests.Add(NewPendingRequest(senderId, receiverId));
                await context.SaveChangesAsync();
            });
        }
        else
        {
            context.FriendRequests.Add(NewPendingRequest(senderId, receiverId));
            await context.SaveChangesAsync();
        }

        var senderName = await SocialQueryHelper.GetUserNameAsync(context, senderId);
        await eventBus.PublishAsync(new FriendRequestSentEvent(senderId, receiverId, senderName));
    }

    public async Task AcceptRequestAsync(Guid userId, Guid senderId)
    {
        var blocker = await SocialQueryHelper.GetBlockerAsync(context, userId, senderId);
        if (blocker != null) throw new AppException(blocker == senderId ? ErrorCode.YouBlockedUser : ErrorCode.UserBlockedYou);

        var request = await context.FriendRequests.FirstOrDefaultAsync(fr =>
            fr.SenderId == senderId &&
            fr.ReceiverId == userId &&
            fr.Status == FriendRequestStatus.Pending)
            ?? throw new AppException(ErrorCode.FriendRequestNotFound);

        try
        {
            await TransactionHelper.ExecuteAsync(context, () => LinkBothWaysAsync(request, userId, senderId));
        }
        catch (DbUpdateException)
        {
            context.ChangeTracker.Clear();

            var settled = await context.FriendRequests
                .AsNoTracking()
                .FirstOrDefaultAsync(fr => fr.SenderId == senderId && fr.ReceiverId == userId);

            if (settled?.Status == FriendRequestStatus.Accepted) throw new AppException(ErrorCode.AlreadyFriends);

            logger.LogWarning(
                "Friendship insert lost a race between {UserId} and {SenderId}, rolling back",
                userId,
                senderId);

            throw new AppException(ErrorCode.RequestAlreadyProcessed);
        }

        var accepterName = await SocialQueryHelper.GetUserNameAsync(context, userId);
        await eventBus.PublishAsync(new FriendRequestAcceptedEvent(senderId, userId, accepterName));
    }

    public async Task DeclineRequestAsync(Guid userId, Guid senderId)
    {
        var request = await context.FriendRequests.FirstOrDefaultAsync(fr =>
            fr.SenderId == senderId &&
            fr.ReceiverId == userId &&
            fr.Status == FriendRequestStatus.Pending)
            ?? throw new AppException(ErrorCode.FriendRequestNotFound);

        request.Status = FriendRequestStatus.Rejected;
        await context.SaveChangesAsync();

        await eventBus.PublishAsync(new FriendRequestDeclinedEvent(senderId, userId));
    }

    public async Task CancelRequestAsync(Guid userId, Guid receiverId)
    {
        var request = await context.FriendRequests.FirstOrDefaultAsync(fr =>
            fr.SenderId == userId &&
            fr.ReceiverId == receiverId &&
            fr.Status == FriendRequestStatus.Pending)
            ?? throw new AppException(ErrorCode.FriendRequestNotFound);

        request.Status = FriendRequestStatus.Cancelled;
        await context.SaveChangesAsync();
        await eventBus.PublishAsync(new FriendRequestCancelledEvent(userId, receiverId));
    }

    public async Task RemoveFriendAsync(Guid userId, Guid friendId)
    {
        var friendships = await SocialQueryHelper.GetFriendshipsAsync(context, userId, friendId);

        if (friendships.Count == 0) throw new AppException(ErrorCode.IsNotFriend);

        context.UserFriends.RemoveRange(friendships);
        await context.SaveChangesAsync();

        await eventBus.PublishAsync(new FriendRemovedEvent(userId, friendId));
    }

    public async Task BlockUserAsync(Guid blockerId, Guid blockedId)
    {
        if (blockerId == blockedId) throw new AppException(ErrorCode.CannotSelfBlock);

        if (await context.Blocks.AnyAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId)) throw new AppException(ErrorCode.AlreadyBlocked);

        context.Blocks.Add(new Block { BlockerId = blockerId, BlockedId = blockedId });
        context.UserFriends.RemoveRange(await SocialQueryHelper.GetFriendshipsAsync(context, blockerId, blockedId));
        var pending = await context.FriendRequests
            .Where(fr => fr.Status == FriendRequestStatus.Pending &&
                        ((fr.SenderId == blockerId && fr.ReceiverId == blockedId) ||
                         (fr.SenderId == blockedId && fr.ReceiverId == blockerId)))
            .ToListAsync();

        foreach (var request in pending)
        {
            request.Status = FriendRequestStatus.Cancelled;
        }

        await context.SaveChangesAsync();

        foreach (var request in pending)
        {
            await eventBus.PublishAsync(new FriendRequestCancelledEvent(request.SenderId, request.ReceiverId));
        }

        await eventBus.PublishAsync(new UserBlockedEvent(blockerId, blockedId));
    }

    public async Task UnblockUserAsync(Guid blockerId, Guid blockedId)
    {
        var block = await context.Blocks.FirstOrDefaultAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId)
            ?? throw new AppException(ErrorCode.NotBlocked);

        context.Blocks.Remove(block);
        await context.SaveChangesAsync();

        await eventBus.PublishAsync(new UserUnblockedEvent(blockerId, blockedId));
    }

    private static FriendRequest NewPendingRequest(Guid senderId, Guid receiverId) => new()
    {
        SenderId = senderId,
        ReceiverId = receiverId,
        Status = FriendRequestStatus.Pending
    };

    private async Task LinkBothWaysAsync(FriendRequest request, Guid userId, Guid senderId)
    {
        request.Status = FriendRequestStatus.Accepted;

        var existing = await context.UserFriends
            .Where(x => (x.UserId == userId && x.FriendId == senderId) ||
                        (x.UserId == senderId && x.FriendId == userId))
            .Select(x => x.UserId)
            .ToListAsync();

        if (!existing.Contains(userId)) context.UserFriends.Add(new UserFriends { UserId = userId, FriendId = senderId });

        if (!existing.Contains(senderId)) context.UserFriends.Add(new UserFriends { UserId = senderId, FriendId = userId });
        await context.SaveChangesAsync();
    }
}
