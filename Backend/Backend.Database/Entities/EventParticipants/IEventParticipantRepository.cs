namespace Backend.Database.Entities.EventParticipants;

public interface IEventParticipantRepository
{
    Task AddAsync(EventParticipant participant, CancellationToken cancellationToken);
    Task AddRangeAsync(IEnumerable<EventParticipant> participants, CancellationToken cancellationToken);
    Task<EventParticipant?> GetByEventIdAndUserIdAsync(Guid eventId, string userId, CancellationToken cancellationToken);
    Task<List<EventParticipant>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken);
    Task<List<EventParticipant>> GetAllByUserIdAsync(string userId, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid eventId, string userId, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(Guid eventId, string userId, CancellationToken cancellationToken);
}
