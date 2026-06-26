
using backend.Domain;
using backend.DTOs.Requests;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserFriends> UserFriends { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<EmailVerfication> EmailVerfications { get; set; }
        public DbSet<MatchHistory> MatchHistories { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // tokens
            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.TokenHash)
                .IsUnique();

            // friends
            // user-friend relationship user -> sent friendships and friend -> received friendships
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


            // friend requests
            modelBuilder.Entity<FriendRequest>()
                .HasKey(FR => new { FR.SenderId, FR.ReceiverId });
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

            // chat
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


        }
    }
}
