using Backend.Database.Entities.Events;

namespace Backend.Database.Entities.EventParticipants;

public sealed class EventParticipant
{
    public Guid EventId { get; init; }
    public Event Event { get; init; } = null!;
    public required string Email { get; init; }
    public DateTime CreatedAtUtc { get; init; }
}
