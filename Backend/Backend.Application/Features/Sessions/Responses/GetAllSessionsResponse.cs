using NodaTime;

namespace Backend.Application.Features.Sessions.Responses;

public sealed record GetAllSessionsResponse(
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
    Instant? UpdatedAtUtc);
