using NodaTime;

namespace Backend.Application.Features.Sessions.Responses;

public sealed record GetSessionByIdResponse(
    Guid Id,
    string Title,
    string Description,
    string Speaker,
    string Room,
    Instant StartTime,
    Instant EndTime,
    int? Capacity,
    IReadOnlyCollection<string> Labels);
