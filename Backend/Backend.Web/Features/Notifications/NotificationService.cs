using Backend.Database.Entities.Notifications;
using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Email;

namespace Backend.Web.Features.Notifications;

internal static class NotificationTypes
{
    public const string WaitlistPromotion = "waitlist_promotion";
}

public sealed class NotificationService(IUserNotificationRepository notificationRepository, EmailService emailService ) : INotificationService
{
    public async Task NotifyWaitlistPromotionAsync(Guid participantId, Session session, CancellationToken ct)
    {
        var notification = new UserNotification
        {
            Id = Guid.NewGuid(),
            UserId = participantId.ToString(),
            Type = NotificationTypes.WaitlistPromotion,
            Title = "Je bent doorgeschoven vanaf de wachtlijst",
            Message = $"Je bent nu ingeschreven voor de sessie '{session.Title}'.",
            EventId = session.EventId,
            SessionId = session.Id,
            CreatedAtUtc = DateTime.UtcNow
        };
        
        await emailService.SendUserNotificationAsync(notification, ct);
        await notificationRepository.AddAsync(notification, ct);
    }
}

