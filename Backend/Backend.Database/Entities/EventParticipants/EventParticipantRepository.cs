using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.EventParticipants;

internal sealed class EventParticipantRepository(ApplicationDbContext dbContext) : IEventParticipantRepository
{
    public async Task AddAsync(EventParticipant participant, CancellationToken cancellationToken)
    {
        await dbContext.EventParticipants.AddAsync(participant, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<EventParticipant> participants, CancellationToken cancellationToken)
    {
        await dbContext.EventParticipants.AddRangeAsync(participants, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<EventParticipant?> GetByEventIdAndUserIdAsync(Guid eventId, string userId, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .Include(x => x.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.UserId == userId, cancellationToken);
    }

    public Task<List<EventParticipant>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .Include(x => x.User)
            .AsNoTracking()
            .Where(x => x.EventId == eventId)
            .OrderBy(x => x.User.Email)
            .ToListAsync(cancellationToken);
    }

    public Task<List<EventParticipant>> GetAllByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .Include(x => x.User)
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid eventId, string userId, CancellationToken cancellationToken)
    {
        var participant = await dbContext.EventParticipants
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.UserId == userId, cancellationToken);

        if (participant is null)
            return false;

        dbContext.EventParticipants.Remove(participant);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public Task<bool> ExistsAsync(Guid eventId, string userId, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .AsNoTracking()
            .AnyAsync(x => x.EventId == eventId && x.UserId == userId, cancellationToken);
    }
}
