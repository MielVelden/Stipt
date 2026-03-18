namespace Backend.Application.Features.Events.Responses;

public sealed record CreateEventResponse(
    Guid Id,
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    EventStyleDto Style,
    bool IsArchived,
    DateTime CreatedAtUtc
);
