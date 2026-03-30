using Backend.Database.Entities.Events;
using Backend.Database.Entities.Sessions;

namespace Backend.Database.Entities.Rooms;

public sealed class Room
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required int Capacity { get; set; }
    
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}

