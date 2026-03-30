using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.Rooms;

internal sealed class RoomRepository(ApplicationDbContext dbContext) : IRoomRepository
{
    public async Task<Guid> CreateAsync(Room room, CancellationToken ct)
    {
        await dbContext.Rooms.AddAsync(room, ct);
        await dbContext.SaveChangesAsync(ct);
        return room.Id;
    }

        public Task<List<Room>> GetAllAsync(Guid eventId, CancellationToken ct)
    {
        return dbContext.Rooms
            .AsNoTracking()
            .Where(x => x.EventId == eventId)
            .ToListAsync(ct);
    }

        public Task<Room?> GetByIdAsync(Guid eventId, Guid id, CancellationToken ct)
    {
        return dbContext.Rooms
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, ct);
    }

    public async Task UpdateAsync(Room room, CancellationToken ct)
    {
        dbContext.Rooms.Update(room);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid eventId, Guid id, CancellationToken ct)
    {
        var room = await dbContext.Rooms.FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, ct);
        if (room != null)
        {
            dbContext.Rooms.Remove(room);
            await dbContext.SaveChangesAsync(ct);
        }
    }
}