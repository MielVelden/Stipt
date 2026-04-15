using Backend.Database.Entities.Sessions;

namespace Backend.Web.Features.Notifications;

public interface INotificationService
{
    Task NotifyWaitlistPromotionAsync(Guid participantId, Session session, CancellationToken ct);
}

