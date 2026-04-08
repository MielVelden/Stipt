using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.Sessions;

internal sealed class SessionRepository(ApplicationDbContext dbContext) : ISessionRepository
{
    public async Task AddAsync(Session session, CancellationToken cancellationToken)
    {
        await dbContext.Sessions.AddAsync(session, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<Session?> GetByIdAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetFilteredAsync(Guid eventId, SessionFilter filter, CancellationToken cancellationToken)
    {
        var query = dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Enrollments)
            .Where(x => x.EventId == eventId);

        if (filter.Labels is { Count: > 0 })
            query = query.Where(s => s.Labels.Any(label => filter.Labels.Contains(label)));


        return await query
            .OrderBy(x => x.StartDateTime)
            .ThenBy(x => x.Room.Name)
            .ToListAsync(cancellationToken);
    }


    public async Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken)
    {
        dbContext.Sessions.Update(session);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(Guid eventId, Guid id, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, cancellationToken);

        if (session is null)
            return false;

        dbContext.Sessions.Remove(session);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> HasOverlapAsync(
        Guid eventId,
        Guid roomId,
        DateTime startDateTime,
        DateTime endDateTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .AnyAsync(
                s => (!excludedSessionId.HasValue || s.Id != excludedSessionId.Value)
                     && s.EventId == eventId
                     && s.RoomId == roomId
                     && s.StartDateTime < endDateTime
                     && s.EndDateTime > startDateTime,
                cancellationToken);
    }

}
