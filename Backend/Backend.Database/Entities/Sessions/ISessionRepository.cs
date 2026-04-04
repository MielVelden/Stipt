namespace Backend.Database.Entities.Sessions;

public interface ISessionRepository
{
    Task AddAsync(Session session, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Session>> GetAllAsync(Guid eventId, CancellationToken cancellationToken);
    Task<Session?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken);
    Task<Session?> GetByIdForEnrollmentAsync(Guid eventId, Guid id, CancellationToken cancellationToken);
    Task<SessionEnrollment?> GetEnrollmentAsync(Guid sessionId, Guid participantId, CancellationToken cancellationToken);
    Task AddEnrollmentAsync(SessionEnrollment enrollment, CancellationToken cancellationToken);
    Task UpdateEnrollmentAsync(SessionEnrollment enrollment, CancellationToken cancellationToken);
    Task RemoveEnrollmentAsync(SessionEnrollment enrollment, CancellationToken cancellationToken);
    Task<SessionEnrollment?> GetFirstWaitlistedEnrollmentAsync(Guid sessionId, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Session>> GetOverlappingEnrolledSessionsAsync(
        Guid eventId,
        Guid participantId,
        DateTime startDateTime,
        DateTime endDateTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Session>> GetAgendaAsync(Guid eventId, Guid participantId, CancellationToken cancellationToken);
    Task<bool> HasOverlapAsync(
        Guid eventId,
        Guid roomId,
        DateTime startDateTime,
        DateTime endDateTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken);
    Task<int?> GetWaitlistPositionAsync(Guid sessionId, Guid participantId, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken);
}
