using Backend.Database.Entities.Rooms;
using Backend.Database.Entities.Sessions;
using NodaTime;

namespace Backend.Database.Entities.Events;

public sealed class Event
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public LocalDateTime StartDate { get; set; }
    public LocalDateTime EndDate { get; set; }
    public required EventStyle Style { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
    
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}

