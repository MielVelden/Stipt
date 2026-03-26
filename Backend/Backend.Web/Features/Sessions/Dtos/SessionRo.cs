namespace Backend.Web.Features.Sessions.Dtos;

public sealed record SessionRo(
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
    DateTime? UpdatedAtUtc);
