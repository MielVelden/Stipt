using Backend.Database.Persistence;

namespace Backend.Database.Entities.Notifications;

internal sealed class UserNotificationRepository(ApplicationDbContext dbContext) : IUserNotificationRepository
{
    public async Task AddAsync(UserNotification notification, CancellationToken ct)
    {
        await dbContext.UserNotifications.AddAsync(notification, ct);
        await dbContext.SaveChangesAsync(ct);
    }
}

