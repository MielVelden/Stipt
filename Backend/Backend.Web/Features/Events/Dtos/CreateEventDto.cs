namespace Backend.Web.Features.Events.Dtos;

public sealed record CreateEventDto(
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    CreateEventStyleDto Style
);

public sealed record CreateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);

