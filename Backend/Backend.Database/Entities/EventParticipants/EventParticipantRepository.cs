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

    public Task<EventParticipant?> GetByEventIdAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Email == email, cancellationToken);
    }

    public Task<List<EventParticipant>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .AsNoTracking()
            .Where(x => x.EventId == eventId)
            .OrderBy(x => x.Email)
            .ToListAsync(cancellationToken);
    }

    public Task<List<EventParticipant>> GetAllByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .AsNoTracking()
            .Where(x => x.Email == email)
            .OrderBy(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        var participant = await dbContext.EventParticipants
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Email == email, cancellationToken);

        if (participant is null)
            return false;

        dbContext.EventParticipants.Remove(participant);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public Task<bool> ExistsAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        return dbContext.EventParticipants
            .AsNoTracking()
            .AnyAsync(x => x.EventId == eventId && x.Email == email, cancellationToken);
    }
}
