namespace Backend.Application.Features.Sessions.Responses;

public sealed record UpdateSessionResponse(
    Guid Id,
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    IReadOnlyCollection<string> Labels,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc);
