using Backend.Application.Features.Sessions.Repositories;
using Backend.Database.Persistence;
using Backend.Domain.Sessions;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Repositories;

internal sealed class SessionRepository(ApplicationDbContext dbContext) : ISessionRepository
{
    public async Task AddAsync(Session session, CancellationToken cancellationToken)
    {
        await dbContext.Sessions.AddAsync(session, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Sessions
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Session>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Sessions
            .AsNoTracking()
            .OrderBy(x => x.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken)
    {
        dbContext.Sessions.Update(session);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions.FindAsync([id], cancellationToken);

        if (session is null)
            return false;

        dbContext.Sessions.Remove(session);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> HasOverlapAsync(
        string room,
        DateTimeOffset startTime,
        DateTimeOffset endTime,
        Guid? excludedSessionId,
        CancellationToken cancellationToken)
    {
        var normalizedRoom = room.Trim().ToLower();

        return await dbContext.Sessions
            .AsNoTracking()
            .AnyAsync(
                s => (!excludedSessionId.HasValue || s.Id != excludedSessionId.Value)
                     && s.Room.ToLower() == normalizedRoom
                     && s.StartTime < endTime
                     && s.EndTime > startTime,
                cancellationToken);
    }
}
