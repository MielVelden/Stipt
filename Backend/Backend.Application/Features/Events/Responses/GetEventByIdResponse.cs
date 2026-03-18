using Backend.Application.Features.Events.Requests;

namespace Backend.Application.Features.Events.Responses;

public sealed record GetEventByIdResponse(
    Guid Id,
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    EventStyleDto Style,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
);
