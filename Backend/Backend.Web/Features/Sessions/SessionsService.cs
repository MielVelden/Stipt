using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.Sessions;
using Backend.Database.Entities.Events;
using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Exceptions;

namespace Backend.Web.Features.Sessions;

public sealed class SessionsService(
    ISessionRepository sessionRepository,
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

        return session.ToRo();
    }

    public async Task<IReadOnlyCollection<SessionRo>> GetAllAsync(Guid eventId, CancellationToken cancellationToken)
    {
        var sessions = await sessionRepository.GetAllAsync(eventId, cancellationToken);
        return sessions
            .Select(session => session.ToRo())
            .ToArray();
    }

    public async Task<SessionRo?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(eventId, id, cancellationToken);
        return session?.ToRo();
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

        return existingSession.ToRo();
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        return await sessionRepository.DeleteAsync(eventId, id, cancellationToken);
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
}

