using NodaTime;

namespace Backend.Domain.Sessions;

public sealed class Session
{
    public Guid Id { get; init; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Speaker { get; set; }
    public string Room { get; set; } // TODO String needs to be replaced by Room type
    public Instant StartTime { get; set; }
    public Instant EndTime { get; set; }
    public int? Capacity { get; set; }
    public List<string> Labels { get; set; }
}