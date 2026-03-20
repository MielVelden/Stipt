using System.Collections.Concurrent;
using Backend.Application.Features.Sessions.Repositories;
using Backend.Domain.Sessions;
using NodaTime;

namespace Backend.Database.Repositories;

internal sealed class MockSessionRepository : ISessionRepository
{
    private readonly ConcurrentDictionary<Guid, Session> sessions = new();

    public Task AddAsync(Session session, CancellationToken cancellationToken)
    {
        sessions[session.Id] = Clone(session);
        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = sessions.TryRemove(id, out _);
        return Task.FromResult(deleted);
    }

    public Task<IReadOnlyCollection<Session>> GetAllAsync(CancellationToken cancellationToken)
    {
        var result = sessions.Values
            .OrderBy(x => x.StartTime)
            .Select(Clone)
            .ToArray();

        return Task.FromResult<IReadOnlyCollection<Session>>(result);
    }

    public Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var session = sessions.TryGetValue(id, out var existing)
            ? Clone(existing)
            : null;

        return Task.FromResult(session);
    }

    public Task<bool> HasOverlapAsync(
        string room,
        Instant startTime,
        Instant endTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken)
    {
        var normalizedRoom = room.Trim();

        var hasOverlap = sessions.Values.Any(session =>
            (!excludedSessionId.HasValue || session.Id != excludedSessionId.Value)
            && string.Equals(session.Room, normalizedRoom, StringComparison.OrdinalIgnoreCase)
            && startTime < session.EndTime
            && endTime > session.StartTime);

        return Task.FromResult(hasOverlap);
    }

    public Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken)
    {
        if (!sessions.ContainsKey(session.Id))
            return Task.FromResult(false);

        sessions[session.Id] = Clone(session);
        return Task.FromResult(true);
    }

    private static Session Clone(Session session) =>
        new()
        {
            Id = session.Id,
            Title = session.Title,
            Description = session.Description,
            Speaker = session.Speaker,
            Room = session.Room,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Capacity = session.Capacity,
            Tags = session.Tags.ToList()
        };
}
