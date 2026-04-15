using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.Events;
using Backend.Database.Entities.SessionEnrollments;
using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Exceptions;

namespace Backend.Web.Features.Sessions;

public sealed class SessionsService(
    ISessionRepository sessionRepository,
    ISessionEnrollmentRepository sessionEnrollmentRepository,
    IRoomRepository roomRepository,
    IEventRepository eventRepository)
{
    public async Task<SessionRo> CreateAsync(Guid eventId, CreateSessionDto request, CancellationToken cancellationToken)
    {
        var eventItem = await eventRepository.GetByIdAsync(eventId, cancellationToken) ?? throw new BadHttpRequestException("Het evenement bestaat niet.", StatusCodes.Status400BadRequest);
        EnsureWithinEventPeriod(request.StartDateTime, request.EndDateTime, eventItem);

        var room = await roomRepository.GetByIdAsync(eventId, request.RoomId, cancellationToken) ?? throw new BadHttpRequestException("De ruimte bestaat niet voor dit evenement.", StatusCodes.Status400BadRequest);
        var hasOverlap = await sessionRepository.HasOverlapAsync(
            eventId,
            request.RoomId,
            request.StartDateTime,
            request.EndDateTime,
            excludedSessionId: null,
            cancellationToken);

        if (hasOverlap)
            throw new SessionTimeSlotOverlapException();

        var session = new Session
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Type = request.Type,
            Speaker = request.Speaker.Trim(),
            RoomId = request.RoomId,
            EventId = eventId,
            StartDateTime = request.StartDateTime,
            EndDateTime = request.EndDateTime,
            Capacity = request.Capacity,
            Labels = request.Labels.Select(label => label.Trim()).ToList(),
            CreatedAtUtc = DateTime.UtcNow
        };

        await sessionRepository.AddAsync(session, cancellationToken);

        session.Room = room;

        return session.ToRo(null);
    }

    public async Task<IReadOnlyCollection<SessionRo>> GetAllAsync(Guid eventId, Guid? userId, CancellationToken cancellationToken)
    {
        var sessions = await sessionRepository.GetAllAsync(eventId, cancellationToken);
        return sessions
            .Select(session => session.ToRo(userId))
            .ToArray();
    }

    public async Task<SessionRo?> GetByIdAsync(Guid eventId, Guid id, Guid? userId, CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(eventId, id, cancellationToken);
        return session?.ToRo(userId);
    }

    public async Task<SessionRo?> UpdateAsync(Guid eventId, Guid id, UpdateSessionDto request, CancellationToken cancellationToken)
    {
        var existingSession = await sessionRepository.GetByIdAsync(eventId, id, cancellationToken);
        if (existingSession is null)
            return null;

        var eventItem = await eventRepository.GetByIdAsync(eventId, cancellationToken) ?? throw new BadHttpRequestException("Het evenement bestaat niet.", StatusCodes.Status400BadRequest);
        EnsureWithinEventPeriod(request.StartDateTime, request.EndDateTime, eventItem);

        var room = await roomRepository.GetByIdAsync(eventId, request.RoomId, cancellationToken) ?? throw new BadHttpRequestException("De ruimte bestaat niet voor dit evenement.", StatusCodes.Status400BadRequest);
        var hasOverlap = await sessionRepository.HasOverlapAsync(
            eventId,
            request.RoomId,
            request.StartDateTime,
            request.EndDateTime,
            id,
            cancellationToken);

        if (hasOverlap)
            throw new SessionTimeSlotOverlapException();

        existingSession.Title = request.Title.Trim();
        existingSession.Description = request.Description?.Trim();
        existingSession.Type = request.Type;
        existingSession.Speaker = request.Speaker.Trim();
        existingSession.RoomId = request.RoomId;
        existingSession.EventId = eventId;
        existingSession.StartDateTime = request.StartDateTime;
        existingSession.EndDateTime = request.EndDateTime;
        existingSession.Capacity = request.Capacity;
        existingSession.Labels = request.Labels.Select(label => label.Trim()).ToList();
        existingSession.UpdatedAtUtc = DateTime.UtcNow;

        var updated = await sessionRepository.UpdateAsync(existingSession, cancellationToken);
        if (!updated)
            return null;

        existingSession.Room = room;

        return existingSession.ToRo(null);
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        return await sessionRepository.DeleteAsync(eventId, id, cancellationToken);
    }

    public async Task<SessionRo> EnrollAsync(
        Guid eventId,
        Guid sessionId,
        Guid participantId,
        CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(eventId, sessionId, cancellationToken);
        if (session is null)
            throw new BadHttpRequestException("De sessie bestaat niet.", StatusCodes.Status404NotFound);

        var existingEnrollment = session.Enrollments.FirstOrDefault(x => x.ParticipantId == participantId);
        if (existingEnrollment is not null)
            return session.ToRo(participantId);

        var conflictingSessions = await sessionEnrollmentRepository.GetOverlappingEnrolledSessionsAsync(
            eventId,
            participantId,
            session.Id,
            cancellationToken);

        if (conflictingSessions.Count > 0)
            throw new SessionEnrollmentConflictException(conflictingSessions.Select(item => item.ToConflictingSessionRo()).ToArray());

        var enrolledCount = session.Enrollments.Count(x => x.Status == SessionEnrollmentStatus.Enrolled);
        var status = HasAvailableSpots(session, enrolledCount)
            ? SessionEnrollmentStatus.Enrolled
            : SessionEnrollmentStatus.Waitlisted;

        var enrollment = new SessionEnrollment
        {
            Id = Guid.NewGuid(),
            SessionId = sessionId,
            ParticipantId = participantId,
            Status = status,
            CreatedAtUtc = DateTime.UtcNow
        };

        await sessionEnrollmentRepository.AddEnrollmentAsync(enrollment, cancellationToken);

        var updatedSession = await sessionRepository.GetByIdAsync(eventId, sessionId, cancellationToken)
            ?? throw new BadHttpRequestException("De sessie bestaat niet.", StatusCodes.Status404NotFound);

        return updatedSession.ToRo(participantId);
    }

    public async Task<SessionRo> ReplaceEnrollmentAsync(
        Guid eventId,
        Guid sessionId,
        Guid participantId,
        Guid sessionIdToUnenroll,
        CancellationToken cancellationToken)
    {
        if (sessionId == sessionIdToUnenroll)
            throw new BadHttpRequestException("Kies een andere sessie om uit te schrijven.", StatusCodes.Status400BadRequest);

        var targetSession = await sessionRepository.GetByIdAsync(eventId, sessionId, cancellationToken)
            ?? throw new BadHttpRequestException("De sessie bestaat niet.", StatusCodes.Status404NotFound);

        var sessionToUnenroll = await sessionRepository.GetByIdAsync(eventId, sessionIdToUnenroll, cancellationToken)
            ?? throw new BadHttpRequestException("De sessie om uit te schrijven bestaat niet.", StatusCodes.Status400BadRequest);

        var enrollmentToUnenroll = sessionToUnenroll.Enrollments
            .FirstOrDefault(x => x.ParticipantId == participantId && x.Status == SessionEnrollmentStatus.Enrolled);

        if (enrollmentToUnenroll is null)
            throw new BadHttpRequestException("Je bent niet ingeschreven op de gekozen sessie.", StatusCodes.Status400BadRequest);

        var overlaps = sessionToUnenroll.StartDateTime < targetSession.EndDateTime
                       && sessionToUnenroll.EndDateTime > targetSession.StartDateTime;
        if (!overlaps)
            throw new BadHttpRequestException("De gekozen sessie overlapt niet met de nieuwe sessie.", StatusCodes.Status400BadRequest);

        var conflicts = await sessionEnrollmentRepository.GetOverlappingEnrolledSessionsAsync(
            eventId,
            participantId,
            targetSession.Id,
            cancellationToken);

        var hasRequestedConflict = conflicts.Any(x => x.Id == sessionIdToUnenroll);
        if (!hasRequestedConflict)
            throw new BadHttpRequestException("De gekozen sessie kan niet worden vervangen voor deze overlap.", StatusCodes.Status400BadRequest);

        var remainingConflicts = conflicts.Where(x => x.Id != sessionIdToUnenroll).ToArray();
        if (remainingConflicts.Length > 0)
            throw new SessionEnrollmentConflictException(remainingConflicts.Select(item => item.ToConflictingSessionRo()).ToArray());

        var unenrolled = await UnenrollAsync(eventId, sessionIdToUnenroll, participantId, cancellationToken);
        if (!unenrolled)
            throw new BadHttpRequestException("Uitschrijven is mislukt.", StatusCodes.Status400BadRequest);

        return await EnrollAsync(eventId, sessionId, participantId, cancellationToken);
    }

    public async Task<bool> UnenrollAsync(
        Guid eventId,
        Guid sessionId,
        Guid participantId,
        CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(eventId, sessionId, cancellationToken);
        if (session is null)
            return false;

        var enrollment = session.Enrollments.FirstOrDefault(x => x.ParticipantId == participantId);
        if (enrollment is null)
            return false;

        var wasEnrolled = enrollment.Status == SessionEnrollmentStatus.Enrolled;
        await sessionEnrollmentRepository.RemoveEnrollmentAsync(enrollment, cancellationToken);

        if (wasEnrolled)
            await PromoteFirstWaitlistedParticipantAsync(sessionId, cancellationToken);

        return true;
    }

    private static void EnsureWithinEventPeriod(DateTime startDateTime, DateTime endDateTime, Event eventItem)
    {
        if (startDateTime < eventItem.StartDate || endDateTime > eventItem.EndDate)
        {
            throw new BadHttpRequestException(
                "De sessie moet starten en eindigen binnen de eventperiode.",
                StatusCodes.Status400BadRequest);
        }
    }

    private async Task PromoteFirstWaitlistedParticipantAsync(Guid sessionId, CancellationToken cancellationToken)
    {
        var nextWaitlisted = await sessionEnrollmentRepository.GetFirstWaitlistedEnrollmentAsync(sessionId, cancellationToken);
        if (nextWaitlisted is null)
            return;

        nextWaitlisted.Status = SessionEnrollmentStatus.Enrolled;
        nextWaitlisted.UpdatedAtUtc = DateTime.UtcNow;
        await sessionEnrollmentRepository.UpdateEnrollmentAsync(nextWaitlisted, cancellationToken);
    }


    private static bool HasAvailableSpots(Session session, int enrolledCount)
    {
        var effectiveCapacity = session.Capacity ?? session.Room.Capacity;
        return enrolledCount < effectiveCapacity;
    }
}
