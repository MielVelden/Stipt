using Backend.Database.Entities.Events;

namespace Backend.Database.Entities.EventParticipants;

public sealed class EventParticipant
{
    public Guid EventId { get; init; }
    public Event Event { get; init; } = null!;
    public required string UserId { get; init; }
    public ApplicationUser User { get; init; } = null!;
    public DateTime AcceptedAtUtc { get; init; }
    public DateTime CreatedAtUtc { get; init; }
}
