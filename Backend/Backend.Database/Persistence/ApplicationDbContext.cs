using Backend.Database.Entities;
using Backend.Database.Entities.Auth;
using Backend.Database.Entities.EventParticipants;
using Backend.Database.Entities.Events;
using Backend.Database.Entities.Notifications;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.Images;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<SessionEnrollment> SessionEnrollments => Set<SessionEnrollment>();
    public DbSet<EventParticipant> EventParticipants => Set<EventParticipant>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserNotification> UserNotifications => Set<UserNotification>();
    public DbSet<Image> Images => Set<Image>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
