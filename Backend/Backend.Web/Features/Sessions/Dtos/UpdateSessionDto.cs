namespace Backend.Web.Features.Sessions.Dtos;

public sealed record UpdateSessionDto(
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    List<string> Labels);

