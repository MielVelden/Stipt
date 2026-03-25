namespace Backend.Web.Features.Events.Dtos;

public sealed record CreateEventDto(
    string Name,
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    CreateEventStyleDto Style
);

public sealed record CreateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
