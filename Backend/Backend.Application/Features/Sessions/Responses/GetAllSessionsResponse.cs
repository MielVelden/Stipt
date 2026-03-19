namespace Backend.Application.Features.Sessions.Responses;

public sealed record GetAllSessionsResponse(
    Guid Id,
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    IReadOnlyCollection<string> Tags,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
