using Backend.Database.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database.Entities.EventParticipants;

internal sealed class InviteTokenRepository(ApplicationDbContext dbContext) : IInviteTokenRepository
{
    public async Task AddAsync(InviteToken inviteToken, CancellationToken cancellationToken)
    {
        await dbContext.InviteTokens.AddAsync(inviteToken, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AddRangeAsync(IEnumerable<InviteToken> inviteTokens, CancellationToken cancellationToken)
    {
        await dbContext.InviteTokens.AddRangeAsync(inviteTokens, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<InviteToken?> GetByEventIdAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        return dbContext.InviteTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.EventId == eventId && x.Email == email, cancellationToken);
    }

    public Task<List<InviteToken>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken)
    {
        return dbContext.InviteTokens
            .AsNoTracking()
            .Where(x => x.EventId == eventId)
            .OrderBy(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public Task<InviteToken?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken)
    {
        return dbContext.InviteTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var token = await dbContext.InviteTokens
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (token is null)
            return false;

        dbContext.InviteTokens.Remove(token);
        var result = await dbContext.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public Task<bool> ExistsAsync(Guid eventId, string email, CancellationToken cancellationToken)
    {
        return dbContext.InviteTokens
            .AsNoTracking()
            .AnyAsync(x => x.EventId == eventId && x.Email == email, cancellationToken);
    }
}