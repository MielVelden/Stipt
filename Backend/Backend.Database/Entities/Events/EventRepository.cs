using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.Events;

internal sealed class EventRepository(ApplicationDbContext dbContext) : IEventRepository
{
    public async Task AddAsync(Event eventItem, CancellationToken cancellationToken)
    {
        await dbContext.Events.AddAsync(eventItem, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<Event?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Event>> GetAllAsync(bool includeArchived, CancellationToken cancellationToken)
    {
        var query = dbContext.Events
            .AsNoTracking();

        if (!includeArchived)
            query = query.Where(x => !x.IsArchived);

        return await query.OrderBy(x => x.StartDate).ToListAsync(cancellationToken);
    }

    public async Task<List<Event>> GetAllForParticipantAsync(string userId, bool includeArchived, CancellationToken cancellationToken)
    {
        var query = dbContext.Events
            .AsNoTracking()
            .Where(e => dbContext.EventParticipants.Any(p => p.EventId == e.Id && p.UserId == userId));

        if (!includeArchived)
            query = query.Where(x => !x.IsArchived);

        return await query.OrderBy(x => x.StartDate).ToListAsync(cancellationToken);
    }

    public async Task<bool> UpdateAsync(Event eventItem, CancellationToken cancellationToken)
    {
        dbContext.Events.Update(eventItem);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var eventItem = await dbContext.Events.FindAsync([id], cancellationToken);
        
        if (eventItem is null)
            return false;

        dbContext.Events.Remove(eventItem);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }
}
