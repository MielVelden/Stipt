namespace Backend.Web.Features.Events.Dtos;

public sealed record UpdateEventDto(
    string Name,
    string Location,
    DateTime StartDate,
    DateTime EndDate,
    UpdateEventStyleDto Style
);

public sealed record UpdateEventStyleDto(
    string PrimaryBackgroundColor,
    string PrimaryForegroundColor,
    string? LogoImageUrl
);
