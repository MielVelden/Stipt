using Backend.Application.Features.Rooms.Repositories;
using Backend.Database.Persistence;
using Backend.Domain.Rooms;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Repositories;

internal sealed class RoomRepository(ApplicationDbContext dbContext) : IRoomRepository
{
    public async Task<Guid> CreateAsync(Room room, CancellationToken ct)
    {
        await dbContext.Rooms.AddAsync(room, ct);
        await dbContext.SaveChangesAsync(ct);
        return room.Id;
    }

    public Task<List<Room>> GetAllAsync(CancellationToken ct)
    {
        return dbContext.Rooms
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public Task<Room?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return dbContext.Rooms
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task UpdateAsync(Room room, CancellationToken ct)
    {
        dbContext.Rooms.Update(room);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var room = await dbContext.Rooms.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (room != null)
        {
            dbContext.Rooms.Remove(room);
            await dbContext.SaveChangesAsync(ct);
        }
    }
}