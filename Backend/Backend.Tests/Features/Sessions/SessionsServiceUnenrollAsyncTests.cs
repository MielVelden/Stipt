using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Notifications;
using NSubstitute;

namespace Backend.Tests.Features.Sessions;

public sealed class SessionsServiceUnenrollAsyncTests
{
    [Fact]
    public async Task UnenrollAsync_EnrolledParticipant_PromotesFirstWaitlistedParticipant()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var participantId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 2);
        var enrollment = new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = participantId,
            Status = SessionEnrollmentStatus.Enrolled,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-10)
        };
        session.Enrollments.Add(enrollment);

        var waitlisted = new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = Guid.NewGuid(),
            Status = SessionEnrollmentStatus.Waitlisted,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-5)
        };

        var sessionRepository = Substitute.For<ISessionRepository>();
        var enrollmentRepository = Substitute.For<ISessionEnrollmentRepository>();
        var notificationService = Substitute.For<INotificationService>();
        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, enrollmentRepository, notificationService);

        sessionRepository.GetByIdAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);
        enrollmentRepository.GetFirstWaitlistedEnrollmentAsync(sessionId, Arg.Any<CancellationToken>())
            .Returns(waitlisted);

        var result = await service.UnenrollAsync(eventId, sessionId, participantId, CancellationToken.None);

        Assert.True(result);
        await enrollmentRepository.Received(1)
            .RemoveEnrollmentAsync(enrollment, Arg.Any<CancellationToken>());
        await enrollmentRepository.Received(1)
            .UpdateEnrollmentAsync(Arg.Is<SessionEnrollment>(x => x.Id == waitlisted.Id && x.Status == SessionEnrollmentStatus.Enrolled), Arg.Any<CancellationToken>());
        await notificationService.Received(1)
            .NotifyWaitlistPromotionAsync(waitlisted.ParticipantId, session, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UnenrollAsync_NoWaitlistedParticipant_DoesNotSendPromotionNotification()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var participantId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 1);
        var enrollment = new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = participantId,
            Status = SessionEnrollmentStatus.Enrolled,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-10)
        };
        session.Enrollments.Add(enrollment);

        var sessionRepository = Substitute.For<ISessionRepository>();
        var enrollmentRepository = Substitute.For<ISessionEnrollmentRepository>();
        var notificationService = Substitute.For<INotificationService>();
        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, enrollmentRepository, notificationService);

        sessionRepository.GetByIdAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);
        enrollmentRepository.GetFirstWaitlistedEnrollmentAsync(sessionId, Arg.Any<CancellationToken>())
            .Returns((SessionEnrollment?)null);

        var result = await service.UnenrollAsync(eventId, sessionId, participantId, CancellationToken.None);

        Assert.True(result);
        await notificationService.DidNotReceive()
            .NotifyWaitlistPromotionAsync(Arg.Any<Guid>(), Arg.Any<Session>(), Arg.Any<CancellationToken>());
    }
}
