using NodaTime;

namespace Backend.Domain.Sessions;

public sealed class Session
{
    public Guid Id { get; init; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string Speaker { get; set; }
    public required string Room { get; set; }
    public Instant StartTime { get; set; }
    public Instant EndTime { get; set; }
    public int? Capacity { get; set; }
    public List<string> Tags { get; set; } = [];
    public bool IsArchived { get; set; }
    public Instant CreatedAtUtc { get; init; }
    public Instant? UpdatedAtUtc { get; set; }
}