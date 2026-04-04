using Backend.Database.Entities.Events;
using Backend.Database.Entities.Rooms;

namespace Backend.Database.Entities.Sessions;

public sealed class Session
{
    public Guid Id { get; init; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public SessionType Type { get; set; }
    public required string Speaker { get; set; }
    public Guid RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public int? Capacity { get; set; }
    public List<string> Labels { get; set; } = [];
    public ICollection<SessionEnrollment> Enrollments { get; set; } = new List<SessionEnrollment>();
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
}

