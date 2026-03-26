namespace Backend.Database.Entities.Sessions;

public interface ISessionRepository
{
    Task AddAsync(Session session, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Session>> GetAllAsync(CancellationToken cancellationToken);
    Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> HasOverlapAsync(
        string room,
        DateTimeOffset startTime,
        DateTimeOffset endTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken);
}

