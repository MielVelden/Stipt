namespace Backend.Application.Features.Sessions.Responses;

public sealed record CreateSessionResponse(
    Guid Id,
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    IReadOnlyCollection<string> Tags,
    bool IsArchived,
    DateTime CreatedAtUtc);
