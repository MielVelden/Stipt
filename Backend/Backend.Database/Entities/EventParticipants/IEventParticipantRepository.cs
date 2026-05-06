namespace Backend.Database.Entities.EventParticipants;

public interface IEventParticipantRepository
{
    Task AddAsync(EventParticipant participant, CancellationToken cancellationToken);
    Task AddRangeAsync(IEnumerable<EventParticipant> participants, CancellationToken cancellationToken);
    Task<EventParticipant?> GetByEventIdAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken);
    Task<List<EventParticipant>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken);
    Task<List<EventParticipant>> GetAllByEmailAsync(string email, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid eventId, string email, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(Guid eventId, string email, CancellationToken cancellationToken);
}
