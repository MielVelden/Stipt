namespace Backend.Web.Features.Sessions.Responses;

public sealed record CreateSessionResponse(
    Guid Id,
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    IReadOnlyCollection<string> Labels,
    DateTime CreatedAtUtc);
