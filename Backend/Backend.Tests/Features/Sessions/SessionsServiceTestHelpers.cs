using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Notifications;
using Backend.Web.Features.Sessions;
using Microsoft.AspNetCore.SignalR;
using NSubstitute;

namespace Backend.Tests.Features.Sessions;

internal static class SessionsServiceTestHelpers
{
    public static SessionsService CreateService(
        ISessionRepository sessionRepository,
        ISessionEnrollmentRepository enrollmentRepository,
        INotificationService? notificationService = null)
    {
        return new SessionsService(
            sessionRepository,
            enrollmentRepository,
            Substitute.For<IRoomRepository>(),
            Substitute.For<IEventRepository>(),
            notificationService ?? Substitute.For<INotificationService>(),
            Substitute.For<IHubContext<SessionsHub>>());
    }

    public static Session BuildSession(Guid eventId, Guid sessionId, int capacity)
    {
        return new Session
        {
            Id = sessionId,
            EventId = eventId,
            RoomId = Guid.NewGuid(),
            Room = new Room
            {
                Id = Guid.NewGuid(),
                Name = "Main room",
                Capacity = 10,
                EventId = eventId
            },
            Title = "Session",
            Speaker = "Speaker",
            Type = SessionType.Breakout,
            StartDateTime = new DateTime(2026, 4, 4, 10, 0, 0, DateTimeKind.Utc),
            EndDateTime = new DateTime(2026, 4, 4, 11, 0, 0, DateTimeKind.Utc),
            Capacity = capacity,
            Labels = [],
            CreatedAtUtc = DateTime.UtcNow
        };
    }
}
