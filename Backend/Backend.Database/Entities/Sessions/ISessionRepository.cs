using NodaTime;

namespace Backend.Database.Entities.Sessions;

public interface ISessionRepository
{
    Task AddAsync(Session session, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Session>> GetFilteredAsync(Guid eventId, SessionFilter filter, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Session>> GetAgendaSessionsAsync(Guid eventId, Guid participantId, SessionFilter filter, CancellationToken cancellationToken);
    Task<Session?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken);
    Task<Session?> GetTrackedWithSpeakersAsync(Guid eventId, Guid id, CancellationToken cancellationToken);
    Task<bool> HasOverlapAsync(
        Guid eventId,
        Guid roomId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken);
}
