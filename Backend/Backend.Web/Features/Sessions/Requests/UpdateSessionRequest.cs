namespace Backend.Web.Features.Sessions.Requests;

public sealed record UpdateSessionRequest(
    Guid Id,
    string Title,
    string? Description,
    string Speaker,
    string Room,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    int? Capacity,
    List<string> Labels);
