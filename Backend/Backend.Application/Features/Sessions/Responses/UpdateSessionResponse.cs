using NodaTime;

namespace Backend.Application.Features.Sessions.Responses;

public sealed record UpdateSessionResponse(
    Guid Id,
    string Title,
    string? Description,
    string Speaker,
    string Room,
    Instant StartTime,
    Instant EndTime,
    int? Capacity,
    IReadOnlyCollection<string> Tags,
    bool IsArchived,
    Instant CreatedAtUtc,
    Instant UpdatedAtUtc);
