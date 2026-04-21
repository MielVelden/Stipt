namespace Backend.Database.Entities.Events;

public interface IEventRepository
{
    Task AddAsync(Event eventItem, CancellationToken cancellationToken);
    Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<Event>> GetAllAsync(bool includeArchived, CancellationToken cancellationToken);
    Task<bool> UpdateAsync(Event eventItem, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

