using Backend.Web.Features.Events.Repositories;
using Backend.Database.Persistence;
using Backend.Domain.Events;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Repositories;

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

    public async Task<List<Event>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Events
            .AsNoTracking()
            .OrderBy(x => x.StartDate)
            .ToListAsync(cancellationToken);
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
