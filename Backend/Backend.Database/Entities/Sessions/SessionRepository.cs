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
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetAllAsync(Guid eventId, CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .Include(x => x.Room)
            .Where(x => x.EventId == eventId)
            .OrderBy(x => x.StartDateTime)
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
