namespace Backend.Database.Entities.EventParticipants;

public interface IInviteTokenRepository
{
    Task AddAsync(InviteToken inviteToken, CancellationToken cancellationToken);
    Task AddRangeAsync(IEnumerable<InviteToken> inviteTokens, CancellationToken cancellationToken);
    Task<InviteToken?> GetByEventIdAndEmailAsync(Guid eventId, string email, CancellationToken cancellationToken);
    Task<List<InviteToken>> GetAllByEventIdAsync(Guid eventId, CancellationToken cancellationToken);
    Task<InviteToken?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> ExistsAsync(Guid eventId, string email, CancellationToken cancellationToken);
}