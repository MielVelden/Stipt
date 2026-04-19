namespace Backend.Database.Entities.Rooms;

public interface IRoomRepository
{
    Task<Guid> CreateAsync(Room room, CancellationToken ct);
    Task<List<Room>> GetAllAsync(Guid eventId, CancellationToken ct);
    Task<Room?> GetByIdAsync(Guid eventId, Guid id, CancellationToken ct);
    Task UpdateAsync(Room room, CancellationToken ct);
    Task DeleteAsync(Guid eventId, Guid id, CancellationToken ct);
}

