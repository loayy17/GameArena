using backend.Domain;

using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<UserFriends> UserFriends { get; set; }
    public DbSet<FriendRequest> FriendRequests { get; set; }
    public DbSet<EmailVerification> EmailVerifications { get; set; }
    public DbSet<MatchHistory> MatchHistories { get; set; }
    public DbSet<Block> Blocks { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUser(modelBuilder);
        ConfigureRefreshToken(modelBuilder);
        ConfigureFriendship(modelBuilder);
        ConfigureFriendRequest(modelBuilder);
        ConfigureBlock(modelBuilder);
        ConfigureMessage(modelBuilder);
        ConfigureMatchHistory(modelBuilder);
        ConfigureNotification(modelBuilder);
        ConfigureFeedback(modelBuilder);
    }

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.UserName).IsUnique();
    }

    private static void ConfigureRefreshToken(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(rt => rt.TokenHash)
            .IsUnique();
    }

    private static void ConfigureFriendship(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserFriends>()
            .HasKey(uf => new { uf.UserId, uf.FriendId });

        modelBuilder.Entity<UserFriends>()
            .HasOne(x => x.User)
            .WithMany(u => u.FriendshipsSent)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserFriends>()
            .HasOne(x => x.Friend)
            .WithMany(u => u.FriendshipsReceived)
            .HasForeignKey(x => x.FriendId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureFriendRequest(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FriendRequest>()
            .HasKey(fr => new { fr.SenderId, fr.ReceiverId });

        modelBuilder.Entity<FriendRequest>()
            .HasOne(x => x.Sender)
            .WithMany(u => u.FriendRequestsSent)
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FriendRequest>()
            .HasOne(x => x.Receiver)
            .WithMany(u => u.FriendRequestsReceived)
            .HasForeignKey(x => x.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FriendRequest>()
            .HasIndex(fr => new { fr.ReceiverId, fr.Status });

        modelBuilder.Entity<FriendRequest>()
            .HasIndex(fr => new { fr.SenderId, fr.Status });
    }

    private static void ConfigureBlock(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Block>()
            .HasKey(b => new { b.BlockerId, b.BlockedId });

        modelBuilder.Entity<Block>()
            .HasOne(b => b.Blocker)
            .WithMany()
            .HasForeignKey(b => b.BlockerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Block>()
            .HasOne(b => b.Blocked)
            .WithMany()
            .HasForeignKey(b => b.BlockedId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureMessage(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany(u => u.ReceivedMessages)
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasIndex(m => new { m.SenderId, m.ReceiverId });

        modelBuilder.Entity<Message>()
            .HasIndex(m => new { m.ReceiverId, m.IsRead });
    }

    private static void ConfigureMatchHistory(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MatchHistory>()
            .HasOne(m => m.Player1)
            .WithMany(u => u.MatchesAsPlayer1)
            .HasForeignKey(m => m.Player1Id)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MatchHistory>()
            .HasOne(m => m.Player2)
            .WithMany(u => u.MatchesAsPlayer2)
            .HasForeignKey(m => m.Player2Id)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureNotification(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => new { n.UserId, n.IsRead });

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.CreatedAt);
    }

    private static void ConfigureFeedback(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Feedback>()
            .HasIndex(f => f.CreatedAt);
    }
}
