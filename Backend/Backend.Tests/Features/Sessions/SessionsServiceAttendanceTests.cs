using Backend.Database.Entities.SessionEnrollments;
using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.SessionsAttendances;
using Microsoft.AspNetCore.Http;
using NSubstitute;

namespace Backend.Tests.Features.Sessions;

public sealed class SessionsServiceAttendanceTests
{
    [Fact]
    public async Task UpdateAttendanceAsync_WhenParticipantIsEnrolled_CallsUpsert()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var participantId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 10);
        session.Enrollments.Add(new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = participantId,
            Status = SessionEnrollmentStatus.Enrolled,
            CreatedAtUtc = DateTime.UtcNow
        });

        var sessionRepository = Substitute.For<ISessionRepository>();
        sessionRepository.GetWithAttendanceDetailAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);

        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, Substitute.For<ISessionEnrollmentRepository>());

        await service.UpdateAttendanceAsync(eventId, sessionId, participantId, SessionAttendanceStatus.Present, CancellationToken.None);

        await sessionRepository.Received(1)
            .UpsertAttendanceAsync(sessionId, participantId, SessionAttendanceStatus.Present, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAttendanceAsync_WhenSessionNotFound_Throws()
    {
        var sessionRepository = Substitute.For<ISessionRepository>();
        sessionRepository.GetWithAttendanceDetailAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Session?)null);

        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, Substitute.For<ISessionEnrollmentRepository>());

        var exception = await Assert.ThrowsAsync<BadHttpRequestException>(
            () => service.UpdateAttendanceAsync(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), SessionAttendanceStatus.Present, CancellationToken.None));

        Assert.Equal(StatusCodes.Status404NotFound, exception.StatusCode);
    }

    [Fact]
    public async Task UpdateAttendanceAsync_WhenParticipantNotEnrolled_Throws()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 10);

        var sessionRepository = Substitute.For<ISessionRepository>();
        sessionRepository.GetWithAttendanceDetailAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);

        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, Substitute.For<ISessionEnrollmentRepository>());

        var exception = await Assert.ThrowsAsync<BadHttpRequestException>(
            () => service.UpdateAttendanceAsync(eventId, sessionId, Guid.NewGuid(), SessionAttendanceStatus.Present, CancellationToken.None));

        Assert.Equal(StatusCodes.Status400BadRequest, exception.StatusCode);
        await sessionRepository.DidNotReceive()
            .UpsertAttendanceAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<SessionAttendanceStatus>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task MarkUnknownAsAbsentAsync_CallsRepositoryWithOnlyEnrolledIds()
    {
        var eventId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var enrolledId = Guid.NewGuid();
        var waitlistedId = Guid.NewGuid();

        var session = SessionsServiceTestHelpers.BuildSession(eventId, sessionId, capacity: 10);
        session.Enrollments.Add(new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = enrolledId,
            Status = SessionEnrollmentStatus.Enrolled,
            CreatedAtUtc = DateTime.UtcNow
        });
        session.Enrollments.Add(new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = waitlistedId,
            Status = SessionEnrollmentStatus.Waitlisted,
            CreatedAtUtc = DateTime.UtcNow
        });

        var sessionRepository = Substitute.For<ISessionRepository>();
        sessionRepository.GetWithAttendanceDetailAsync(eventId, sessionId, Arg.Any<CancellationToken>())
            .Returns(session);

        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, Substitute.For<ISessionEnrollmentRepository>());

        await service.MarkUnknownAsAbsentAsync(eventId, sessionId, CancellationToken.None);

        await sessionRepository.Received(1)
            .MarkUnknownAsAbsentAsync(
                sessionId,
                Arg.Is<IReadOnlyList<Guid>>(ids => ids.Count == 1 && ids[0] == enrolledId),
                Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task MarkUnknownAsAbsentAsync_WhenSessionNotFound_Throws()
    {
        var sessionRepository = Substitute.For<ISessionRepository>();
        sessionRepository.GetWithAttendanceDetailAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Session?)null);

        var service = SessionsServiceTestHelpers.CreateService(sessionRepository, Substitute.For<ISessionEnrollmentRepository>());

        var exception = await Assert.ThrowsAsync<BadHttpRequestException>(
            () => service.MarkUnknownAsAbsentAsync(Guid.NewGuid(), Guid.NewGuid(), CancellationToken.None));

        Assert.Equal(StatusCodes.Status404NotFound, exception.StatusCode);
    }
}
