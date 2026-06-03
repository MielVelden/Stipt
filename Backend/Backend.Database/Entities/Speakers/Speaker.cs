using Backend.Database.Entities.Events;
using Backend.Database.Entities.Images;
using Backend.Database.Entities.Sessions;

namespace Backend.Database.Entities.Speakers;

public sealed class Speaker
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public string? Title { get; set; }
    public string? Company { get; set; }
    public string? Bio { get; set; }
    public Guid? PhotoId { get; set; }
    public Image? Photo { get; set; }
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
}
