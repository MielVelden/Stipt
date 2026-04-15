using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using NSubstitute;

namespace Backend.Tests.Features.Sessions;

public sealed class SessionsServiceReplaceEnrollmentAsyncTests
{
    [Fact]
    public async Task ReplaceEnrollmentAsync_WithSingleConflict_UnenrollsAndEnrolls()
    {
        var eventId = Guid.NewGuid();
        var participantId = Guid.NewGuid();
        var targetSessionId = Guid.NewGuid();
        var oldSessionId = Guid.NewGuid();

        var targetSession = SessionsServiceTestHelpers.BuildSession(eventId, targetSessionId, capacity: 2);
        var oldSession = SessionsServiceTestHelpers.BuildSession(eventId, oldSessionId, capacity: 2);
        oldSession.StartDateTime = targetSession.StartDateTime.AddMinutes(-10);
        oldSession.EndDateTime = targetSession.EndDateTime.AddMinutes(-10);

        var currentEnrollment = new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = oldSessionId,
            ParticipantId = participantId,
            Status = SessionEnrollmentStatus.Enrolled,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-20)
        };
        oldSession.Enrollments.Add(currentEnrollment);

        var sessionRepository = Substitute.For<ISessionRepository>();
        var enrollmentRepository = Substitute.For<ISessionEnrollmentRepository>();
        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, enrollmentRepository);

        sessionRepository.GetByIdAsync(eventId, targetSessionId, Arg.Any<CancellationToken>())
            .Returns(targetSession);
        sessionRepository.GetByIdAsync(eventId, oldSessionId, Arg.Any<CancellationToken>())
            .Returns(oldSession);
        sessionRepository.GetByIdAsync(eventId, targetSessionId, Arg.Any<CancellationToken>())
            .Returns(targetSession);

        enrollmentRepository.GetOverlappingEnrolledSessionsAsync(
                eventId,
                participantId,
                targetSessionId,
                Arg.Any<CancellationToken>())
            .Returns(
                [oldSession],
                Array.Empty<Session>());

        enrollmentRepository
            .When(x => x.RemoveEnrollmentAsync(Arg.Any<SessionEnrollment>(), Arg.Any<CancellationToken>()))
            .Do(_ => oldSession.Enrollments.Remove(currentEnrollment));

        enrollmentRepository
            .When(x => x.AddEnrollmentAsync(Arg.Any<SessionEnrollment>(), Arg.Any<CancellationToken>()))
            .Do(callInfo => targetSession.Enrollments.Add(callInfo.Arg<SessionEnrollment>()));

        var result = await service.ReplaceEnrollmentAsync(
            eventId,
            targetSessionId,
            participantId,
            oldSessionId,
            CancellationToken.None);

        Assert.Equal(SessionEnrollmentStatus.Enrolled, result.MyEnrollmentStatus);
        Assert.Null(result.MyWaitlistPosition);
        await enrollmentRepository.Received(1)
            .RemoveEnrollmentAsync(Arg.Is<SessionEnrollment>(x => x.SessionId == oldSessionId), Arg.Any<CancellationToken>());
        await enrollmentRepository.Received(1)
            .AddEnrollmentAsync(Arg.Is<SessionEnrollment>(x => x.SessionId == targetSessionId), Arg.Any<CancellationToken>());
    }
}
