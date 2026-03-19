namespace Backend.Application.Features.Sessions.Responses;

public sealed record GetSessionByIdResponse(
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
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
