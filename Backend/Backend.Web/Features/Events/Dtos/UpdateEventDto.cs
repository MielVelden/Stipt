namespace Backend.Web.Features.Events.Dtos;

public sealed record UpdateEventDto(
    string Name,
    string Location,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    UpdateEventStyleDto Style
);

public sealed record UpdateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
