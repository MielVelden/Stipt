namespace Backend.Web.Features.Events.Responses;

public sealed record GetAllEventsResponse(
    Guid Id,
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    EventStyleDto Style,
    bool IsArchived,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
);
