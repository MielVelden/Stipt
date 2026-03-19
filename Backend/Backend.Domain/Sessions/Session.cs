namespace Backend.Domain.Sessions;

public sealed class Session
{
    public Guid Id { get; init; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string Speaker { get; set; }
    public required string Room { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public int? Capacity { get; set; }
    public List<string> Labels { get; set; } = [];
    public DateTime CreatedAtUtc { get; init; }
    public DateTime? UpdatedAtUtc { get; set; }
}
