namespace Backend.Domain.Events;

public sealed class Event
{
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public required EventStyle Style { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
}
