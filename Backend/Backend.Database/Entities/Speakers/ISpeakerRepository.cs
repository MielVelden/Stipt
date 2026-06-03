namespace Backend.Database.Entities.Speakers;

public interface ISpeakerRepository
{
    Task<Guid> CreateAsync(Speaker speaker, CancellationToken ct);
    Task<List<Speaker>> GetAllAsync(Guid eventId, CancellationToken ct);
    Task<Speaker?> GetByIdAsync(Guid eventId, Guid id, CancellationToken ct);
    Task UpdateAsync(Speaker speaker, CancellationToken ct);
    Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken ct);
    Task<List<Speaker>> GetByIdsAsync(Guid eventId, IEnumerable<Guid> ids, CancellationToken ct);
}
