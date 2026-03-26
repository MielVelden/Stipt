using Backend.Database.Entities.Sessions;
using Backend.Web.Features.Sessions.Dtos;
using Backend.Web.Features.Sessions.Exceptions;

namespace Backend.Web.Features.Sessions;

public sealed class SessionsService(ISessionRepository sessionRepository)
{
    public async Task<SessionRo> CreateAsync(CreateSessionDto request, CancellationToken cancellationToken)
    {
        var hasOverlap = await sessionRepository.HasOverlapAsync(
            request.Room,
            request.StartTime,
            request.EndTime,
            excludedSessionId: null,
            cancellationToken);

        if (hasOverlap)
            throw new SessionTimeSlotOverlapException();

        var session = new Session
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Speaker = request.Speaker.Trim(),
            Room = request.Room.Trim(),
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Capacity = request.Capacity,
            Labels = request.Labels.Select(label => label.Trim()).ToList(),
            CreatedAtUtc = DateTime.UtcNow
        };

        await sessionRepository.AddAsync(session, cancellationToken);

        return session.ToRo();
    }

    public async Task<IReadOnlyCollection<SessionRo>> GetAllAsync(CancellationToken cancellationToken)
    {
        var sessions = await sessionRepository.GetAllAsync(cancellationToken);
        return sessions
            .Select(session => session.ToRo())
            .ToArray();
    }

    public async Task<SessionRo?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var session = await sessionRepository.GetByIdAsync(id, cancellationToken);
        return session?.ToRo();
    }

    public async Task<SessionRo?> UpdateAsync(Guid id, UpdateSessionDto request, CancellationToken cancellationToken)
    {

        var existingSession = await sessionRepository.GetByIdAsync(id, cancellationToken);
        if (existingSession is null)
            return null;

        var hasOverlap = await sessionRepository.HasOverlapAsync(
            request.Room,
            request.StartTime,
            request.EndTime,
            id,
            cancellationToken);

        if (hasOverlap)
            throw new SessionTimeSlotOverlapException();

        existingSession.Title = request.Title.Trim();
        existingSession.Description = request.Description?.Trim();
        existingSession.Speaker = request.Speaker.Trim();
        existingSession.Room = request.Room.Trim();
        existingSession.StartTime = request.StartTime;
        existingSession.EndTime = request.EndTime;
        existingSession.Capacity = request.Capacity;
        existingSession.Labels = request.Labels.Select(label => label.Trim()).ToList();
        existingSession.UpdatedAtUtc = DateTime.UtcNow;

        var updated = await sessionRepository.UpdateAsync(existingSession, cancellationToken);
        if (!updated)
            return null;

        return existingSession.ToRo();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return await sessionRepository.DeleteAsync(id, cancellationToken);
    }
}

