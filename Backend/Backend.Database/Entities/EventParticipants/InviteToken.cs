using Backend.Database.Entities.Events;

namespace Backend.Database.Entities.EventParticipants;

public sealed class InviteToken
{
    public Guid Id { get; init; }
    public required string TokenHash { get; init; }
    public Guid EventId { get; init; }
    public Event Event { get; init; } = null!;
    public required string Email { get; init; }
    public DateTime ExpiresAtUtc { get; init; }
    public DateTime CreatedAtUtc { get; init; }
}