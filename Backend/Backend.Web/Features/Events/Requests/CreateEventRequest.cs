namespace Backend.Web.Features.Events.Requests;

public sealed record CreateEventRequest(
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    CreateEventStyleRequest Style
);

public sealed record CreateEventStyleRequest(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
