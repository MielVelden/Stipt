using Backend.Database.Entities.Sessions;

namespace Backend.Database.Entities.SessionEnrollments;

public interface ISessionEnrollmentRepository
{
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
    Task<int?> GetWaitlistPositionAsync(Guid sessionId, Guid participantId, CancellationToken cancellationToken);
}
