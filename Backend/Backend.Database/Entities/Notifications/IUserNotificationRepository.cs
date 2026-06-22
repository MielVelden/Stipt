namespace Backend.Database.Entities.Notifications;

public interface IUserNotificationRepository
{
    Task AddAsync(UserNotification notification, CancellationToken ct);
}

