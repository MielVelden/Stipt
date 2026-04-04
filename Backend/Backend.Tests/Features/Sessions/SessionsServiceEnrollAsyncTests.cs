using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Exceptions;
using NSubstitute;

namespace Backend.Tests.Features.Sessions;

public sealed class SessionsServiceEnrollAsyncTests
{
    [Fact]
    public async Task EnrollAsync_WithAvailableCapacity_EnrollsParticipant()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var participantId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 2);

        var sessionRepository = Substitute.For<ISessionRepository>();
        var enrollmentRepository = Substitute.For<ISessionEnrollmentRepository>();
        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, enrollmentRepository);

        sessionRepository.GetByIdForEnrollmentAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);
        enrollmentRepository.GetOverlappingEnrolledSessionsAsync(
                eventId,
                participantId,
                session.StartDateTime,
                session.EndDateTime,
                session.Id,
                Arg.Any<CancellationToken>())
            .Returns([]);
        enrollmentRepository
            .When(x => x.AddEnrollmentAsync(Arg.Any<SessionEnrollment>(), Arg.Any<CancellationToken>()))
            .Do(callInfo => session.Enrollments.Add(callInfo.Arg<SessionEnrollment>()));
        sessionRepository.GetByIdAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);

        var result = await service.EnrollAsync(eventId, sessionId, participantId, CancellationToken.None);

        Assert.Equal(SessionEnrollmentStatus.Enrolled, result.MyEnrollmentStatus);
        Assert.Null(result.MyWaitlistPosition);
        Assert.Equal(1, result.EnrolledCount);
        Assert.Equal(0, result.WaitlistCount);
        Assert.True(result.HasAvailableSpots);
        await enrollmentRepository.Received(1)
            .AddEnrollmentAsync(Arg.Is<SessionEnrollment>(x => x.ParticipantId == participantId), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task EnrollAsync_WhenSessionIsFull_AddsParticipantToWaitlist()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var participantId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 1);
        session.Enrollments.Add(new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = Guid.NewGuid(),
            Status = SessionEnrollmentStatus.Enrolled,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-5)
        });

        var sessionRepository = Substitute.For<ISessionRepository>();
        var enrollmentRepository = Substitute.For<ISessionEnrollmentRepository>();
        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, enrollmentRepository);

        sessionRepository.GetByIdForEnrollmentAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);
        enrollmentRepository.GetOverlappingEnrolledSessionsAsync(
                eventId,
                participantId,
                session.StartDateTime,
                session.EndDateTime,
                session.Id,
                Arg.Any<CancellationToken>())
            .Returns(Array.Empty<Session>());
        enrollmentRepository
            .When(x => x.AddEnrollmentAsync(Arg.Any<SessionEnrollment>(), Arg.Any<CancellationToken>()))
            .Do(callInfo => session.Enrollments.Add(callInfo.Arg<SessionEnrollment>()));
        sessionRepository.GetByIdAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);

        var result = await service.EnrollAsync(eventId, sessionId, participantId, CancellationToken.None);

        Assert.Equal(SessionEnrollmentStatus.Waitlisted, result.MyEnrollmentStatus);
        Assert.Equal(1, result.MyWaitlistPosition);
        Assert.Equal(1, result.EnrolledCount);
        Assert.Equal(1, result.WaitlistCount);
        Assert.False(result.HasAvailableSpots);
    }

    [Fact]
    public async Task EnrollAsync_WithOverlap_ThrowsConflictException()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var participantId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 2);
        var conflicting = SessionsServiceTestHelpers.BuildSession(eventId, Guid.NewGuid(), capacity: 2);

        var sessionRepository = Substitute.For<ISessionRepository>();
        var enrollmentRepository = Substitute.For<ISessionEnrollmentRepository>();
        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, enrollmentRepository);

        sessionRepository.GetByIdForEnrollmentAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);
        enrollmentRepository.GetOverlappingEnrolledSessionsAsync(
                eventId,
                participantId,
                session.StartDateTime,
                session.EndDateTime,
                session.Id,
                Arg.Any<CancellationToken>())
            .Returns(new[] { conflicting });

        await Assert.ThrowsAsync<SessionEnrollmentConflictException>(
            () => service.EnrollAsync(eventId, sessionId, participantId, CancellationToken.None));

        await enrollmentRepository.DidNotReceive()
            .AddEnrollmentAsync(Arg.Any<SessionEnrollment>(), Arg.Any<CancellationToken>());
    }
}

